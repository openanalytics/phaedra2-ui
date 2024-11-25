<template>
  <div>
    <div class="row">
      <div>
        <q-badge class="q-mr-xs" v-for="pa in projectAccess" :key="pa.id">
          {{ pa.teamName }} ({{ pa.accessLevel }})
          <q-btn
            size="xs"
            flat
            dense
            icon-right="close"
            v-show="!readOnly"
            @click="askRemoveAccess(pa)"
          />
        </q-badge>
      </div>
    </div>

    <q-dialog @hide="clearData" v-model="confirmRemoveAccess">
      <q-card>
        <q-card-section
          class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary"
        >
          <q-icon name="group" class="q-pr-sm" />Remove Team Access
        </q-card-section>
        <q-card-section class="row items-center">
          <span
            >Are you sure you want to remove
            <b>{{ accessToRemove.accessLevel }}</b> access for team
            <b>{{ accessToRemove.teamName }}</b> from this project?</span
          >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Remove"
            color="primary"
            v-close-popup
            @click="removeAccess"
          />
          <q-btn flat label="Cancel" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps(["projectAccess", "readOnly"]);
const emits = defineEmits(["addAccess", "removeAccess"]);

const projectAccess = computed(() => props.projectAccess ?? []);

const confirmRemoveAccess = ref(false);
const accessToRemove = ref(null);
const askRemoveAccess = (projectAccess) => {
  accessToRemove.value = projectAccess;
  confirmRemoveAccess.value = true;
};

const removeAccess = () => {
  emits("removeAccess", accessToRemove.value);
};

const clearData = () => {
  confirmRemoveAccess.value = false;
  accessToRemove.value = null;
};
</script>
