<template>
  <q-menu>
    <q-list>
      <q-item dense clickable @click="openDeleteDialog">
        <q-item-section avatar>
          <q-icon name="delete"/>
        </q-item-section>
        <q-item-section>Delete</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
  <DeleteDialog v-if="props.experiment" :id="props.experiment.id" :name="props.experiment.name" :objectClass="'experiment'"
                v-model:show="showDialog"/>
</template>

<script setup>
import DeleteDialog from "@/components/widgets/DeleteDialog";
import {ref} from "vue";

const props = defineProps(['experiment'])
const showDialog = ref(false);

const openDeleteDialog = () => {
  showDialog.value = true;
}
</script>
