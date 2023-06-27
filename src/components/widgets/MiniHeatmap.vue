<template>
    <div>
        <div class="oa-section-title2">
            <div class="row items-center">
                <q-icon name="view_module" size="24px" class="q-mr-sm"/>
                <router-link :to="'/plate/' + props.plate?.id" class="nav-link">{{ props.plate?.barcode }}</router-link>
            </div>
        </div>
        <div class="q-pa-xs oa-section-body">
            <canvas ref="canvas"/>
        </div>
    </div>
</template>

<script setup>
    import {ref, computed, watch} from 'vue'
    import {useStore} from 'vuex'
    import WellUtils from "@/lib/WellUtils.js"
    import ColorUtils from "@/lib/ColorUtils.js"

    const props = defineProps(['plate','feature','resultData']);
    const store = useStore();
    const canvas = ref(null);
    const lut = ref(ColorUtils.createLUT([], ColorUtils.defaultHeatmapGradients));

    const wells = computed(() => store.getters['wells/getWells'](props.plate?.id) || []);
    watch(() => props.plate, () => {
        if (props.plate?.id) store.dispatch('wells/fetchByPlateId', props.plate.id);
    })
    const resultDataForFeature = computed(() => (props.resultData.find(rd => rd.featureId == props.feature?.id && rd.plateId == props.plate?.id) || {}));
    
    watch(resultDataForFeature, () => {
        if (!resultDataForFeature.value || !resultDataForFeature.value.values) return
        lut.value = ColorUtils.createLUT(resultDataForFeature.value.values, ColorUtils.defaultHeatmapGradients);
        setTimeout(draw());
    });

    const wellColorFunction = (well) => {
        if (!resultDataForFeature.value || !resultDataForFeature.value.values) return WellUtils.getWellTypeColor("EMPTY");
        const wellNr = WellUtils.getWellNr(well.row, well.column, props.plate.columns);
        return lut.value.getColor(resultDataForFeature.value.values[wellNr - 1]);
    }
    
    function draw() {
        console.log("MiniHeatmap Draw")
        
        if (canvas.value === null) {
            return;
        }
        
        let ctx = canvas.value.getContext('2d')
        
        let parent = canvas.value.parentElement
        let parentStyle = getComputedStyle(parent)
        let parentPaddingH = parseInt(parentStyle.paddingLeft) + parseInt(parentStyle.paddingRight)
        let availableWidth = parent.clientWidth - parentPaddingH
        
        let wellWidth = Math.floor(availableWidth / props.plate.columns) - 2
        let wellSize = [wellWidth, wellWidth]
        
        canvas.value.width = (wellWidth + 2) * props.plate.columns
        canvas.value.height = (wellWidth + 2) * props.plate.rows
        
        for (let r = 0; r < props.plate.rows; r++) {
            for (let c = 0; c < props.plate.columns; c++) {
                //Note: getWell takes ~1sec for 1536 wells
                // let well = WellUtils.getWell(wells.value, r + 1, c + 1)
                // This optimization assumes wells are always sorted by number:
                let wellNr = WellUtils.getWellNr(r + 1, c + 1, props.plate.columns);
                let well = wells.value[wellNr - 1];
                if (!well) continue;
                
                let x = c * (wellSize[0] + 2)
                let y = r * (wellSize[1] + 2)
                
                ctx.fillStyle = wellColorFunction(well)
                ctx.fillRect(x, y, wellSize[0], wellSize[1])
                
                if (well.status === "REJECTED") {
                    ctx.strokeStyle = "yellow"
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + wellWidth, y + wellWidth);
                    ctx.stroke();
                    ctx.moveTo(x + wellWidth, y);
                    ctx.lineTo(x, y + wellWidth);
                    ctx.stroke();
                }
            }
        }
    }
</script>
