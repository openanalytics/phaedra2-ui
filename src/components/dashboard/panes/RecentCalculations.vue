<template>
  <!-- <div class="q-pa-sm"> -->
  <!-- <oa-section -->
  <!-- title="Recent Calculations" icon="calculate" :collapsible="true" > -->
  <div class="q-pa-sm">
    <q-table
      flat
      square
      dense
      table-header-class="text-grey"
      :columns="columns"
      :rows="resultSets"
    >
      <template v-slot:body-cell-protocolId="props">
        <q-td :props="props">
          <router-link
            :to="'/protocol/' + props.row.protocolId"
            class="nav-link"
          >
            <div class="row items-center cursor-pointer">
              {{ props.row.protocolId }}
            </div>
          </router-link>
        </q-td>
      </template>
      <template v-slot:body-cell-plateId="props">
        <q-td :props="props">
          <router-link :to="'/plate/' + props.row.plateId" class="nav-link">
            <div class="row items-center cursor-pointer">
              {{ props.row.plateId }}
            </div>
          </router-link>
        </q-td>
      </template>
      <template v-slot:body-cell-outcome="props">
        <q-td :props="props">
          <StatusLabel :status="props.row.outcome" />
        </q-td>
      </template>
    </q-table>
  </div>
  <!-- </oa-section> -->
  <!-- </div> -->
</template>

<script setup>
import FormatUtils from "@/lib/FormatUtils.js";
import { computed } from "vue";
import { useStore } from "vuex";
import StatusLabel from "@/components/widgets/StatusLabel";

const store = useStore();

const resultSets = computed(() =>
  store.getters["resultdata/getLatestResultSets"]()
);
store.dispatch("resultdata/loadLatestResultSets", 10);

//TODO Load the related protocols, measurements and plates

const columns = [
  { name: "id", label: "Id", align: "left", field: "id" },
  { name: "protocolId", label: "Protocol", align: "left", field: "protocolId" },
  { name: "plateId", label: "Plate", align: "left", field: "plateId" },
  { name: "measId", label: "Measurement", align: "left", field: "measId" },
  {
    name: "executionStartTimeStamp",
    label: "Start time",
    align: "left",
    field: "executionStartTimeStamp",
    format: FormatUtils.formatDate,
  },
  {
    name: "executionEndTimeStamp",
    label: "Finish time",
    align: "left",
    field: "executionEndTimeStamp",
    format: FormatUtils.formatDate,
  },
  { name: "outcome", label: "Outcome", align: "left", field: "outcome" },
];
</script>
