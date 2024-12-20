<template>
  <div class="row items-center q-mt-xs"
       style="font-size: 10px; color: rgba(0, 0, 0, 0.6)">
    <div>{{ label }}</div>
    <div>
      <q-btn v-show="!props?.readOnly" round flat dense
             class="q-my-xs" icon="edit" size="xs" color="primary"
             @click="showEditDialog = true">
        <q-tooltip>Edit {{ label }}</q-tooltip>
      </q-btn>
    </div>
  </div>
  <div  style="min-height: 20px; color: #000">
    <div>
      {{ object[fieldName] || "No " + fieldName + " available" }}
    </div>
  </div>
  <q-dialog @hide="cancelChanges" v-model="showEditDialog">
    <q-card style="min-width: 30vw">
      <q-card-section style="width: 100%; padding: 4px">
        <div style="width: 100%" class="row align-center text-h5 q-mb-xs">
          <div class="row">
            <q-icon name="edit" size="md" class="q-pr-sm" />
            <div style="align-items: baseline">
              <span> Edit {{ label }} </span>
            </div>
          </div>
        </div>
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
  readOnly: {
    type: Boolean,
    default: false
  },
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
