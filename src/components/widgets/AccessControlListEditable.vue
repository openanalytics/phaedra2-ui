<template>
  <div
    class="row items-center q-mt-xs"
    style="font-size: 10px; color: rgba(0, 0, 0, 0.6)"
  >
    <div>Access</div>
    <div>
      <q-btn
        class="q-my-xs"
        icon="add"
        size="xs"
        @click="openAddAccessModal(true)"
        round
        flat
        color="primary"
        dense
        v-show="!props.readOnly"
      >
        <q-tooltip>Add Team Access</q-tooltip>
      </q-btn>
    </div>
  </div>

  <AccessControlList
    :projectAccess="projectAccess"
    @removeAccess="(e) => emits('removeAccess', e)"
  />
  <AddAccessDialog
    v-model:show="addAccessModal"
    @addAccess="(e) => emits('addAccess', e)"
  />
</template>

<script setup>
import { ref } from "vue";
import AddAccessDialog from "./AddAccessDialog.vue";
import AccessControlList from "./AccessControlList.vue";

const props = defineProps(["projectAccess", "readOnly"]);
const emits = defineEmits(["addAccess", "removeAccess"]);
const addAccessModal = ref(false);
function openAddAccessModal(val) {
  addAccessModal.value = val;
}
</script>
