<template>
  <div>
    <q-card>
        <q-card-section class="bg-primary text-white q-pa-sm">
            <div class="row items-center"><q-icon name="biotech" size="24px" class="q-mr-sm" />Feature Selector</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
            Protocol:
            <q-select
                outlined dense options-dense
                v-model="selectedProtocol" :options="protocols"
                option-label="name" option-value="id"
                @update:model-value="onProtocolSelected"
                class="selectBox">
                <template v-slot:prepend>
                    <q-icon name="text_snippet" />
                </template>
            </q-select>
            Feature:
            <q-select
                outlined dense options-dense
                v-model="selectedFeature" :options="filteredFeatures"
                use-input input-debounce="0" @filter="applyFeatureFilter"
                option-label="name" option-value="id"
                @update:model-value="onFeatureSelected"
                class="selectBox">
                <template v-slot:prepend>
                    <q-icon name="biotech" />
                </template>
            </q-select>
        </q-card-section>
        <q-separator />
        <q-card-section>
            <ColorLegend></ColorLegend>
        </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>
    .selectBox {
        margin: 5px;
    }
</style>

<script>
    import { ref, watch, toRefs } from 'vue'
    import { useStore } from 'vuex'

    import ColorLegend from "@/components/widgets/ColorLegend.vue"

    export default {
        props: {
            protocols: Array
        },
        components: {
            ColorLegend
        },
        emits: [ 'featureSelection' ],
        setup(props, context) {
            const store = useStore()

            watch(toRefs(props).protocols, () => {
                selectedProtocol.value = props.protocols[0]
                onProtocolSelected()
            })
            
            // Protocol selection
            const selectedProtocol = ref(null)
            const onProtocolSelected = () => {
                store.dispatch('features/loadByProtocolId', selectedProtocol.value.id).then(() => {
                    allFeatures.value = store.getters['features/getByProtocolId'](selectedProtocol.value.id)
                    if (allFeatures.value && allFeatures.value.length > 0) {
                        selectedFeature.value = allFeatures.value[0]
                        onFeatureSelected(selectedFeature.value)
                    }
                })
            }

            // Feature selection
            const allFeatures = ref([])
            const filteredFeatures = ref(allFeatures.value)
            const selectedFeature = ref(null)
            const onFeatureSelected = (value) => {
                context.emit('featureSelection', value)
            }
            const applyFeatureFilter = (val, update) => {
               if (val === '') {
                    update(() => {
                        filteredFeatures.value = allFeatures.value
                    })
                    return
                }
                update(() => {
                    filteredFeatures.value = allFeatures.value.filter(v => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1)
                })
            }

            return {
                selectedProtocol,
                onProtocolSelected,

                filteredFeatures,
                selectedFeature,
                onFeatureSelected,
                applyFeatureFilter
            }
        }
    }
</script>