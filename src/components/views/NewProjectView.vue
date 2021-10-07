<template>
  <q-breadcrumbs class="breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
    <q-breadcrumbs-el label="New project" icon="folder" />
  </q-breadcrumbs>
  <q-separator />
  <q-card class="project-header">
    <q-card-section class="bg-primary text-white q-pa-sm">
      <div class="text-h6 row items-center"><q-icon name="folder" size="28px" class="q-mr-sm" /> New project </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="q-pa-md q-gutter-md">
        <q-form @submit="onSubmit" @reset="onReset">
          <div class="col q-gutter-md">
            <q-input label="Name of the project" v-model="newProject.name" />
<!--                     lazy-rules :rules="[ val => val && val.length > 0 || 'Project name is required!']"/>-->
            <q-input label="Project's description" v-model="newProject.description" />

            <div>
              <q-btn label="Submit" type="submit" color="primary"/>
              <q-btn label="Cancel" type="reset" color="primary" flat class="a-ml-sm"/>
            </div>
          </div>
        </q-form>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import axios from "axios";

export default {
  name: "NewProjectView",
  data() {
     return {
       newProject: {
         name: null,
         description: null,
         createdOn: new Date(),
         createBy: "sasa.berberovic",
       }
     }
  },
  methods: {
    onSubmit() {
      axios.post('http://localhost:6010/phaedra/plate-service/project', this.newProject)
          .then(response => {
            this.$store.commit('projects/cacheProject', response.data)
          })
      // alert("Create new project with name: " + this.newProject.name + " and description: " + this.newProject.description)
    },
    onReset() {

    }
  }
}
</script>

<style scoped lang="sass">
  @import "src/css/quasar.variables"

  .breadcrumb
    margin: 12px
    margin-bottom: 13px
  .project-header
    margin: 10px
  .project-body
    margin: 10px
  .action-button
    margin: 3px
</style>
