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
                    :well="wells[WellUtils.getWellNr(r, c, plate.columns) - 1] || {}"
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
import {ref, computed, watchEffect} from 'vue'
import {useStore} from 'vuex'
import {useQuasar} from 'quasar'

import WellUtils from "@/lib/WellUtils.js"
import SelectionBoxHelper from "@/lib/SelectionBoxHelper.js"
import WellSlot from "@/components/well/WellSlot.vue"

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

    const store = useStore();
    exported.wells = computed(() => store.getters['wells/getWells'](props.plate.id) || []);
    watchEffect(() => {
      if (props?.plate?.wells) {
        // If the plate object has wells, it's a plate template instead of a regular plate, whose wells are in the wells store.
        exported.wells = ref(props.plate.wells);
        return;
      }
      if (props?.plate?.id && !store.getters['wells/areWellsLoaded'](props.plate.id)) {
        store.dispatch('wells/fetchByPlateId', props.plate.id);
      }
    })

    const emitWellSelection = (wells, append) => {
      if (!append) exported.selectedWells.value.splice(0);
      for (const well of wells) {
        if (append && exported.selectedWells.value.some(w => w.id == well.id)) continue;
        exported.selectedWells.value.push(well);
      }
      store.dispatch('ui/selectWells', exported.selectedWells.value);
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
      const nextWell = WellUtils.getWell(exported.wells.value, nextPosition[0], nextPosition[1]);
      if (nextWell) emitWellSelection([nextWell]);
    });

    // Well selection handling
    exported.rootElement = ref(null);
    exported.wellSlots = ref([]);
    exported.refWellSlot = function (slot) {
      if (!slot || !slot.well) return;
      const wellNr = WellUtils.getWellNr(slot.well.row, slot.well.column, props.plate.columns);
      exported.wellSlots.value[wellNr - 1] = slot;
    }
    exported.selectionBoxSupport = SelectionBoxHelper.addSelectionBoxSupport(exported.rootElement, exported.wellSlots, (wells, append) => {
      emitWellSelection(wells, append);
    });

    exported.selectRow = (n, append) => {
      emitWellSelection(exported.wells.value.filter(w => w.row == n), append);
    };
    exported.selectColumn = (n, append) => {
      emitWellSelection(exported.wells.value.filter(w => w.column == n), append);
    };

    exported.gridColumnStyle = computed(() => { return "repeat(" + (props.plate.columns + 1) + ", 1fr)" });
    exported.wellSlotMinHeight = (props.wellLabelFunctions.length * 15) + "px";

    watchEffect(() => {
      exported.wellSlotFontSize = (props.plate.columns > 24) ? "0.4vw" : "65%";
    })

    exported.WellUtils = WellUtils;

    const $q = useQuasar();
    exported.showDialog = () => {
      $q.dialog({
        title: 'Alert<em>!</em>',
        message: '<em>I can</em> <span class="text-red">use</span> <strong>HTML</strong>',
        html: true
      }).onOk(() => {
        // console.log('OK')
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    }

    return exported;
  },
}
</script>
