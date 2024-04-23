<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 50vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-negative text-secondary">
        <q-icon name="cancel" size="md" left/>
        <span>Invalidate Plate</span>
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
          <span>Reason for invalidation:</span><br>
          <q-input v-model="reason" type="textarea" filled/>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" @click="$emit('update:show',false)"/>
        <q-btn flat label="Invalidate" disable v-if="reason.length===0" v-close-popup/>
        <q-btn flat label="Invalidate" v-if="reason.length>0" @click="invalidate" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {computed, ref} from "vue";

const reason = ref("")

const props = defineProps(['show', 'plate', "plates"])
const emits = defineEmits(['update:show', 'onInvalidate'])

const showDialog = computed({
  get: () => props.show,
  set: (v) => emits('update:show', v)
})

const invalidate = () => {
  emits('update:show', false)
  emits("onInvalidate", reason)
}

</script>
