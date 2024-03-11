<template>
    <q-dialog v-model="showDialog" persistent>
        <q-card style="min-width: 30vw">
            <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
                <q-avatar icon="help" color="primary" text-color="white"/>
                {{ props.title }}
            </q-card-section>
            <q-card-section>
                <div class="row">
                    <span>{{ props.message }}</span>
                </div>
            </q-card-section>
            <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup @click="doCancel"/>
                <q-btn label="Ok" color="primary" v-close-popup @click="doConfirm"/>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import {computed} from 'vue';

const props = defineProps(['show', 'title', 'message'])
const emit = defineEmits(['onConfirm', 'onCancel', 'update:show'])

const showDialog = computed({
  get: () => props.show,
  set: (v) => emit('update:show', v)
});

const doConfirm = () => {
  emit('onConfirm');
}

const doCancel = () => {
  emit('onCancel');
}
</script>
