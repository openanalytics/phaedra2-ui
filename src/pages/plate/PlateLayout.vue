<template>
    <div class="row">
        <div class="col-9">
            <WellGrid   :plate="plate"
                        :wellColorFunction="wellColorFunction"
                        :wellLabelFunctions="wellLabelFunctions"
                        @wellSelection="handleWellSelection" />
        </div>
        <div class="col-3 q-pa-sm">
            <WellTypeLegend :wells=wells></WellTypeLegend>
        </div>
    </div>
</template>

<script>
import {ref, computed, watchEffect} from 'vue'
import {useStore} from 'vuex'

import WellGrid from "@/components/well/WellGrid.vue"
import WellTypeLegend from "@/components/well/WellTypeLegend.vue"
import WellUtils from "@/lib/WellUtils.js"

export default {
    components: {
        WellGrid,
        WellTypeLegend,
    },
    props: {
        plate: Object
    },
    setup(props) {
        const exported = {};
        const store = useStore();

        exported.wells = computed(() => store.getters['wells/getWells'](props.plate.id) || []);

        exported.wellColorFunction = function (well) {
            return WellUtils.getWellTypeColor(well.wellType)
        }

        exported.wellLabelFunctions = [];
        // exported.wellLabelFunctions.push(well => WellUtils.getWellCoordinate(well.row, well.column));
        watchEffect(() => {
            if (props.plate.columns <= 24) exported.wellLabelFunctions.push(well => well.wellType);
        });

        exported.selectedWells = ref([])
        exported.handleWellSelection = (wells) => {
            exported.selectedWells.value = wells;
        }
        
        return exported;
    }
}
</script>
