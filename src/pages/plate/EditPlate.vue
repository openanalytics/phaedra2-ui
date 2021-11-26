<template>
  <div class="q-pa-md" v-if="props.show">
    <div class="row text-h6 items-center q-px-sm oa-section-title">
      <q-icon name="edit" class="q-mr-sm"/>
      Edit Plate
    </div>
    <div class="row col-12 q-pa-md oa-section-body">
      <q-card-section class="row" style="min-width: 95vw">
        <div class="col col-5">
          <q-input v-model="editedPlate.barcode" square autofocus label="Barcode"></q-input><br>
          <q-btn flat label="Cancel" color="primary" @click="$emit('update:show',false)"/>
        </div>
        <div class="col col-1">

        </div>
        <div class="col col-4">
          <q-input v-model="editedPlate.description" square label="Description"></q-input><br>
          <q-btn align="right" label="Edit plate" v-close-popup color="primary" @click="editPlate"/>
        </div>
      </q-card-section>
    </div>
  </div>
</template>

<script>

export default {
  name: 'EditPlate',
  methods: {
    editPlate() {
      this.editedPlate.id = this.plate.id
      this.editedPlate.experimentId = this.plate.experimentId
      this.$store.dispatch('plates/editPlate', this.editedPlate)
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
