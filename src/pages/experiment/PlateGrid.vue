<template>
    <div style="width: 100%">
        <div class="row q-pa-sm">
            <FeatureSelector :protocols=protocols @featureSelection="f => selectedFeature = f"/>
        </div>
        <div class="row gridContainer">
            <div v-for="plate in plates" :key="plate.id" class="q-pa-sm">
                <MiniHeatmap :plate=plate :feature=selectedFeature :resultData=resultDataPerPlate />
            </div>
        </div>
    </div>
</template>

<style scoped>
.gridContainer {
    display: grid;
    grid-template-columns: v-bind(gridColumnStyle);
}
</style>

<script setup>
    import {ref, computed, watch} from 'vue'
    import {useStore} from 'vuex'
    import ArrayUtils from "@/lib/ArrayUtils";
    import MiniHeatmap from "@/components/widgets/MiniHeatmap.vue"
    import FeatureSelector from "@/components/widgets/FeatureSelector.vue"

    const props = defineProps(['experiment']);
    const store = useStore();
    const gridColumnStyle = "repeat(3, 1fr)";
    const selectedFeature = ref(null);

    const plates = computed(() => store.getters['plates/getByExperimentId'](props.experiment?.id));
    const activeMeasurements = computed(() => store.getters['measurements/getActivePlateMeasurements'](plates.value.map(p => p.id)));
    const resultSets = computed(() => activeMeasurements.value.map(m => store.getters['resultdata/getLatestResultSetsForPlateMeas'](m.plateId, m.measurementId)).flat());
    const protocols = computed(() => store.getters['protocols/getByIds'](ArrayUtils.distinctBy(resultSets.value, 'protocolId')));
    const resultData = computed(() => resultSets.value.map(rs => store.getters['resultdata/getResultData'](rs.id)).flat());

    // Build an array of resultData objects, one per plate according to the currently selected feature.
    const resultDataPerPlate = computed(() => plates.value.map(p => {
        if (!selectedFeature.value?.id) return {};
        let rs = resultSets.value.find(rs => rs.plateId == p.id && rs.protocolId == selectedFeature.value.protocolId);
        let rd = resultData.value.find(rd => rd.resultSetId == rs?.id && rd.featureId == selectedFeature.value.id);
        let retVal = structuredClone(rd || {});
        retVal.plateId = p.id;
        return retVal;
    }));

    watch(props.experiment, async () => {
        if (!props.experiment) return;
        await store.dispatch('plates/loadByExperimentId', props.experiment.id);
        for (const plate of plates.value) {
            await store.dispatch('resultdata/loadResultSets', plate.id);
            await store.dispatch('measurements/loadByPlateId', plate.id);
            for (const rs of resultSets.value.filter(rs => rs.plateId == plate.id)) {
                await store.dispatch('protocols/loadById', rs.protocolId);
                await store.dispatch('resultdata/loadResultData', rs.id);
            }
        }
    }, { immediate: true });
</script>
