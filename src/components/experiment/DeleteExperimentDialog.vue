<template>
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 30vw">
        <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
          <q-avatar icon="delete" color="primary" text-color="white"/> Delete Experiment
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div>
              <span>Are you sure you want to delete the experiment <b>{{experiment.name}}</b>?</span><br/>
              <span>Type <span style="font-weight: bold">{{ experiment.name }}</span> and press the button to confirm:</span><br/>
              <q-input dense v-model="experimentName" autofocus/><br>
              <span class="text-accent">WARNING: The experiment, plates and associated data will be deleted!</span>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn label="Delete experiment" color="accent" v-if="experiment.name==experimentName" v-close-popup @click="confirmDelete"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
    import {ref, computed} from 'vue';
    import {useStore} from 'vuex';

    export default {
        props: {
            experimentId: Number
        },
        emits: ['onDeleted'],
        setup(props, {emit}) {
            const store = useStore();
            return {
                experiment: computed(() => store.getters['experiments/getById'](props.experimentId)),
                showDialog: ref(false),
                experimentName: ref(null),
                confirmDelete: () => {
                    store.dispatch('experiments/deleteExperiment', props.experimentId);
                    emit('onDeleted');
                }
            };
        }
    }
</script>
