<template>
  <div class="row text-h6 items-center q-px-sm oa-section-title full-width">
    <q-icon name="border_outer" class="on-left"/>
    {{ plateTemplate.name }}
  </div>
  <div class="col-9 gridContainer oa-section">
    <QuickViewSlot v-for="well in wells" :key="well.nr"
              :well="well"
    ></QuickViewSlot>
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
  overflow: scroll;
}
</style>

<script>
import QuickViewSlot from "./QuickViewSlot";
import WellUtils from "../../lib/WellUtils";
import {computed} from "vue";
export default {
  name: 'TemplateQuickView',
  components: {QuickViewSlot},
  setup(props){
    const wells = computed(() => {
      return props.plateTemplate.wells.map(obj=> ({ ...obj, nr: WellUtils.getWellNr(obj.row,obj.column,props.plateTemplate.columns) }))
    })

    const gridColumnStyle = computed(() => {return "repeat(" + props.plateTemplate.columns + ", 1fr)"})

    return{
      gridColumnStyle,
      wells
    }
  },
  props:{
    plateTemplate: Object
  }
}
</script>