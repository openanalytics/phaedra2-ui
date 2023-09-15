<template>
  <div class="row relative-position" ref="rootElement">
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
          <WellSlot :ref="slot => addWellSlot(slot, r, c)"
                    :well="wells[WellUtils.getWellNr(r, c, plate.columns) - 1] || {}"
                    :wellColorFunction="wellColorFunction"
                    :wellImageFunction="wellImageFunction"
                    :wellLabelFunctions="wellLabelFunctions"
                    :selectedWells="selectedWells"
                    class="wellSlot"
          ></WellSlot>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
  import {ref, computed, watchEffect} from 'vue'
  import {useStore} from 'vuex'

  import WellUtils from "@/lib/WellUtils.js"
  import SelectionBoxHelper from "@/lib/SelectionBoxHelper.js"
  import WellSlot from "@/components/well/WellSlot.vue"

  const props = defineProps(['plate', 'wells', 'loading', 'wellColorFunction', 'wellImageFunction', 'wellLabelFunctions'])
  const emit = defineEmits(['wellSelection']);
  const store = useStore();

  const selectedWells = ref([]);
  const plate = ref(props.plate)
  const wells = ref(props.wells)

  const emitWellSelection = (wells, append) => {
    if (!append) selectedWells.value.splice(0);
    for (const well of wells) {
      if (append && selectedWells.value.some(w => w.id === well.id)) continue;
      selectedWells.value.push(well);
    }
    emit('wellSelection', selectedWells.value);
  };

  window.addEventListener('keyup', function (event) {
    if (selectedWells.value.length === 0) return;
    let currentWell = selectedWells.value[0];
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
    const nextWell = WellUtils.getWell(wells.value, nextPosition[0], nextPosition[1]);
    if (nextWell) emitWellSelection([nextWell]);
  });

  // Well selection handling
  const rootElement = ref(null);
  const wellSlots = ref([]);
  const addWellSlot = (slot, row, col) => {
    // Note: use wellNr, as wells may not be loaded yet at this point.
    const wellNr = WellUtils.getWellNr(row, col, plate.value.columns);
    wellSlots.value[wellNr - 1] = slot;
  };
  const selectionBoxSupport = SelectionBoxHelper.addSelectionBoxSupport(rootElement, wellSlots, (wellNrs, append) => {
    emitWellSelection(wells.value.filter((well, i) => wellNrs.find(nr => nr === i + 1)), append);
  });

  const selectRow = (n, append) => {
    emitWellSelection(wells.value.filter(w => w.row === n), append);
  };
  const selectColumn = (n, append) => {
    emitWellSelection(wells.value.filter(w => w.column === n), append);
  };

  const gridColumnStyle = computed(() => { return "repeat(" + (plate.value.columns + 1) + ", 1fr)" });
  const wellSlotMinHeight = ((props.wellLabelFunctions?.length || 1) * 15) + "px";

  const wellSlotFontSize = ref(null);
  watchEffect(() => {
    wellSlotFontSize.value = (props?.plate?.columns > 24) ? "0.4vw" : "65%";
  });

</script>

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
  overflow: hidden;
}
</style>
