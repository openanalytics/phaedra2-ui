<template>
  <q-breadcrumbs class="breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
    <q-breadcrumbs-el :label="'New protocol'" />
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-md">
      <div class="q-px-sm oa-section-title">
        <div class="text-h6">Create new template</div>
      </div>

      <div class="row q-pa-lg oa-section-body">
        <q-form class="col" @submit="onSubmit" @reset="onReset">
          <q-input v-model="newPlateTemplate.name" label="Name: "></q-input>
          <q-input v-model="newPlateTemplate.description" label="Description: "></q-input>
          <q-input v-model="newPlateTemplate.rows" label="Rows: "></q-input>
          <q-input v-model="newPlateTemplate.columns" label="Columns: "></q-input>

          <div class="row justify-end q-pt-md">
            <q-btn label="Submit" type="submit" color="primary"></q-btn>
            <q-btn label="Cancel" type="reset" color="primary" flat class="a-ml-sm"></q-btn>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>

export default {
  name: "NewPlateTemplateView",
  methods: {
    onSubmit() {
      this.newPlateTemplate.createdOn = new Date();
      this.$store.dispatch('templates/createNewPlateTemplate',this.newPlateTemplate)
      this.onReset()
    },
    onReset() {
      this.newPlateTemplate.name = null
      this.newPlateTemplate.description = null
      this.newPlateTemplate.rows = null
      this.newPlateTemplate.columns = null
      this.newPlateTemplate.createdOn = null
    }
  },
  setup() {
    return {
      wellTypeOptions: ['LC', 'HC']
    }
  },
  data() {
    return {
      newPlateTemplate: {
        name: null,
        description: null,
        rows: null,
        columns: null,
        createdOn: null,
        createdBy: 'smarien'
      }
    }
  }
}
</script>

<style lang="scss">
@import "src/css/oa.global";
</style>