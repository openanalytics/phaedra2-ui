<template>
  <div v-if="props.readOnly" style="min-height: 20px; color: #000">
    <div>
      {{ object[fieldName] || "No " + fieldName + " available" }}
    </div>
  </div>
  <div v-else>
    <div
      class="row items-center q-mt-sm"
      style="font-size: 10px; color: rgba(0, 0, 0, 0.6)"
    >
      <div>{{ label }}</div>
      <div>
        <q-btn
          class="q-my-xs"
          icon="edit"
          size="xs"
          @click="showEditDialog = true"
          round
          flat
          color="primary"
          dense
          v-show="!props.readOnly"
        >
          <q-tooltip> Edit {{ fieldName }}</q-tooltip>
        </q-btn>
      </div>
    </div>

    <div style="min-height: 20px" class="row align-center col-grow text-black">
      <div>
        {{ object[fieldName] }}
      </div>
      <div class="col-1">
        <q-btn
          round
          dense
          icon="edit"
          size="xs"
          :class="{ 'on-right': object[fieldName] }"
          v-show="editBtnShown || !object[fieldName]"
          @click="showEditDialog = true"
        />
      </div>
    </div>
    <q-dialog v-model="showEditDialog">
      <q-card style="min-width: 30vw">
        <q-card-section
          class="text-h6 items-center full-width q-pa-sm bg-primary text-secondary"
        >
          <q-icon name="edit" class="q-pr-sm" />
          Edit {{ fieldName }}
        </q-card-section>

        <q-card-section>
          <q-input
            v-if="props.number"
            v-model.number="fieldValue"
            type="number"
          />
          <q-input v-else dense v-model="fieldValue" />
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
  </div>
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
