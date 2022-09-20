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
      <div v-if="wells.length == 0" class="text-info q-pa-sm">
        No well selected
      </div>
    </div>
    <div v-else class="q-pa-none oa-section-body text-black">
      <div style="overflow: auto;" :style="minimal ? '':'max-height: 300px'">
        <div v-for="well in wells" :key="well.id" class="text-black">
          <div class="q-pa-sm">
            <div class="row">
              <div class="col-8 text-weight-bold">Well:</div>
              <div class="col-4">{{ WellUtils.getWellCoordinate(well.row, well.column) }}</div>
            </div>
            <div class="row" v-if="hasSkippedField(well)">
              <div class="col-8 text-weight-bold">Skipped:</div>
              <div class="col-4">{{ well?.skipped }}</div>
            </div>
            <div class="row">
              <div class="col-8 text-weight-bold">Well Type:</div>
              <div class="col-4">{{ well?.wellType }}</div>
            </div>
            <div v-if="well.status" class="row">
              <div class="col-8 text-weight-bold">Status:</div>
              <div class="col-4">
                <div>
                  <div v-if="well.status === 'ACCEPTED_DEFAULT'">
                    <q-icon name="check_circle" color="positive" :size='statusIconSize' />
                    Accepted
                  </div>
                  <div v-else>
                    <q-icon name="cancel" color="negative" :size='statusIconSize' />
                    Rejected
                  </div>
                </div>
              </div>
            </div>
            <div class="row" v-if="well.substanceName">
              <div class="col-8 text-weight-bold">Substance name:</div>
              <div class="col-4">{{ well?.substanceName }}</div>
            </div>
            <div class="row" v-if="well.substanceType">
              <div class="col-8 text-weight-bold">Substance type:</div>
              <div class="col-4">{{ well?.substanceType }}</div>
            </div>
            <div class="row" v-if="well.concentration">
              <div class="col-8 text-weight-bold">Concentration:</div>
              <div class="col-4">{{ well?.concentration ? parseFloat(well?.concentration).toExponential(3) : "" }}</div>
            </div>
          </div>
          <q-separator v-if="wells.length > 1"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import WellUtils from "@/lib/WellUtils.js"

const props = defineProps({
  wells: Array,
  minimal: Boolean
})

const statusIconSize = props.minimal ? "xs" : "sm"

const hasSkippedField = (well) => {
  return (typeof well.skipped !== 'undefined')
}
</script>
