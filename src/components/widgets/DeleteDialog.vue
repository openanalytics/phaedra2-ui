<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 30vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-avatar icon="delete" color="primary" text-color="white"/>
        Delete {{objectClass}}
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-10">
            <span>Are you sure you want to delete the {{objectClass}} <b>{{ name }}</b>?</span><br/>
            <span>Type <span style="font-weight: bold">{{
                name
              }}</span> and press the button to confirm:</span><br/>
            <q-input dense v-model="nameModel" autofocus/>
            <br>
            <span class="text-accent">WARNING: The {{objectClass}} and associated data will be deleted!</span>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup/>
          <q-btn :label="'Delete '+objectClass" color="accent" v-if="name===nameModel" v-close-popup
                 @click="confirmDelete"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {computed, ref} from 'vue';
import {useStore} from 'vuex';
import {useRoute, useRouter} from "vue-router";

const store = useStore()
const route = useRoute();
const router = useRouter();

const props = defineProps(['id', 'name', 'objectClass', 'show'])
const emit = defineEmits(['onDeleted', 'update:show'])

const showDialog = computed({
  get: () => props.show,
  set: (v) => emit('update:show', v)
});
const nameModel = ref(null)

const confirmDelete = () => {
  switch (props.objectClass) {
    case 'project':
      break;
    case 'experiment':
      break;
    case 'plate':
      break;
    case 'protocol':
      store.dispatch('protocols/deleteProtocol', props.id).then( () => {
        router.push({name: "browseProtocols"});
      });
      break;
    case 'template':
      store.dispatch('templates/deletePlateTemplate', props.id).then( () => {
        router.push({name: "browseTemplates"});
      });
      break;
    case 'feature':
      store.dispatch('features/deleteFeature', props.id);
      break;
    case 'formula':
      store.dispatch('calculations/deleteFormula', props.id);
      break;
  }
  emit('onDeleted');
}
</script>
