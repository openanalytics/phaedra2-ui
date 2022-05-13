<template>
  <div class="q-pa-md" v-if="props.show">
    <oa-section-header :title="'Edit Protocol'" :icon="'edit'"/>
    <div class="oa-section-body">
      <q-card-section>
        <div class="row">
          <div class="col col-5">
            <q-input v-model="name" square autofocus label="Name"></q-input>
            <br>
            <q-select v-model="lowWellType" square label="Low well type" :options="wellTypeOptions"></q-select>
            <br>
          </div>
          <div class="col col-1">

          </div>
          <div class="col col-4">
            <q-input v-model="description" square label="Description"></q-input>
            <br>
            <q-select v-model="highWellType" square label="High well type" :options="wellTypeOptions"></q-select>
            <br>
          </div>
        </div>
        <br>
        <div class="row justify-end">
          <q-btn flat label="Cancel" color="primary" @click="editdialog = false"/>
          <router-link :to="'/protocol/' + protocol.id" class="nav-link">
            <q-btn label="Edit protocol" v-close-popup color="primary" @click="editProtocol"/>
          </router-link>
        </div>
      </q-card-section>
    </div>
  </div>
</template>

<script setup>

import {useStore} from "vuex";
import {computed, ref} from "vue";

const props = defineProps(['show', 'protocol']);
const emit = defineEmits(['update:show']);

const store = useStore();

const wellTypeOptions = ['LC', 'HC', 'NC', 'PC'];

// const protocol = computed(() => store.getters['protocols/getCurrentProtocol']());
// const name = ref(protocol.value.name);
// const description = ref(protocol.value.description);
// const lowWellType = ref(protocol.value.lowWelltype);
// const highWellType = ref(protocol.value.highWelltype);

const protocol = ref(props.protocol);
const name = ref(protocol.value.name);
const description = ref(protocol.value.description);
const lowWellType = ref(protocol.value.lowWelltype);
const highWellType = ref(protocol.value.highWelltype);

const editdialog = computed({
  get: () => props.show,
  set: (v) => emit('update:show', v)
});

const editProtocol = () => {
  const payload = {
    id: protocol.value.id,
    name: name.value,
    description: description.value,
    lowWelltype: lowWellType.value,
    highWelltype: highWellType.value
  }
  store.dispatch('protocols/editProtocol', payload);
  editdialog.value = false;
};
</script>
