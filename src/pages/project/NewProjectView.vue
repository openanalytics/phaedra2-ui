<template>
  <q-breadcrumbs class="breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
    <q-breadcrumbs-el label="New Project" icon="folder" />
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-md">
      <div class="row text-h6 items-center q-px-md oa-section-title">
        <q-icon name="folder" class="q-pr-sm"/>New Project
      </div>

      <div class="row q-pa-md oa-section-body">
        <q-form action="" class="full-width" @submit="onSubmit" @reset="onReset">
          <q-input class="row" label="Project Name" v-model="newProject.name"/>
          <!-- lazy-rules :rules="[ val => val && val.length > 0 || 'Project name is required!']"/>-->
          <q-input class="row" label="Project Description" v-model="newProject.description"/>
          <div class="row justify-end q-pt-md">
            <q-btn label="Submit" type="submit" color="primary"/>
            <q-btn label="Cancel" type="reset" color="primary" flat class="on-right"/>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
  export default {
    setup() {

    },
    methods: {
      onSubmit() {
        this.newProject.createdOn = new Date();
        this.newProject.createdBy = 'TestUser';
        this.$store.dispatch('projects/createNewProject', this.newProject).then(createdProject => {
          this.$router.push({ path: '/project/' + createdProject.id })
        })
      },
      onReset() {
          this.newProject.name = null
          this.newProject.description = null
          this.newProject.createdOn = null
          this.newProject.createdBy = null
      }
    },
    data() {
      return {
        newProject: {
          name: null,
          description: null,
          createdOn: null,
          createdBy: null,
        }
      }
    }
  }
</script>