<template>
  <div class="q-pa-md" v-if="props.show">
    <oa-section-header :title="'Edit Plate'" :icon="'edit'"/>
    <div class="oa-section-body">
      <q-card-section>
        <div class="row">
          <div class="col-5">
            <q-input v-model="editedPlate.barcode" square autofocus label="Barcode"></q-input>
            <br>
          </div>
          <div class="col-1">

          </div>
          <div class="col-5">
            <q-input v-model="editedPlate.description" square label="Description"></q-input>
            <br>
          </div>
        </div>
        <br>
        <div class="row justify-end">
          <q-btn flat label="Cancel" color="primary" @click="$emit('update:show',false)"/>
          <q-btn align="right" label="Edit plate" v-close-popup color="primary" @click="editPlate"/>
        </div>
      </q-card-section>
    </div>
  </div>
</template>

<script>
import OaSectionHeader from "../../components/widgets/OaSectionHeader";

export default {
  name: 'EditPlate',
  components: {OaSectionHeader},
  methods: {
    editPlate() {
      this.editedPlate.id = this.plate.id
      this.editedPlate.experimentId = this.plate.experimentId
      this.$store.dispatch('plates/editPlate', this.editedPlate)
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
      editedPlate: {
        barcode: null,
        description: null
      },
      editdialog: this.props.show
    }
  },
  props: ['show', 'plate'],
  emits: ['update:show']
}
</script>
