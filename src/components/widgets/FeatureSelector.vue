<template>
  <div>
    <q-card>
        <q-card-section class="bg-primary text-white q-pa-sm">
            <div class="row items-center"><q-icon name="biotech" size="24px" class="q-mr-sm" />Feature Selector</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
            Measurement:
            <q-select
                outlined dense options-dense
                v-model="measModel" :options="measList"
                option-label="name" option-value="id"
                @update:model-value="onMeasSelectionChanged"
                class="selectBox">
                <template v-slot:prepend>
                    <q-icon name="text_snippet" />
                </template>
            </q-select>
            ResultSet:
            <q-select
                outlined dense options-dense
                v-model="resModel" :options="resList"
                :option-label="resultSetLabelProvider"
                @update:model-value="onResSelectionChanged"
                class="selectBox">
                <template v-slot:prepend>
                    <q-icon name="find_in_page" />
                </template>
            </q-select>
            Feature:
            <q-select
                outlined dense options-dense
                v-model="featureModel" :options="featureList"
                use-input input-debounce="0" @filter="filterFeature"
                option-label="name" option-value="id"
                @update:model-value="onFeatureSelectionChanged"
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
    import { ref, computed, watch } from 'vue'
    import { useStore } from 'vuex'

    import ColorLegend from "@/components/widgets/ColorLegend.vue"

    export default {
        props: {
            plate: Object,
        },
        components: {
            ColorLegend
        },
        emits: [ 'featureSelection' ],
        setup(props, context) {
            const store = useStore()

            // Measurement selection handling
            const measModel = ref(null)
            const measList = computed(() => store.getters['measurements/getByIds'](props.plate.measurementIds))
            store.dispatch('measurements/loadByIds', props.plate.measurementIds)
            watch(measList, (measList) => {
                measModel.value = measList[0]
                onMeasSelectionChanged()
            })
            const onMeasSelectionChanged = () => {
                store.dispatch('resultdata/loadAll', props.plate.measurementIds)
            }

            // ResultSet selection handling
            const resModel = ref(null)
            const resList = computed(() => {
                if (!measModel.value) return []
                const plateId = props.plate.id
                const measId = measModel.value.id
                return store.getters['resultdata/getAll']().filter(rs => rs.plateId == plateId && rs.measId == measId)
            })
            watch(resList, (resList) => {
                resModel.value = resList[0]
                onResSelectionChanged()
            })
            const onResSelectionChanged = () => {
                if (resModel.value) store.dispatch('features/loadByProtocolId', resModel.value.protocolId)
            }
            const resultSetLabelProvider = (rs) => {
                return (rs === null) ? "NULL" : ("RS " + rs.id + " @ " + rs.executionDate.toLocaleString())
            }

            // Feature selection handling
            const featureModel = ref(null)
            const fullFeatureList = computed(() => {
                if (!resModel.value) return []
                return store.getters['features/getByProtocolId'](resModel.value.protocolId)
            })
            const featureList = ref(fullFeatureList.value)
            watch(fullFeatureList, (fullFeatureList) => {
                featureModel.value = fullFeatureList[0]
                onFeatureSelectionChanged(featureModel.value)
            })
            const onFeatureSelectionChanged = (value) => {
                context.emit('featureSelection', value)
            }

            return {
                measList,
                measModel,
                onMeasSelectionChanged,

                resList,
                resModel,
                onResSelectionChanged,
                resultSetLabelProvider,
                
                featureList,
                featureModel,
                onFeatureSelectionChanged,

                filterFeature: function(val, update) {
                    if (val === '') {
                        update(() => {
                            featureList.value = fullFeatureList.value
                        })
                        return
                    }
                    update(() => {
                        featureList.value = fullFeatureList.value.filter(v => v.name.toLowerCase().indexOf(val.toLowerCase()) > -1)
                    })
                }
            }
        }
    }
</script>