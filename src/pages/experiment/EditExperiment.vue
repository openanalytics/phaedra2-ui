<template>
  <div class="q-pa-md" v-if="props.show">
    <oa-section-header :title="'Edit Experiment'" :icon="'edit'"/>
    <div class="oa-section-body">
      <q-card-section>
        <div class="row">
          <div class="col-5">
            <q-input v-model="editedExperiment.name" square autofocus label="Name"></q-input>
            <br>
          </div>
          <div class="col-1">

          </div>
          <div class="col-5">
            <q-input v-model="editedExperiment.description" square label="Description"></q-input>
            <br>
          </div>
        </div>
        <br>
        <div class="row justify-end">
          <router-link :to="'/experiment/' + experiment.id" class="nav-link">
            <q-btn flat label="Cancel" color="primary" @click="$emit('update:show',false)"/>
            <q-btn label="Edit experiment" v-close-popup color="primary" @click="editExperiment"/>
          </router-link>
        </div>
      </q-card-section>
    </div>
  </div>
</template>

<script>
import OaSectionHeader from "../../components/widgets/OaSectionHeader";

export default {
  name: 'EditExperiment',
  components: {
    OaSectionHeader
  },
  methods: {
    editExperiment() {
      this.editedExperiment.id = this.experiment.id
      this.editedExperiment.projectId = this.experiment.projectId
      this.$store.dispatch('experiments/editExperiment', this.editedExperiment)
      this.$emit('update:show', false)
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