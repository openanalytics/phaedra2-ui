<template>
  <q-dialog v-model="modalFlag" @update:model-value="close">
    <q-card style="min-width: 300px">
      <q-card-section>
        <SettingsSelectField
          v-for="(field, i) in selectFields"
          :key="i"
          :field="field"
          @update="
            (val) => (selectValues[field.label.replaceAll(' ', '')] = val)
          "
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import SettingsSelectField from "./SettingsSelectField.vue";

const props = defineProps(["modal", "selectFields"]);
const emit = defineEmits(["close", "update"]);

const modalFlag = ref(false);

const selectValues = ref(null);
watch(
  () => props.selectFields,
  () => {
    selectValues.value = props.selectFields.reduce(function (map, obj) {
      map[obj.label.replaceAll(" ", "")] = obj.initialValue;
      return map;
    }, {});
  }
);

watch(
  () => props.modal,
  (newVal) => {
    modalFlag.value = newVal;
  }
);

function close() {
  emit("update", selectValues.value);
}
</script>

<style scoped></style>
