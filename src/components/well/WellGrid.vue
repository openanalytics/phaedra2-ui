<template>
  <div class="row relative-position" ref="rootElement">
    <div class="loadingAnimation" v-if="loading">
      <q-spinner-pie color="info" size="10em"/>
    </div>

    <div v-if="plate" style="width: 100%;" class="gridContainer"
        @mousedown="selectionBoxSupport.dragStart"
        @mousemove="selectionBoxSupport.dragMove"
        @mouseup="selectionBoxSupport.dragEnd"
        @dblclick="gotoWellView">

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
        <template v-for="c in plate.columns" :key="c" >
          <template v-for="well in [wells[WellUtils.getWellNr(r, c, plate.columns) - 1]]" :key="well">
            <div class="column well wellSlot align-center justify-center" v-ripple
                  :class="{ skipped: well?.skipped, highlight: wellHighlights[WellUtils.getWellNr(r, c, plate.columns) - 1] }"
                  :style="{ backgroundColor: wellColorFunction ? wellColorFunction(well || {}) : '#969696' }"
                  :ref="slot => addWellSlot(slot, r, c)">

              <div v-if="WellUtils.isRejected(well)" class="absolute-center">
                  <img :src="publicPath + 'rejected_cross.svg'" class="vertical-middle" style="width: 100%; height: 100%;"/>
              </div>
              <div v-if="wellImageFunction" class="full-height row items-center justify-center">
                <img :src="wellImages[well.nr]" />
              </div>
              <div v-if="wellLabelFunctions" class="contrastText">
                <span v-for="wellLabelFunction in wellLabelFunctions" :key="wellLabelFunction" class="wellLabel" style="white-space: pre;"
                :style="{ color: wellColorFunction ? wellColorFunction(well || {}) : '#969696' }">
                    {{ wellLabelFunction(well || {}) }}
                </span>
              </div>
            </div>
          </template>
        </template>
      </template>
    </div>
  </div>

  <WellActionMenu touch-position context-menu
                  @reject-wells="handleRejectWells"
                  @accept-wells="handleAcceptWells"
                  @show-dose-response-curve="handleShowDRCView"/>
</template>

<script setup>
import {ref, computed, watchEffect, onMounted, watch} from 'vue'
import {useUIStore} from "@/stores/ui";
import WellActionMenu from "@/components/well/WellActionMenu.vue"
import WellUtils from "@/lib/WellUtils.js"
import SelectionBoxHelper from "@/lib/SelectionBoxHelper.js"
import {publicPath} from "../../../vue.config";
import {usePlateStore} from "@/stores/plate";
import {useNotification} from "@/composable/notification";
import {useRouter} from "vue-router";

const props = defineProps(['plate', 'wells', 'loading', 'wellColorFunction', 'wellImageFunction', 'wellLabelFunctions'])
const emit = defineEmits(['wellSelection', 'wellStatusChanged']);
const uiStore = useUIStore()
const plateStore = usePlateStore()



const plate = computed(() => props.plate ?? {})
const wells = computed(() => props.wells ?? [])

const wellHighlights = ref([])
onMounted(() => {
  wellHighlights.value = [...Array(props.wells?.length).keys()]
    .map(nr => nr + 1)
    .map(nr => uiStore.selectedWells?.find(w => nr == WellUtils.getWellNr(w.row, w.column, plate.value?.columns)))
})

watch(() => uiStore.selectedWells, () => {
  wellHighlights.value = [...Array(props.wells?.length).keys()]
  .map(nr => nr + 1)
  .map(nr => uiStore.selectedWells?.find(w => nr == WellUtils.getWellNr(w.row, w.column, plate.value?.columns)));
}, {deep: true})

const selectWells = (wells, append) => {
  if (!append) return wells;
  const selectedWells = [];
  for (const well of wells) {
    if (!uiStore.selectedWells.some(w => w.id === well.id)) {
      selectedWells.push(well);
    }
  }
  return selectedWells;
}

const router = useRouter()
const gotoWellView = (event, row) => {
  router.push({name: "well", params: { wellId: uiStore.selectedWells[0].id }});
}

const wellImages = ref({})
watchEffect(async () => {
  if (props.wellImageFunction) {
    for (const well of wells.value) {
      wellImages.value[well.nr] = await props.wellImageFunction(well);
    }
  }
});

const emitWellSelection = (wells, append) => {
  uiStore.selectedWells = selectWells(wells, append);
  emit('wellSelection', uiStore.selectedWells);
};

window.addEventListener('keyup', function (event) {
  if (uiStore.selectedWells.length === 0) return;
  let currentWell = uiStore.selectedWells[0];
  let nextPosition = [];
  switch (event.key) {
    case "ArrowUp":
      nextPosition = [currentWell.row - 1, currentWell.column];
      break;
    case "ArrowDown":
      nextPosition = [currentWell.row + 1, currentWell.column];
      break;
    case "ArrowLeft":
      nextPosition = [currentWell.row, currentWell.column - 1];
      break;
    case "ArrowRight":
      nextPosition = [currentWell.row, currentWell.column + 1];
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

const gridColumnStyle = computed(() => {
  return "repeat(" + (plate.value.columns + 1) + ", 1fr)"
});
const wellSlotMinHeight = ((props.wellLabelFunctions?.length || 1) * 15) + "px";

const wellSlotFontSize = ref(null);
watchEffect(() => {
  wellSlotFontSize.value = (props?.plate?.columns > 24) ? "0.4vw" : "65%";
});

const handleRejectWells = () => {
  if (uiStore.selectedWells.length > 0) {
    plateStore.rejectWells(uiStore.selectedWells, 'REJECTED_PHAEDRA', 'Test well rejection').then(() => {
      emit('wellStatusChanged')
    })
  }
}

const handleAcceptWells = () => {
  if (uiStore.selectedWells.length > 0) {
    plateStore.acceptWells(uiStore.selectedWells).then(() => {
      emit('wellStatusChanged')
    })
  }
}
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

.highlight {
    border-color: #9ecaed;
    box-shadow: 0 0 5px #9ecaed;
    animation: blink-animation 1s linear infinite;
}

@keyframes blink-animation {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}

.well {
  border: 1px solid black;
  margin: 1px;
  text-align: center;
  position: relative;
  cursor: pointer;
}

.wellLabel {
  z-index: 1;
}

.skipped {
    background: repeating-linear-gradient(
        -45deg,
        #E5E5E5,
        #E5E5E5 10px,
        #0F0F0F 11px,
        #0F0F0F 12px
  );
}
</style>
