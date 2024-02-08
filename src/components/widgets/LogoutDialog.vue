<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="showDialog" position="top">
      <q-card style="min-width: 30vw">
        <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
          <q-avatar icon="logout" color="primary" text-color="secondary"/>
          Confirm!
        </q-card-section>
        <q-card-section>
          <span class="q-ml-sm text-h8">Are you sure you want to logout?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat square label="Yes" color="primary" @click="handleConfirm"/>
          <q-btn flat square label="No" color="primary" @click="$emit('update:show',false)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

</template>

<script setup>

import {computed} from 'vue';

const props = defineProps(['show',])
const emit = defineEmits(['onConfirm', 'update:show'])

const showDialog = computed({
  get: () => props.show,
  set: (v) => emit('update:show', v)
})

const handleConfirm = () => {
  emit('update:show', false)
  emit('onConfirm')
}
</script>

<style scoped>

</style>
