<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 50vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-negative text-secondary">
        <q-icon name="cancel" size="sm" left/>
        <span>Disapprove Plate(s)</span>
      </q-card-section>

      <q-card-section>
        <div class="q-pb-md">Selected plate(s):</div>
        <q-list dense bordered>
          <q-item v-for="plate in props.plates" :key="plate.id">
            <q-item-section avatar>
              <q-icon color="primary" name="view_module" />
            </q-item-section>
            <q-item-section>{{ plate.barcode }} ({{plate.id}}) with dimensions {{ plate.rows }} x {{ plate.columns }}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section>
        <span>Reason for the disapproval:"</span><br>
        <q-input v-model="reason" type="textarea" filled/>
        <div class="row items-center">
          <q-icon name="warning" color="warning" size="sm" left/>
          <span class="text-warning">WARNING: The plate(s) and associated data can not be edited after disapproval!</span>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup @click="$emit('update:show',false)"/>
        <q-btn flat label="Disapprove" disable v-if="reason.length===0" v-close-popup/>
        <q-btn flat label="Disapprove" v-if="reason.length>0" @click="disapprove" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {computed, ref} from "vue";

const reason = ref("")

const props = defineProps(['show', 'plates'])
const emits = defineEmits(['update:show', 'onDisapprove'])

const showDialog = computed({
  get: () => props.show,
  set: (v) => emits('update:show', v)
});

const disapprove = () => {
  emits('update:show', false)
  emits("onDisapprove", reason)
}
</script>
