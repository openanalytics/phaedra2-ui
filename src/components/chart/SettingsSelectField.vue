<template>
  <q-select
    class="q-pa-xs"
    v-model="model"
    :options="field.options"
    @update:model-value="updateValue"
    :label="field.label"
    :option-value="field.optionValue || undefined"
    :option-label="field.optionLabel || undefined"
    dense
  />
</template>

<script setup>
import { onMounted, ref } from "vue";

const props = defineProps(["field"]);
const emit = defineEmits(["close", "update"]);

const model = ref(null);

onMounted(() => {
  model.value = props.field.initialValue;
});

function updateValue() {
  emit("update", model.value);
}
</script>

<style scoped></style>
