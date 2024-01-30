<template>
  <q-menu>
    <q-list>
      <q-item clickable @click="deleteProject()">
        <q-item-section avatar>
          <q-icon name="delete"/>
        </q-item-section>
        <q-item-section>Delete Project</q-item-section>
      </q-item>
    </q-list>

    <DeleteDialog v-model:show="showDeleteDialog" :id="props.project.id" :name="props.project.name" :objectClass="'project'" @onDeleted="handleDeleteProject"/>
  </q-menu>
</template>

<script setup>
import {ref} from "vue"
import DeleteDialog from "@/components/widgets/DeleteDialog.vue"

const props = defineProps(['project'])
const emit = defineEmits(['onDeleteProject'])

const showDeleteDialog = ref(false)

const deleteProject = () => {
  showDeleteDialog.value = true;
}

const handleDeleteProject = () => {
  emit('onDeleteProject');
  showDeleteDialog.value = false;
}
</script>

<style scoped>

</style>
