<template>
  <div class="row items-center q-mt-xs"
       style="font-size: 10px; color: rgba(0, 0, 0, 0.6)">
    <div>Description</div>
    <div>
      <q-btn v-show="!props.readOnly" round flat dense
             class="q-my-xs" icon="edit" size="xs" color="primary"
             @click="showEditDialog = true">
        <q-tooltip>Edit {{ fieldName }}</q-tooltip>
      </q-btn>
    </div>
  </div>
  <div  style="min-height: 20px; color: #000">
    <div>
      {{ object[fieldName] || "No " + fieldName + " available" }}
    </div>
  </div>
  <q-dialog v-model="showEditDialog">
    <q-card style="min-width: 30vw">
      <q-card-section class="text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-icon name="edit" class="q-pr-sm" />
        Edit {{ fieldName }}
      </q-card-section>

      <q-card-section>
        <q-input v-if="props.number" v-model.number="fieldValue" type="number"/>
        <q-input v-else dense v-model="fieldValue" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn label="Cancel" v-close-popup @click="cancelChanges" flat />
        <q-btn label="Save" v-close-popup class="oa-button" @click="saveChanges"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  object: Object,
  fieldName: String,
  number: Boolean,
  readOnly: Boolean,
  label: String,
});
const emit = defineEmits(["valueChanged"]);

const newFieldValue = ref(null);

const editBtnShown = ref(false);
const showEditDialog = ref(false);
const fieldValue = computed({
  get: () => props.object[props.fieldName],
  set: (newValue) => {
    newFieldValue.value = newValue;
  },
});

const cancelChanges = () => {
  newFieldValue.value = null;
};
const saveChanges = () => {
  if (newFieldValue.value) {
    emit("valueChanged", newFieldValue.value);
    newFieldValue.value = null;
  }
};
</script>
