<template>
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
import {useRouter} from 'vue-router'
import {useTemplateStore} from "@/stores/template";
import plateUtils from "@/lib/PlateUtils";

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
    newPlateTemplate.wells = plateTemplate.wells
    if (plateTemplate.wells) {
      newPlateTemplate.rows = plateUtils.getPlateDimensions(plateTemplate.wells.length()).rows
      newPlateTemplate.columns = plateUtils.getPlateDimensions(plateTemplate.wells.length()).cols
    }

    router.push({ name: "newPlateTemplate", params: { plateTemplate: newPlateTemplate }})
    console.log(plateTemplate)
  }
  reader.readAsText(importFile.value);
}

const onReset = () => {
}
</script>
