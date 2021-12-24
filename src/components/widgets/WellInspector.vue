<template>
  <div class="q-pa-xs">
    <div class="oa-section-title2" v-if="!minimal">
      <div class="row items-center">
        <div class="col-8">
          <q-icon name="view_module" size="24px" class="q-mr-sm"/>
          Well Inspector
        </div>
        <div class="col-4">Selected: {{ wells.length }}</div>
      </div>
    </div>
    <div class="oa-section-body" v-if="wells.length == 0">
      <div v-if="wells.length == 0" class="text-info">
        No well selected
      </div>
    </div>
    <div v-else class="q-pa-none oa-section-body text-black">
      <div style="overflow: auto;" :style="minimal ? '':'max-height: 200px'">
        <div v-for="well in wells" :key="well.id">
          <div class="q-pa-sm">
            <div class="row">
              <div class="col-6 text-weight-bold">Well:</div>
              <div class="col-6">{{ WellUtils.getWellCoordinate(well.row, well.column) }}</div>
            </div>
            <div class="row" v-if="gridType===GRID_TYPE_TEMPLATE">
              <div class="col-6 text-weight-bold">Skipped:</div>
              <div class="col-6">{{ well?.skipped }}</div>
            </div>
            <div class="row">
              <div class="col-6 text-weight-bold">Well Type:</div>
              <div class="col-6">{{ well?.wellType }}</div>
            </div>
            <div class="row" v-show="well.substance?.type">
              <div class="col-6 text-weight-bold">Substance:</div>
              <div class="col-6">
                <div class="row">{{ well.substance?.type }} {{ well.substance?.name }}</div>
                <div class="row">
                  {{ well.substance?.concentration ? well.substance?.concentration.toExponential(3) : "" }}
                </div>
              </div>
            </div>
            <div class="row" v-if="gridType===GRID_TYPE_TEMPLATE">
              <div class="col-6 text-weight-bold">
                <span v-if="well.substanceName">Substance name:<br></span>
                <span v-if="well.substanceType">Substance type:<br></span>
                <span v-if="well.concentration">Concentration:</span>
              </div>
              <div class="col-6">
                <span v-if="well.substanceName">{{ well?.substanceName }}<br></span>
                <span v-if="well.substanceType">{{ well?.substanceType }}<br></span>
                <span v-if="well.concentration">{{ well?.concentration ? parseFloat(well?.concentration).toExponential(3) : "" }}</span>
              </div>
            </div>
            <div class="row" v-if="gridType===GRID_TYPE_LAYOUT">
              <div class="col-6 text-weight-bold">Status:</div>
              <div class="col-6">
                <div v-if="well.status === 'ACCEPTED_DEFAULT'">
                  <q-icon name="check_circle" color="positive" :size=statusIconSize />
                  Accepted
                </div>
                <div v-else>
                  <q-icon name="cancel" color="negative" :size=statusIconSize />
                  Rejected
                </div>
              </div>
            </div>
          </div>
          <q-separator v-if="wells.length > 1"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WellUtils from "@/lib/WellUtils.js"

const GRID_TYPE_LAYOUT = "layout"
const GRID_TYPE_TEMPLATE = "well-templates"
export default {
  GRID_TYPE_LAYOUT,
  GRID_TYPE_TEMPLATE,
  props: {
    wells: Array,
    minimal: Boolean,
    gridType: String
  },
  setup(props) {
    return {
      WellUtils,
      cardClass: props.minimal ? "text-black" : "",
      statusIconSize: props.minimal ? "xs" : "sm",
      GRID_TYPE_LAYOUT,
      GRID_TYPE_TEMPLATE
    }
  }
}
</script>
