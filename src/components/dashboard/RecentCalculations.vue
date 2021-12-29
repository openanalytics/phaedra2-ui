<template>
  <div class="q-pa-md">
    <div class="q-px-sm oa-section-title">
      <div class="row text-h6 items-center">
        <q-icon name="calculate" class="on-left"/>
        Recent Plate Calculations
      </div>
    </div>
    <q-table v-if="plates.length>0" :columns="columns" :rows="calculations" square table-header-class="text-grey">
      <template v-slot:body-cell-protocolId="props">
        <q-td :props="props">
          <router-link :to="'/protocol/' + props.row.protocolId" class="nav-link">
            <div class="row items-center cursor-pointer">
              {{ ($store.state.protocols.protocols.length>0)?$store.state.protocols.protocols.find(protocol => protocol.id == props.row.protocolId).name:"" }}
            </div>
          </router-link>
        </q-td>
      </template>
      <template v-slot:body-cell-plateId="props">
        <q-td :props="props">
          <router-link :to="'/plate/' + props.row.plateId" class="nav-link">
            <div class="row items-center cursor-pointer">
              {{plates.find(plate => plate.id === props.row.plateId)?.barcode}}
            </div>
          </router-link>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import {computed} from "vue";
import {useStore} from "vuex";
import FormatUtils from "../../lib/FormatUtils";

export default {
  name: 'RecentCalculations',
  setup() {
    const store = useStore();

    const nrOfCalculations = 10
    store.dispatch('resultdata/loadRecentCalculations', nrOfCalculations);

    const calculations = computed(() => store.getters['resultdata/getRecentCalculations']())
    const plates = computed(() => store.getters['plates/getAllPlates']())
    const columns = [
      {name: 'id', label: 'Id', align: 'left', field: 'id'},
      {name: 'protocolId', label: 'Protocol', align: 'left', field: 'protocolId'},
      {name: 'plateId', label: 'Plate', align: 'left', field: 'plateId'},
      {name: 'measId', label: 'Measurement', align: 'left', field: 'measId'},
      {name: 'executionStartTimeStamp', label: 'Start time', align: 'left', field: 'executionStartTimeStamp', format: FormatUtils.formatDate},
      {name: 'executionEndTimeStamp', label: 'Finish time', align: 'left', field: 'executionEndTimeStamp', format: FormatUtils.formatDate},
      {name: 'outcome', label: 'Outcome', align: 'left', field: 'outcome'},
    ]

    return {
      calculations,
      columns,
      plates
    }
  },
  methods: {
    getProjectName(projectId) {
      const project = this.projects.find(project => {
        return project.id === projectId
      })
      if (project) {
        return project.name
      } else return 'NOT_IN_DB'
    }
  }
}
</script>