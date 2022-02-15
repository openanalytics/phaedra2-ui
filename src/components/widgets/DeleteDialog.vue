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
          <q-btn :label="'Delete '+objectClass" color="accent" v-if="name==nameModel" v-close-popup
                 @click="confirmDelete"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {ref} from 'vue';
import {useStore} from 'vuex';

export default {
  props: {
    id: Number,
    name: String,
    objectClass: String,
  },
  emits: ['onDeleted'],
  setup(props, {emit}) {
    const store = useStore();
    return {
      showDialog: ref(false),
      nameModel: ref(null),
      confirmDelete: () => {
        switch (props.objectClass){
          case 'project': store.dispatch('projects/deleteProject', props.id);break;
          case 'experiment': store.dispatch('experiments/deleteExperiment', props.id);break;
          case 'plate': store.dispatch('plates/deletePlate', props.id);break;
          case 'protocol': store.dispatch('protocols/deleteProtocol',props.id);break;
          case 'template': store.dispatch('templates/deletePlateTemplate',props.id);break;
          case 'feature': store.dispatch('features/deleteFeature',props.id);break;
          case 'formula': store.dispatch('calculations/deleteFormula',props.id);break;
        }
        emit('onDeleted');
      }
    };
  }
}
</script>