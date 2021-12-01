<template>
  <q-dialog v-model="props.show" persistent>
    <q-card style="min-width: 40vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-avatar icon="settings" color="primary" text-color="white"/>
        Configure Columns
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-10">
            <span>Configure the displayed columns of the table.</span><br><br>
          </div>
        </div>
        <div class="row">
          <div class="col-10 q-pa-md">
            <q-table
                table-header-class="text-white bg-primary"
                :rows="columnsList"
                row-key="column"
                :pagination="{ rowsPerPage: 10 }"
                class="full-width"
                square
                flat
                dense
                selection="multiple"
                v-model:selected="colslist"
            />
          </div>
          <q-card-actions align="center" vertical class="col-2 text-primary">
            <q-btn flat label="Fill1" v-close-popup @click="$emit('update:show',false)"/>
            <q-btn flat label="Fill2" v-close-popup @click="$emit('update:show',false)"/>
            <q-btn flat label="Fill3" v-close-popup @click="$emit('update:show',false)"/>
          </q-card-actions>
        </div>

      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup @click="$emit('update:show',false)"/>
        <q-btn flat label="Update" v-close-popup
               @click="$emit('update:visibleColumns',colslist.map(a => a.column)); $emit('update:show',false)"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  /**
   * Component to toggle visibility of table columns
   * @props.show boolean to open and close configuration dialog
   * @props.columnsList list with all column names, data types, and description
   * @props.visibleColumns list with visible table columns
   */
  name: 'TableConfig',
  methods: {},
  setup(props) {

    const columns = [
      {name: 'column', align: 'left', label: 'Column', field: 'column', sortable: true},
      {name: 'dataType', align: 'left', label: 'Data Type', field: 'dataType', sortable: true},
      {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
    ]

    return {
      props,
      columns
    }
  },
  data() {
    return {
      configdialog: this.props.show,
      colslist: this.props.columnsList
    }
  },
  props: ['show', 'visibleColumns', 'columnsList'],
  emits: ['update:visibleColumns', 'update:show']
}
</script>