<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 30vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-positive text-secondary">
        <q-icon name="check_circle" size="md" left/>
        <span>Approve Plate(s)</span>
      </q-card-section>
      <q-card-section>
        <span>Are you sure you want to approve the selected plate(s)?</span>
        <br/><br/>
        <q-list dense bordered>
          <q-item v-for="plate in props.plates" :key="plate.id">
            <q-item-section avatar>
              <q-icon color="primary" name="view_module" />
            </q-item-section>
            <q-item-section>{{ plate.barcode }} ({{plate.id}}) with dimensions {{ plate.rows }} x {{ plate.columns }}</q-item-section>
          </q-item>
        </q-list>
        <br/>
        <div class="row items-center">
          <q-icon name="warning" color="warning" size="sm" left/>
          <span class="text-warning">WARNING: The plate(s) and associated data can not be edited after approval!</span>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup @click="$emit('update:show',false)"/>
        <q-btn flat label="Approve" @click="approve" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {computed, ref} from "vue";

const props = defineProps(['show', 'plates'])
const emits = defineEmits(['update:show', 'onApprove'])

const showDialog = computed({
  get: () => props.show,
  set: (v) => emits('update:show', v)
})

const approve = () => {
  emits('update:show', false)
  emits('onApprove')
}
</script>
