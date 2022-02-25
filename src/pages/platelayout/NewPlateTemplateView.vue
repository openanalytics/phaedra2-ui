<template>
  <q-breadcrumbs class="breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
    <q-breadcrumbs-el :label="'New Plate Layout Template'" />
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-md">
      <oa-section-header :title="'New Template'" :icon="'add'"/>

      <div class="row q-pa-lg oa-section-body">
        <q-form class="col" @submit="onSubmit" @reset="onReset">
          <q-input v-model="newPlateTemplate.name" label="Name: "></q-input>
          <q-input v-model="newPlateTemplate.description" label="Description: "></q-input>
          <q-input v-model="newPlateTemplate.rows" label="Rows: "></q-input>
          <q-input v-model="newPlateTemplate.columns" label="Columns: "></q-input>

          <div class="row justify-end q-pt-md">
            <router-link :to="{name: 'browseTemplates'}" class="nav-link">
              <q-btn label="Cancel" type="reset" color="primary" flat class="a-ml-sm"></q-btn>
            </router-link>
            <q-btn label="Submit" type="submit" color="primary"></q-btn>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import {ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import OaSectionHeader from "../../components/widgets/OaSectionHeader";

export default {
  name: "NewPlateTemplateView",
  components: {OaSectionHeader},
  setup() {
    const router = useRouter();
    const store = useStore();

    const newPlateTemplate = ref({
      name: null,
      description: null,
      rows: null,
      columns: null,
      createdOn: null,
      createdBy: 'smarien'
    });
    
    const onSubmit = async () => {
      newPlateTemplate.value.createdOn = new Date();
      const createdTemplate = await store.dispatch('templates/createNewPlateTemplate', newPlateTemplate.value);
      router.push("/template/" + createdTemplate.id);
    };
    const onReset = () => {
      newPlateTemplate.value.name = null
      newPlateTemplate.value.description = null
      newPlateTemplate.value.rows = null
      newPlateTemplate.value.columns = null
      newPlateTemplate.value.createdOn = null
    };

    return {
      onSubmit,
      onReset,
      newPlateTemplate,
      wellTypeOptions: ['LC', 'HC']
    }
  }
}
</script>