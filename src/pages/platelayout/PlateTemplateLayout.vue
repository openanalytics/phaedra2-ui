<template>
    <div class="row">
        <div class="col-10">
            <WellGrid   :plate="plate"
                        :wellColorFunction="wellColorFunction"
                        :wellLabelFunctions="wellLabelFunctions"
                        @wellSelection="handleWellSelection" />
        </div>
        <div class="col-2 q-pa-sm">
            <WellEditor :wells="selectedWells" :plateId="plate.id" :tab="tab"></WellEditor>
        </div>
    </div>
</template>

<script>
import {ref} from 'vue'
import WellGrid from "@/components/widgets/WellGrid.vue"
import WellEditor from "@/components/widgets/WellEditor.vue"
import WellUtils from "@/lib/WellUtils.js"

export default {
    components: {
        WellGrid,
        WellEditor
    },
    props: {
        plate: Object,
        tab: String
    },
    setup(props) {
        const exported = {};

        exported.wellColorFunction = function (well) {
            return WellUtils.getWellTypeColor(well.wellType)
        }

        exported.wellLabelFunctions = [
            (well) => WellUtils.getWellCoordinate(well.row, well.column)
        ];
        if (props.tab === 'substance') {
            exported.wellLabelFunctions.push((well) => well.substanceName);
            exported.wellLabelFunctions.push((well) => well.concentration);
            
        } else if (props.tab !== 'overview') {
            exported.wellLabelFunctions.push((well) => well.wellType);
        }

        exported.selectedWells = ref([])
        exported.handleWellSelection = (wells) => {
            exported.selectedWells.value = wells;
        }
        
        return exported;
    }
}
</script>
