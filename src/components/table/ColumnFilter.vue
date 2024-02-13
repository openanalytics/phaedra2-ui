<template>
  <q-th>
    <q-input v-show="model.enabled" v-model="model.term" dense borderless input-class="q-py-none">
      <template v-slot:append>
        <q-icon size="xs" name="search"/>
      </template>
    </q-input>
  </q-th>
</template>

<script setup>
const model = defineModel();
</script>

<style scoped>
:deep(.q-field__control),
:deep(.q-field__append) {
  font-size: 12px;
  height: 25px;
}
</style>
