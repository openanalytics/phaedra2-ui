<template>
  <div v-if="props.readOnly" style="min-height: 20px;">
    <div>
      {{ object[fieldName] }}
    </div>
  </div>
  <div v-else>
    <div style="min-height: 20px;" @mouseover="toggleEditBtn(true)" @mouseleave="toggleEditBtn(false)">
      <div>
        {{ object[fieldName] }}
      </div>
      <q-btn round dense icon="edit" size="xs"
             :class="{'on-right': object[fieldName]}" v-show="editBtnShown || !object[fieldName]"
             @click="showEditDialog = true"/>
    </div>

    <q-dialog v-model="showEditDialog">
      <q-card style="min-width: 30vw">
        <q-card-section class="text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
          <q-icon name="edit" class="q-pr-sm"/>
          Edit {{ fieldName }}
        </q-card-section>

        <q-card-section>
          <q-input v-if="props.number" v-model.number="fieldValue" type="number"/>
          <q-input v-else dense v-model="fieldValue"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn label="Cancel" v-close-popup @click="cancelChanges" flat/>
          <q-btn label="Save" v-close-popup class="oa-button" @click="saveChanges"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import {ref, computed} from "vue";

const props = defineProps({
  object: Object,
  fieldName: String,
  number: Boolean,
  readOnly: Boolean
});
const emit = defineEmits(['valueChanged']);

const newFieldValue = ref(null);

const editBtnShown = ref(false);
const toggleEditBtn = (show) => {
  editBtnShown.value = show;
}
const showEditDialog = ref(false);
const fieldValue = computed({
  get: () => props.object[props.fieldName],
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
