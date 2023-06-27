<template>
    <div class="col" style="min-width: 75%">
        <FeatureSelector class="q-pb-xs" :protocols=protocols :plate="plate" @featureSelection="f => selectedFeature = f" />
        <WellGrid :plate="plate"
            :loading="dataLoading"
            :wellColorFunction="wellColorFunction"
            :wellLabelFunctions="wellLabelFunctions"
        />
        <ColorLegend class="q-pt-sm" :rangeValues="rangeValues" :plate="plate" />
    </div>
</template>

<script setup>
    import {ref, computed, watch, defineProps} from 'vue'
    import {useStore} from 'vuex'
    import WellGrid from "@/components/well/WellGrid"
    import FeatureSelector from "@/components/widgets/FeatureSelector"
    import ColorLegend from "@/components/widgets/ColorLegend"
    import ArrayUtils from "@/lib/ArrayUtils.js"
    import ColorUtils from "@/lib/ColorUtils.js"
    import WellUtils from "@/lib/WellUtils.js"

    const props = defineProps(['plate']);
    const store = useStore();
    
    const dataLoading = ref(true);
    const rangeValues = ref({min: 0, mean: 50, max: 100});
    const lut = ref(ColorUtils.createLUT([], ColorUtils.defaultHeatmapGradients));

    const activeMeasurement = computed(() => store.getters['measurements/getActivePlateMeasurement'](props.plate.id));
    const resultSets = computed(() => store.getters['resultdata/getLatestResultSetsForPlateMeas'](props.plate.id, activeMeasurement.value?.measurementId));
    const protocols = computed(() => store.getters['protocols/getByIds'](ArrayUtils.distinctBy(resultSets.value, 'protocolId')));
    
    const selectedFeature = ref(null);
    const selectedFeatureResultSet = computed(() => (resultSets.value.find(rs => rs.protocolId == selectedFeature.value?.protocolId) || {}));
    const selectedFeatureResultData = computed(() => (store.getters['resultdata/getResultData'](selectedFeatureResultSet.value.id) || [])
        .find(rd => rd.featureId == selectedFeature.value?.id));

    store.dispatch('resultdata/loadResultSets', props.plate.id);
    store.dispatch('measurements/loadByPlateId', props.plate.id);

    watch(resultSets, () => store.dispatch('protocols/loadByIds', ArrayUtils.distinctBy(resultSets.value, 'protocolId')));
    watch(protocols, () => dataLoading.value = false);
    watch(selectedFeatureResultSet, () => {
        if (selectedFeatureResultSet.value.id) store.dispatch('resultdata/loadResultData', selectedFeatureResultSet.value.id);
    });
    watch(selectedFeatureResultData, () => {
        if(!selectedFeatureResultData.value?.values) return;
        lut.value = ColorUtils.createLUT(selectedFeatureResultData.value.values, ColorUtils.defaultHeatmapGradients);
        rangeValues.value = calcRangeValues(selectedFeatureResultData.value.values);
    });

    const wellColorFunction = well => {
        if (!selectedFeatureResultData.value?.values) return WellUtils.getWellTypeColor("EMPTY");
        const wellNr = WellUtils.getWellNr(well.row, well.column, props.plate.columns);
        return lut.value.getColor(selectedFeatureResultData.value.values[wellNr - 1]);
    };

    const wellLabelFunctions = [
        well => {
            let wellNr = WellUtils.getWellNr(well.row, well.column, props.plate.columns);
            return (selectedFeatureResultData.value?.values) ? (Math.round(selectedFeatureResultData.value.values[wellNr - 1] * 100) / 100) : "";
        }
    ];

    const calcRangeValues = (values) => {
        const min = Math.min(...values.filter(v => !isNaN(v)));
        const mean = values.reduce((x, y) => x + y, 0) / values.length;
        const max = Math.max(...values.filter(v => !isNaN(v)));
        return {min: min, mean: mean, max: max};
    };
</script>
