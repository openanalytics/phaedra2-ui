<template>
    <div class="row">
        <div class="col-9">
            <WellGrid   :plate="plate"
                        :wellColorFunction="wellColorFunction"
                        :wellLabelFunctions="wellLabelFunctions"
                        @wellSelection="handleWellSelection" />
        </div>
        <div class="col-3 q-pa-sm">
            <WellTypeLegend :plate=plate></WellTypeLegend>
            <WellInspector :wells=selectedWells :gridType="'layout'"></WellInspector>
        </div>
    </div>
</template>

<script>
import {ref} from 'vue'
import WellGrid from "@/components/widgets/WellGrid.vue"
import WellTypeLegend from "@/components/widgets/WellTypeLegend.vue"
import WellInspector from "@/components/widgets/WellInspector.vue"
import WellUtils from "@/lib/WellUtils.js"

export default {
    components: {
        WellGrid,
        WellTypeLegend,
        WellInspector
    },
    props: {
        plate: Object
    },
    setup() {
        const exported = {};

        exported.wellColorFunction = function (well) {
            return WellUtils.getWellTypeColor(well.wellType)
        }

        exported.wellLabelFunctions = [
            function (well) {
                return WellUtils.getWellCoordinate(well.row, well.column)
            },
            function (well) {
                return well.wellType;
            }
        ]

        exported.selectedWells = ref([])
        exported.handleWellSelection = (wells) => {
            exported.selectedWells.value = wells;
        }
        
        return exported;
    }
}
</script>
