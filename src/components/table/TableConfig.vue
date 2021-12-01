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
                :rows="colslist"
                :columns="columns"
                row-key="column"
                :pagination="{ rowsPerPage: 10 }"
                class="full-width"
                square
                flat
                dense
                selection="multiple"
                v-model:selected="selected"
            >
              <template v-slot:body-cell-up="props">
                <q-td :props="props">
                  <div class="row items-center cursor-pointer">
                    <q-btn v-if="this.columnsList.indexOf(props.row)>0" flat round size="sm" icon="arrow_upward" style="border-radius: 50%;">
                    </q-btn>
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-down="props">
                <q-td :props="props">
                  <div class="row items-center cursor-pointer">
                    <q-btn v-if="this.columnsList.indexOf(props.row)<this.columnsList.length-1" flat round size="sm" icon="arrow_downward" style="border-radius: 50%;">
                    </q-btn>
                  </div>
                </q-td>
              </template>
            </q-table>
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
               @click="$emit('update:visibleColumns',selected.map(a => a.column)); $emit('update:show',false)"/>
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
  methods: {
    moveUp(row){
      const index = this.columnsList.indexOf(row)
      let orderedList = null
      for (let i = 0; i < index)
      this.colslist = orderedList
    },
    moveDown(){

    }
  },
  setup(props) {

    const columns = [
      {name: 'column', align: 'left', label: 'Column', field: 'column', sortable: true},
      {name: 'dataType', align: 'left', label: 'Data Type', field: 'dataType', sortable: true},
      {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
      {name: 'up', align: 'left', field: 'up', sortable: false},
      {name: 'down', align: 'left', field: 'down', sortable: false}
    ]

    return {
      props,
      columns
    }
  },
  data() {
    return {
      configdialog: this.props.show,
      colslist: this.props.columnsList,
      selected: this.props.columnsList
    }
  },
  props: ['show', 'visibleColumns', 'columnsList'],
  emits: ['update:visibleColumns', 'update:show']
}
</script>