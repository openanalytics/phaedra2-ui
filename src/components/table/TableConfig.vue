<template>
  <q-dialog v-model="props.show" persistent>
    <q-card style="min-width: 30vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-avatar icon="edit" color="primary" text-color="white"/> Configure Table
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-10">
            <span>Toggle the columns that have to be displayed/hidden.</span><br/>
          </div>
        </div>
        <div class="col">
          <template v-for="cols in props.columnsList" :key="cols">
            <q-toggle v-model="colslist" :val="cols" />{{cols}}<br>
          </template>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup @click="$emit('update:show',false)"/>
        <q-btn flat label="Update" v-close-popup @click="$emit('update:visibleColumns',colslist); $emit('update:show',false)"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  /**
   * Component to toggle visibility of table columns
   * @props.show boolean to open and close configuration dialog
   * @props.columnsList list with all column names
   * @props.visibleColumns list with visible table columns
   */
  name: 'TableConfig',
  methods: {
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
      configdialog: this.props.show,
      colslist: this.props.columnsList
    }
  },
  props: ['show', 'visibleColumns', 'columnsList'],
  emits: ['update:visibleColumns','update:show']
}
</script>