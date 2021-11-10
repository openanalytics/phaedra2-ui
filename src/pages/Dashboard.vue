<template>
  <q-page class="oa-root-div">
    <RecentProjects :projects="recentProjects"></RecentProjects>
    <div class="q-pa-md">
      <div class="q-px-sm oa-section-title">
        <div class="row text-h6 items-center">
          <q-icon name="science" class="on-left"/>Recent Experiments
        </div>
      </div>
      <q-table :columns="columns" :rows="recentExperiments" square table-header-class="text-grey" >
        <template v-slot:body-cell-tags="props">
            <q-td key="tags" :props="props">
              <q-badge class="row" color="green" v-for="tag in props.row.tags" :key="tag.value">
                {{ tag }}
              </q-badge>
            </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
  import {computed} from "vue";
  import {useStore} from "vuex";
  import RecentProjects from "@/components/dashboard/RecentProjects";
  import FormatUtils from "@/lib/FormatUtils.js";

  export default {
    components: {
      RecentProjects
    },
    setup() {
      const store = useStore();
      store.dispatch('projects/loadRecentProjects');
      store.dispatch('experiments/loadRecentExperiments');

      const recentProjects = computed(() => store.getters['projects/getNRecentProjects'](3));
      const recentExperiments = computed(() => store.getters['experiments/getRecentExperiments']());

      const columns = [
        {name: 'name', label: 'Name', align: 'left', field: 'name'},
        {name: 'tags', label: 'Tags', align: 'left', field: 'tags'},
        {name: 'description', label: 'Description', align: 'left', field: 'description'},
        {name: 'nrOfPlates', label: '#P', align: 'left', field: 'nrOfPlates'},
        {name: 'nrOfPlatesCalculated', label: '#PC', align: 'left', field: 'nrOfPlatesCalculated'},
        {name: 'nrOfPlatesValidated', label: '#PV', align: 'left', field: 'nrOfPlatesValidated'},
        {name: 'nrOfPlatesApproved', label: '#PA', align: 'left', field: 'nrOfPlatesApproved'},
        {name: 'drc', label: '#DRC', align: 'left', field: 'drc'},
        {name: 'sdp', label: '#SDP', align: 'left', field: 'sdp'},
        {name: 'createdOn', label: 'Created On', align: 'left', field: 'createdOn', format: FormatUtils.formatDate },
        {name: 'createdBy', label: 'Created By', align: 'left', field: 'createdBy'},
        {name: 'project', label: 'Project', align: 'left', field: 'project'}
      ]

      return {
        recentProjects,
        columns,
        recentExperiments
      }
    }
  }
</script>
