<template>
  <div class="row oa-section relative-position" ref="rootElement">

    <div class="col gridHeaderColumn" style="max-width: 20px; margin-top: 18px;">
      <div class="gridHeaderSlot" v-for="n in plate.rows" :key="n" @click="selectRow(n, $event.shiftKey)">
        {{ WellUtils.getWellRowLabel(n) }}
      </div>
    </div>

    <div class="col-grow">
      <div class="gridHeaderRow">
        <div class="gridHeaderSlot" v-for="n in plate.columns" :key="n" @click="selectColumn(n, $event.shiftKey)">
          {{ n }}
        </div>
      </div>

      <div v-if="plate" style="width: 100%;" class="gridContainer"
          @mousedown="selectionBoxSupport.dragStart"
          @mousemove="selectionBoxSupport.dragMove"
          @mouseup="selectionBoxSupport.dragEnd">

        <div class="loadingAnimation" v-if="loading">
          <q-spinner-pie color="info" size="10em"/>
        </div>
        
        <WellSlot :ref="refWellSlot" v-for="well in plate.wells" :key="well.nr"
                  :well="well"
                  :wellColorFunction="wellColorFunction"
                  :wellLabelFunctions="wellLabelFunctions"
                  :selectedWells="selectedWells"
                  @wellSelection="handleWellSlotSelection"
                  class="wellSlot"
        ></WellSlot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loadingAnimation {
  position: absolute;
  z-index: 10;
  justify-self: center;
  align-self: center;
}

.gridContainer {
  display: grid;
  grid-template-columns: v-bind(gridColumnStyle);
  min-height: 400px;
}

.wellSlot {
  min-height: v-bind(wellSlotHeight);
}

.gridHeaderRow {
  display: grid;
  grid-template-columns: v-bind(gridColumnStyle);
}

.gridHeaderColumn {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
}

.gridHeaderSlot {
  background-color: grey;
  border: 1px solid black;
  margin: 1px;
  font-size: 65%;
  text-align: center;
  cursor: pointer;
}
</style>

<script>
import {ref, computed} from 'vue'
import WellUtils from "@/lib/WellUtils.js"
import SelectionBoxHelper from "@/lib/SelectionBoxHelper.js"
import WellSlot from "@/components/widgets/WellSlot.vue"

export default {
  props: {
    plate: Object,
    loading: Boolean,
    wellColorFunction: Function,
    wellLabelFunctions: Array
  },
  components: {
    WellSlot
  },
  emits: ['wellSelection'],
  setup(props, {emit}) {
    const exported = {};

    exported.selectedWells = ref([]);

    const emitWellSelection = (wells, append) => {
      if (!append) exported.selectedWells.value.splice(0);
      for (const well of wells) {
        if (append && exported.selectedWells.value.some(w => w.id == well.id)) continue;
        exported.selectedWells.value.push(well);
      }
      emit('wellSelection', exported.selectedWells.value);
    }

    window.addEventListener('keyup', function (event) {
      if (exported.selectedWells.value.length == 0) return;
      let currentWell = exported.selectedWells.value[0];
      let nextPosition = [];
      switch (event.key) {
        case "ArrowUp":
          nextPosition = [ currentWell.row - 1, currentWell.column ];
          break;
        case "ArrowDown":
          nextPosition = [ currentWell.row + 1, currentWell.column ];
          break;
        case "ArrowLeft":
          nextPosition = [ currentWell.row, currentWell.column - 1 ];
          break;
        case "ArrowRight":
          nextPosition = [ currentWell.row, currentWell.column + 1 ];
          break;
      }
      const nextWell = WellUtils.getWell(props.plate, nextPosition[0], nextPosition[1]);
      if (nextWell) emitWellSelection([nextWell]);
    });

    // Single well selection handling
    exported.handleWellSlotSelection = function (well) {
      if (!well) return;
      emitWellSelection([well]);
    }

    // Multi well selection handling
    exported.rootElement = ref(null);
    exported.wellSlots = ref([]);
    exported.refWellSlot = function (slot) {
      exported.wellSlots.value.push(slot)
    }
    exported.selectionBoxSupport = SelectionBoxHelper.addSelectionBoxSupport(exported.rootElement, exported.wellSlots, wells => {
      emitWellSelection(wells);
    });

    exported.selectRow = (n, append) => {
      emitWellSelection(props.plate.wells.filter(w => w.row == n), append);
    };
    exported.selectColumn = (n, append) => {
      emitWellSelection(props.plate.wells.filter(w => w.column == n), append);
    };

    exported.gridColumnStyle = computed(() => { return "repeat(" + props.plate.columns + ", 1fr)" });
    exported.wellSlotHeight = (props.wellLabelFunctions.length * 15) + "px";
    exported.WellUtils = WellUtils;

    return exported;
  },
}
</script>
