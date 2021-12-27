<template>
  <div class="column well" v-ripple
       :style="{ color: fgColor, backgroundColor: bgColor }">
  </div>
</template>

<style scoped>
.well {
  border: 1px solid black;
  margin: 1px;
  font-size: 85%;
  text-align: center;
  position: relative;
  cursor: pointer;
}

.wellLabel {
  z-index: 1;
}
</style>

<script>
import {computed} from 'vue'
import ColorUtils from "@/lib/ColorUtils.js"
import WellUtils from "../../lib/WellUtils";

export default {
  props: {
    well: Object,
  },
  methods: {
    wellTypeColorFunction(well) {
      return WellUtils.getWellTypeColor(well.wellType)
    }
  },
  setup(props) {
    const bgColor = computed(() => WellUtils.getWellTypeColor(props.well.wellType))
    const fgColor = computed(() => ColorUtils.calculateTextColor(bgColor.value))

    return {
      bgColor,
      fgColor,
      props
    }
  }
}
</script>