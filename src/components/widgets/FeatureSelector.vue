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
                class="selectBox">
                <template v-slot:prepend>
                    <q-icon name="text_snippet" />
                </template>
            </q-select>
            ResultSet:
            <q-select
                outlined dense options-dense
                v-model="resModel" :options="resList"
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
    import { ref } from 'vue'

    import ColorLegend from "@/components/widgets/ColorLegend.vue"

    export default {
        components: {
            ColorLegend
        },
        setup () {
            const fullMeasList = [ "MeasA", "MeasB", "MeasC" ]
            const fullResList = [ "Protocol X 22/09/21 12:43" ]
            const fullFeatureList = []
            for (var i=1; i<100; i++) {
                fullFeatureList.push("Feature " + i)
            }

            const measList = ref(fullMeasList)
            const resList = ref(fullResList)
            const featureList = ref(fullFeatureList)

            const measModel = ref(measList.value[0])
            const resModel = ref(resList.value[0])
            const featureModel = ref(featureList.value[0])

            const filterFunction = function(val, update, list, fullList) {
                if (val === '') {
                    update(() => {
                        list.value = fullList
                    })
                    return
                }
                update(() => {
                    list.value = fullList.filter(v => v.toLowerCase().indexOf(val.toLowerCase()) > -1)
                })
            }

            return {
                measList,
                measModel,
                resList,
                resModel,
                featureList,
                featureModel,

                filterMeas: function(val, update) { filterFunction(val, update, measList, fullMeasList); },
                filterRes: function(val, update) { filterFunction(val, update, resList, fullResList); },
                filterFeature: function(val, update) { filterFunction(val, update, featureList, fullFeatureList); }
            }
        }
    }
</script>