<template>
  <div class="row oa-section relative-position" ref="rootElement">
    <div class="loadingAnimation" v-if="loading">
      <q-spinner-pie color="info" size="10em"/>
    </div>

    <div v-if="plate" style="width: 100%;" class="gridContainer"
        @mousedown="selectionBoxSupport.dragStart"
        @mousemove="selectionBoxSupport.dragMove"
        @mouseup="selectionBoxSupport.dragEnd">

      <div><!-- Corner slot --></div>

      <!-- Column headers -->
      <div class="gridHeaderSlot" v-for="n in plate.columns" :key="n" @click="selectColumn(n, $event.ctrlKey)">
        {{ n }}
      </div>

      <template v-for="r in plate.rows" :key="r">
        <!-- Row header -->
        <div class="gridHeaderSlot" @click="selectRow(r, $event.ctrlKey)">
          {{ WellUtils.getWellRowLabel(r) }}
        </div>
        <!-- Plate row -->
        <template v-for="c in plate.columns" :key="c">
          <WellSlot :ref="refWellSlot"
                    :well="plate.wells[WellUtils.getWellNr(r, c, plate.columns) - 1]"
                    :wellColorFunction="wellColorFunction"
                    :wellLabelFunctions="wellLabelFunctions"
                    :selectedWells="selectedWells"
                    class="wellSlot"
          ></WellSlot>
        </template>
      </template>
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

  .gridHeaderSlot {
    background-color: grey;
    border: 1px solid black;
    margin: 1px;
    font-size: 65%;
    text-align: center;
    cursor: pointer;
  }

  .wellSlot {
    min-height: v-bind(wellSlotMinHeight);
    font-size: v-bind(wellSlotFontSize);
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

    // Well selection handling
    exported.rootElement = ref(null);
    exported.wellSlots = ref([]);
    exported.refWellSlot = function (slot) {
      exported.wellSlots.value.push(slot)
    }
    exported.selectionBoxSupport = SelectionBoxHelper.addSelectionBoxSupport(exported.rootElement, exported.wellSlots, (wells, append) => {
      emitWellSelection(wells, append);
    });

    exported.selectRow = (n, append) => {
      emitWellSelection(props.plate.wells.filter(w => w.row == n), append);
    };
    exported.selectColumn = (n, append) => {
      emitWellSelection(props.plate.wells.filter(w => w.column == n), append);
    };

    exported.gridColumnStyle = computed(() => { return "repeat(" + (props.plate.columns + 1) + ", 1fr)" });
    exported.wellSlotMinHeight = (props.wellLabelFunctions.length * 15) + "px";
    exported.wellSlotFontSize = (props.plate.columns > 24) ? "0.4vw" : "65%";
    exported.WellUtils = WellUtils;

    return exported;
  },
}
</script>
