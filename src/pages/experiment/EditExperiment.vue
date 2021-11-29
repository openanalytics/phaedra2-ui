<template>
  <div class="q-pa-md" v-if="props.show">
    <div class="row text-h6 items-center q-px-sm oa-section-title">
      <q-icon name="edit" class="q-mr-sm"/>
      Edit Experiment
    </div>
    <div class="row col-12 q-pa-md oa-section-body">
      <q-card-section class="row" style="min-width: 95vw">
        <div class="col col-5">
          <q-input v-model="editedExperiment.name" square autofocus label="Name"></q-input><br>
          <q-btn flat label="Cancel" color="primary" @click="$emit('update:show',false)"/>
        </div>
        <div class="col col-1">

        </div>
        <div class="col col-4">
          <q-input v-model="editedExperiment.description" square label="Description"></q-input><br>
          <router-link :to="'/experiment/' + experiment.id" class="nav-link">
            <q-btn label="Edit experiment" v-close-popup color="primary" @click="editExperiment" />
          </router-link>
        </div>
      </q-card-section>
    </div>
  </div>
</template>

<script>

export default {
  name: 'EditExperiment',
  methods: {
    editExperiment() {
      this.editedExperiment.id = this.experiment.id
      this.editedExperiment.projectId = this.experiment.projectId
      this.$store.dispatch('experiments/editExperiment', this.editedExperiment)
      this.$emit('update:show',false)
    },
  },
  setup(props) {
    return {
      props
    }
  },
  data() {
    return {
      editedExperiment: {
        name: null,
        description: null
      },
      editdialog: this.props.show
    }
  },
  props: ['show', 'experiment'],
  emits: ['update:show']
}
</script>