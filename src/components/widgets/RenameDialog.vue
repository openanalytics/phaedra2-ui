<template>
  <q-dialog v-model="showDialog">
    <q-card style="min-width: 30vw">
      <q-card-section style="width: 100%; padding: 4px">
        <div style="width: 100%" class="row align-center text-h5 q-mb-xs">
          <div class="row">
            <q-icon name="edit" size="md" class="q-mr-sm"/>
            <div style="align-items: baseline">
              <span> Rename {{ objectClass }} </span>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-input dense v-model="fieldValue"/>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn label="Cancel" v-close-popup @click="cancelChanges" flat/>
        <q-btn label="Save" v-close-popup class="oa-button" @click="saveChanges"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {ref, computed} from "vue";

const props = defineProps({
  objectClass: String,
  object: Object,
  fieldName: String,
  show: Boolean
});
const emit = defineEmits(['valueChanged', 'update:show']);

const showDialog = computed({
  get: () => props.show,
  set: (v) => emit('update:show', v)
});

const newFieldValue = ref(null);
const fieldValue = computed({
  get: () => props.object[props.fieldName || 'name'],
  set: (newValue) => {
    newFieldValue.value = newValue
  }
});

const cancelChanges = () => {
  newFieldValue.value = null;
};
const saveChanges = () => {
  if (newFieldValue.value) {
    emit('valueChanged', newFieldValue.value);
    newFieldValue.value = null;
  }
};
</script>
