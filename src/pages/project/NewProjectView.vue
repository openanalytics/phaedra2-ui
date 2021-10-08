<template>
  <q-breadcrumbs class="breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
    <q-breadcrumbs-el label="New project" icon="folder" />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-md">
      <div class="text-h6 items-center q-px-sm oa-section-title">
        Create new protocol
      </div>

      <div class="row q-pa-lg oa-section">
        <q-form action="" class="col col-4" @submit="onSubmit" @reset="onReset">
          <q-input label="Name of the project" v-model="newProject.name"/>
          <!--                     lazy-rules :rules="[ val => val && val.length > 0 || 'Project name is required!']"/>-->
          <q-input label="Project's description" v-model="newProject.description"/>

          <div class="row justify-end q-pt-md">
            <q-btn label="Submit" type="submit" color="primary"/>
            <q-btn label="Cancel" type="reset" color="primary" flat class="a-ml-sm"/>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
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
         createdOn: null,
         createdBy: null,
       }
     }
  },
  methods: {
    onSubmit() {
      this.newProject.createdOn = new Date();
      this.newProject.createdBy = 'sasa.berberovic';
      axios.post('http://localhost:6010/phaedra/plate-service/project', this.newProject)
          .then(response => {
            this.$store.commit('projects/cacheProject', response.data)
          })
    },
    onReset() {
      this.newProject.name = null
      this.newProject.description = null
      this.newProject.createdOn = null
      this.newProject.createdBy = null
    }
  }
}
</script>

<style scoped lang="sass">
  @import "src/css/quasar.variables"
  //
  //.breadcrumb
  //  margin: 12px
  //  margin-bottom: 13px
  //.project-header
  //  margin: 10px
  //.project-body
  //  margin: 10px
  //.action-button
  //  margin: 3px
</style>
