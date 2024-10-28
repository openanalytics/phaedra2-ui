<template>
  <q-dialog v-model="showDialog">
    <q-card style="min-width: 30vw">
      <q-card-section
        class="text-h6 items-center full-width q-pa-sm bg-primary text-secondary"
      >
        <q-icon name="edit" class="q-pr-sm" />
        Edit {{ project.name }}
      </q-card-section>

      <q-card-section>
        <q-input dense v-model="newName" :label="propertyNameValue" />
        <q-input
          dense
          v-model="newDescription"
          autogrow
          label="Description"
          class="q-mt-sm"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn label="Cancel" v-close-popup @click="cancelChanges" flat />
        <q-btn
          label="Save"
          v-close-popup
          class="oa-button"
          @click="saveChanges"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps(["project", "show"]);
const emit = defineEmits(["valueChanged", "update:show"]);

const showDialog = computed({
  get: () => props.show,
  set: (v) => emit("update:show", v),
});

const newName = ref(null);
const newDescription = ref(null);

const cancelChanges = () => {
  newName.value = null;
  newDescription.value = null;
};

watch(
  () => props.show,
  () => {
    newName.value = props.project?.name || props.project?.barcode;
    newDescription.value = props.project?.description;
  }
);

const propertyNameValue = computed(() =>
  props.project?.name ? "Name" : "Barcode"
);

const saveChanges = () => {
  if (newName.value || newDescription.value) {
    let propsName = propertyNameValue.value.toLowerCase();
    let jsonLine = `{"${propsName}":"${newName.value}","description":"${newDescription.value}"}`;
    emit("valueChanged", JSON.parse(jsonLine));
    cancelChanges();
  }
};
</script>
