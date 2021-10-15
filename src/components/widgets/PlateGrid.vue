<template>
    <div class="row">
        <div class="col-10 gridContainer">
            <div v-for="plate in plates" :key="plate.id" class="q-pa-sm">
                <MiniHeatmap :plate=plate :feature=selectedFeature></MiniHeatmap>
            </div>
        </div>
        <div class="col-2 q-pa-sm">
            <FeatureSelector
                :protocols=protocols
                @featureSelection="handleFeatureSelection"
            ></FeatureSelector>
        </div>
    </div>
</template>

<style scoped>
    .gridContainer {
        display: grid;
        grid-template-columns: v-bind(gridColumnStyle);
    }
</style>

<script>
    import { ref, computed } from 'vue'
    import { useStore } from 'vuex'

    import MiniHeatmap from "@/components/widgets/MiniHeatmap.vue"
    import FeatureSelector from "@/components/widgets/FeatureSelector.vue"

    export default {
        props: {
            experiment: Object
        },
        components: {
            MiniHeatmap,
            FeatureSelector
        },
        setup(props) {
            const store = useStore()
            
            const protocols = ref([])
            const plates = computed(() => store.getters['plates/getByExperimentId'](props.experiment.id))
            store.dispatch('plates/loadByExperimentId', props.experiment.id).then(() => {
                let plateIds = plates.value.map(p => p.id)
                store.dispatch('resultdata/loadResultSetsByPlateIds', plateIds).then(() => {
                    let resultsets = store.getters['resultdata/getResultSetsByPlateIds'](plateIds)
                    let protocolIds = [... new Set(resultsets.map(rs => rs.protocolId))]
                    store.dispatch('protocols/loadByIds', protocolIds).then(() => {
                        protocols.value = store.getters['protocols/getByIds'](protocolIds)
                    })
                })
            })

            const selectedFeature = ref(null)
            const handleFeatureSelection = function(feature) {
                selectedFeature.value = feature
            }

            return {
                protocols,
                plates,
                gridColumnStyle: "repeat(3, 1fr)",
                selectedFeature,
                handleFeatureSelection
            }
        }
    }
</script>
