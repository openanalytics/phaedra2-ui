<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'New Plate Layout Template'"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-md">
      <oa-section-header :title="'New Template from file'" :icon="'add'"/>

      <div class="row q-pa-lg oa-section-body">
        <q-form class="col" @submit="onSubmit" @reset="onReset">
          <q-file v-model="importFile" label="Plate template"></q-file>

          <div class="row justify-end q-pt-md">
            <q-btn label="Submit" type="submit" color="primary"></q-btn>
            <router-link :to="{name: 'browseTemplates'}" class="nav-link">
              <q-btn label="Cancel" type="reset" color="primary" flat class="a-ml-sm"></q-btn>
            </router-link>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import {ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import OaSectionHeader from "@/components/widgets/OaSectionHeader";
import {useTemplateStore} from "@/stores/template";

const wellTypeOptions = ['LC', 'HC', 'NC', 'PC']

const router = useRouter()
// const store = useStore()
const templateStore = useTemplateStore()

const importFile = ref(null)

const newPlateTemplate = {
  "id": null,
  "name": null,
  "rows": null,
  "columns": null,
  "wells": null
}

const onSubmit = async () => {
  console.log(importFile)
  const reader = new FileReader();
  reader.onload = (res) => {
    const data = res.target.result
    const data_rows = data.split("\r\n")
    const headers = data_rows[0].split(";")

    for (let i = 1; i < data_rows.length; i++) {
      let [barcode, wellNr, rowNr, colNr, wellType, substanceType, substanceName, concentration, isValid] = data_rows[i].split(";")
      const wellInfo = {
        "column": parseInt(colNr),
        "row": parseInt(rowNr),
        "wellType": wellType,
        "substanceType": substanceType,
        'substanceName': substanceName,
        "concentration": concentration
      }
      if (newPlateTemplate.wells)
        newPlateTemplate.wells.push(wellInfo)
      else
        newPlateTemplate.wells = [wellInfo]
    }

    newPlateTemplate.rows = Math.max(...newPlateTemplate.wells.map(w => w.row))
    newPlateTemplate.columns = Math.max(...newPlateTemplate.wells.map(w => w.column))

    saveTemplate()
  }
  reader.readAsText(importFile.value);
}

const saveTemplate = () => {
  // const createdTemplate = store.dispatch('templates/createNewPlateTemplate', newPlateTemplate);
  templateStore.creatNewTemplate(newPlateTemplate).then(() => {
    for (let i = 0; i < templateStore.template.wells.length; i++) {
      templateStore.template.wells[i].substanceType = newPlateTemplate.wells[i].substanceType;
      templateStore.template.wells[i].substanceName = newPlateTemplate.wells[i].substanceName;
      templateStore.template.wells[i].concentration = newPlateTemplate.wells[i].concentration;
      templateStore.template.wells[i].wellType = newPlateTemplate.wells[i].wellType;
      templateStore.template.wells[i].skipped = newPlateTemplate.wells[i].wellType === 'EMPTY';
    }
    templateStore.saveTemplate()
    router.push("/template/" + templateStore.template.id);
  })
}
const onReset = () => {
}
</script>
