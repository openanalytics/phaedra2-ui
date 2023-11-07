<template>
<!--  <q-breadcrumbs class="oa-breadcrumb">-->
<!--    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>-->
<!--    <q-breadcrumbs-el :label="'New Plate Layout Template'"/>-->
<!--  </q-breadcrumbs>-->

  <q-dialog v-model="importFromFile" persistent>
    <div class="q-pa-sm">

      <div class="row q-pa-lg oa-section-body">
        <q-form class="col" @submit="onSubmit" @reset="onReset">
          <q-file v-model="importFile" label="Plate template"></q-file>

          <div class="row justify-end q-pt-md">
              <q-btn label="Submit" color="primary" square></q-btn>
              <q-btn label="Cancel" type="reset" color="primary" flat square class="a-ml-sm"></q-btn>
          </div>
        </q-form>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import {ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import OaSectionHeader from "@/components/widgets/OaSectionHeader";
import {useTemplateStore} from "@/stores/template";
import NewPlateTemplateView from "@/pages/platelayout/NewPlateTemplateView.vue";

const wellTypeOptions = ['LC', 'HC', 'NC', 'PC']

const router = useRouter()
const templateStore = useTemplateStore()

const importFromFile = ref(false)
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

    const plateTemplate = JSON.parse(data);
    newPlateTemplate.name = plateTemplate.name
    newPlateTemplate.rows = plateTemplate.rows
    newPlateTemplate.columns = plateTemplate.columns
    newPlateTemplate.wells = plateTemplate.wells

    router.push({ name: "newPlateTemplate", params: { plateTemplate: newPlateTemplate }})
    // saveTemplate()
    console.log(plateTemplate)
  }
  reader.readAsText(importFile.value);
}

const saveTemplate = () => {
  templateStore.creatNewTemplate(newPlateTemplate).then(() => {
    router.push("/template/" + templateStore.template.id);
  })
}
const onReset = () => {
}
</script>
