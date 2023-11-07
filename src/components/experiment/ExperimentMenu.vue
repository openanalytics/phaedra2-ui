<template>
  <q-menu auto-close>
    <q-list>
      <q-item v-if="isOpen" dense clickable @click="handleCloseExperiment">
        <q-item-section avatar>
          <q-icon name="folder"/>
        </q-item-section>
        <q-item-section>Close</q-item-section>
      </q-item>
      <q-item v-if="!isOpen" dense clickable @click="handleOpenExperiment">
        <q-item-section avatar>
          <q-icon name="folder_open"/>
        </q-item-section>
        <q-item-section>Open</q-item-section>
      </q-item>
      <q-item dense clickable @click="openDeleteDialog">
        <q-item-section avatar>
          <q-icon name="delete"/>
        </q-item-section>
        <q-item-section>Delete</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
  <DeleteDialog v-if="props.experiment" :id="props.experiment.id" :name="props.experiment.name" :objectClass="'experiment'"
                v-model:show="showDialog" @onDeleted="onDeleted"/>
</template>

<script setup>
import DeleteDialog from "@/components/widgets/DeleteDialog";
import {useProjectStore} from "@/stores/project";
import {computed, ref} from "vue";

const props = defineProps(['experiment'])
const projectStore = useProjectStore()

const isOpen = computed(() => props.experiment.status === 'OPEN' ? true : false )
const showDialog = ref(false);

const openDeleteDialog = () => {
  showDialog.value = true;
}

const handleCloseExperiment = () => {
  console.log("Close experiment " + props.experiment.name)
  projectStore.closeExperiment(props.experiment.id)
}

const handleOpenExperiment = () => {
  console.log("Open experiment " + props.experiment.name)
  projectStore.openExperiment(props.experiment.id)
}

const onDeleted = () => {
  projectStore.deleteExperiment(props.experiment.id)
}
</script>
