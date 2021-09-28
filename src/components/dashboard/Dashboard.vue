<template>
  <div style="background-color: #E6E6E6; height: fit-content">
    <div class="col q-pa-md">
      <div class="q-px-sm projects-recent-title">
        <div class="text-h6">Recent Projects</div>
      </div>
      <q-card class="row">
        <ProjectCard :project="project" v-for="project in projects" :key="project.id"/>
      </q-card>
    </div>
    <div class="q-pa-md">
      <div class="q-px-sm projects-recent-title">
        <div class="text-h6">Recent Experiments</div>
      </div>
      <q-table :columns="columns" :rows="rows">
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="tags" :props="props">
              <q-badge class="row" color="green" v-for="tag in props.row.tags" :key="tag.value">
                {{ tag }}
              </q-badge>
            </q-td>
            <q-td key="description" :props="props">
                {{ props.row.description }}
            </q-td>
            <q-td key="nrOfPlates" :props="props">
                {{ props.row.nrOfPlates }}
            </q-td>
            <q-td key="nrOfPlatesCalculated" :props="props">
                {{ props.row.nrOfPlatesCalculated }}
            </q-td>
            <q-td key="nrOfPlatesValidated" :props="props">
                {{ props.row.nrOfPlatesValidated }}
            </q-td>
            <q-td key="nrOfPlatesApproved" :props="props">
                {{ props.row.nrOfPlatesApproved }}
            </q-td>
            <q-td key="drc" :props="props">
                {{ props.row.drc }}
            </q-td>
            <q-td key="sdp" :props="props">
                {{ props.row.sdp }}
            </q-td>
            <q-td key="createdOn" :props="props">
                {{ props.row.createdOn }}
            </q-td>
            <q-td key="createdBy" :props="props">
                {{ props.row.createdBy }}
            </q-td>
            <q-td key="project" :props="props">
                {{ props.row.project }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
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
  {name: 'createdOn', label: 'Created On', align: 'left', field: 'createdOn'},
  {name: 'createdBy', label: 'Created By', align: 'left', field: 'createdBy'},
  {name: 'project', label: 'Project', align: 'left', field: 'project'}
]

const rows = [
  {
    name: 'Experiment 1',
    tags: ['example'],
    description: 'Test',
    nrOfPlates: 12,
    nrOfPlatesCalculated: 10,
    nrOfPlatesValidated: 10,
    nrOfPlatesApproved: 5,
    drc: 120,
    sdp: 120,
    createdOn: '17/09/2021',
    createdBy: 'sberberovic',
    project: 'Project 1'
  },
  {
    name: 'Experiment 1',
    tags: ['example', 'test'],
    description: 'Test',
    nrOfPlates: 12,
    nrOfPlatesCalculated: 10,
    nrOfPlatesValidated: 10,
    nrOfPlatesApproved: 5,
    drc: 120,
    sdp: 120,
    createdOn: '17/09/2021',
    createdBy: 'sberberovic',
    project: 'Project 2'
  },
  {
    name: 'Experiment 1',
    tags: ['example'],
    description: 'Test',
    nrOfPlates: 12,
    nrOfPlatesCalculated: 10,
    nrOfPlatesValidated: 10,
    nrOfPlatesApproved: 5,
    drc: 120,
    sdp: 120,
    createdOn: '17/09/2021',
    createdBy: 'sberberovic',
    project: 'Project 1'
  },
  {
    name: 'Experiment 1',
    tags: ['example', 'test'],
    description: 'Test',
    nrOfPlates: 12,
    nrOfPlatesCalculated: 10,
    nrOfPlatesValidated: 10,
    nrOfPlatesApproved: 5,
    drc: 120,
    sdp: 120,
    createdOn: '17/09/2021',
    createdBy: 'sberberovic',
    project: 'Project 2'
  },
  {
    name: 'Experiment 1',
    tags: ['example', 'test'],
    description: 'Test',
    nrOfPlates: 12,
    nrOfPlatesCalculated: 10,
    nrOfPlatesValidated: 10,
    nrOfPlatesApproved: 5,
    drc: 120,
    sdp: 120,
    createdOn: '17/09/2021',
    createdBy: 'sberberovic',
    project: 'Project 3'
  }
]

import { computed } from 'vue'
import { useStore } from 'vuex'

import ProjectCard from "@/components/dashboard/ProjectCard";

export default {
  name: 'Dashboard',
  components: {
    ProjectCard
  },
  setup() {
    const store = useStore()
    const projects = computed(() => store.getters['projects/getRecentProjects'](3))
    store.dispatch('projects/loadRecentProjects', 3)

    return {
      projects,
      columns,
      rows
    }
  }
}
</script>

<style>
.projects-recent {
  height: 150px;
  padding-top: 1%;
  padding-right: 1%;
  padding-left: 1%;
}

.projects-recent-title {
  background-color: #32A6D3;
  color: #E6E6E6;
  width: fit-content;
  /*padding-left: 10px;*/
  /*padding-right: 10px;*/
}

.project-stats {
  border-style: solid;
  border-color: #32A6D3;
  display: flex;
  justify-content: center;
}

.project-stat {
  background-color: #E6E6E6;
  display: grid;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 80px;
  height: 60px;
  margin: 1%;
}
</style>
