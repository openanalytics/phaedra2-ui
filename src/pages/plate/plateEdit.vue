<template>
  <q-dialog v-model="editdialog" persistent class="q-gutter-sm">
    <q-card style="min-width: 800px">
      <q-card-section>
        <div class="text-h6">Edit plate:</div>
      </q-card-section>

      <q-card-section class="row">
        <div class="col col-6">
          <q-input v-model="editedPlate.barcode" square autofocus label="Barcode"></q-input>
        </div>
        <div class="col col-1">

        </div>
        <div class="col col-5">
          <q-input v-model="editedPlate.description" square label="Description"></q-input>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup color="primary" @click.stop="editdialog=false"/>
        <q-btn label="Edit plate" v-close-popup color="primary" @click="editPlate"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {computed, watch} from 'vue'
import {useStore} from 'vuex'
import {useRoute} from 'vue-router'


export default {
  name: 'PlateEdit',
  methods: {
    editPlate() {
      this.editedPlate.id = this.plate.id
      this.editedPlate.experimentId = this.plate.experimentId
      console.log(this.editedPlate)
      this.$store.dispatch('plates/editPlate', this.editedPlate)
      console.log(this.plate)
    }
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    const plateId = parseInt(route.params.id);
    console.log('IDDDDD ' + plateId)
    store.dispatch('plates/loadById', plateId);

    const plate = computed(() => store.getters['plates/getCurrentPlate']());

    // Once the plate has loaded, make sure the parent experiment gets loaded too.
    watch(plate, (plate) => {
      if (!store.getters['experiments/isLoaded'](plate.experimentId)) {
        store.dispatch('experiments/loadById', plate.experimentId);
      }
    })

    return {
      plate
    }
  },
  data() {
    return {
      editedPlate: {
        barcode: null,
        description: null
      },
      editdialog: true
    }
  }
}
</script>
