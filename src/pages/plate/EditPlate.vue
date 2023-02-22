<template>
  <div class="q-pa-md" v-if="props.show">
    <oa-section-header :title="'Edit Plate'" :icon="'edit'"/>
    <div class="row q-pa-md oa-section-body">
<!--      <q-card-section>-->
          <div class="col-5">
            <div class="self-center full-width no-outline">
              <q-input v-model="editedPlate.barcode" label="Barcode" stack-label autofocus/>
            </div>
            <div class="self-center full-width no-outline">
              <q-input v-model="editedPlate.description" label="Description" stack-label/>
            </div>
          </div>

          <div class="col-2">

          </div>
          <div class="col-5">
            <div class="row justify-end">
              <q-btn size="sm" icon="edit" label="Edit" class="oa-action-button" @click="editPlate"/>
            </div>
            <div class="row justify-end">
              <q-btn size="sm" icon="cancel" label="Cancel" class="oa-action-button" @click="$emit('update:show',false)"/>
            </div>
          </div>
<!--      </q-card-section>-->
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
