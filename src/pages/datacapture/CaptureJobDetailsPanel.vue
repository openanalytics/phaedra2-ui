<template>
  <q-card style="width: 1000px; max-width: 80vw;">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">
        <q-icon name="scanner" class="q-mr-sm"/>
        DataCapture Job Details
      </div>
    </q-card-section>
    <q-card-section class="q-pa-md q-gutter-sm">
      <div class="row">
        <div class="col-3">Created On:</div>
        <div class="col-9">{{ FormatUtils.formatDate(job.createDate) }}</div>
      </div>
      <div class="row">
        <div class="col-3">Created By:</div>
        <div class="col-9">{{ job.createdBy }}</div>
      </div>
      <div class="row">
        <div class="col-3">Source Path:</div>
        <div class="col-9">{{ job.sourcePath }}</div>
      </div>
      <div class="row">
        <div class="col-3">Status:</div>
        <q-badge :color="ColorUtils.getCaptureJobStatusColor(job.statusCode)">{{ job.statusCode }}</q-badge>
      </div>
      <div class="row">
        <div class="col-3">Message:</div>
        <div class="col-9">{{ job.statusMessage }}</div>
      </div>
      <div class="row">
        <div class="col-3">CaptureJob Events:</div>
        <div class="col-9">
          <q-table flat :rows="job.events" :columns="columns" class="full-width">
            <template v-slot:body-cell-eventType="props">
              <q-td :props="props">
                <q-badge :color="ColorUtils.getCaptureJobEventTypeColor(props.row.eventType)">{{ props.row.eventType }}</q-badge>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
      <div class="row">
        <div class="col-3">Capture Configuration:</div>
        <div class="col-9 q-pa-sm shadow-1">
          <pre>{{ FormatUtils.formatJSON(job.captureConfig) }}</pre>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import FormatUtils from "@/lib/FormatUtils.js"
import ColorUtils from "@/lib/ColorUtils.js"
import {ref} from "vue";

export default {
  props: {
    job: Object
  },
  setup() {
    let columns = ref([
      {name: 'eventType', align: 'left', label: 'Event Type', field: 'eventType', sortable: true},
      {name: 'eventDate', align: 'left', label: 'Event Date', field: 'eventDate', sortable: true, format: FormatUtils.formatDate},
      {name: 'eventDetails', align: 'left', label: 'Details', field: 'eventDetails', sortable: true},
    ])

    return {
      FormatUtils,
      ColorUtils,
      columns
    }
  }
}
</script>