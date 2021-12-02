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
                    <q-btn v-if="this.colslist.indexOf(props.row)>0" flat round size="sm" icon="arrow_upward" style="border-radius: 50%;" @click="moveUp(props.row)">
                    </q-btn>
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-down="props">
                <q-td :props="props">
                  <div class="row items-center cursor-pointer">
                    <q-btn v-if="this.colslist.indexOf(props.row)<this.colslist.length-1" flat round size="sm" icon="arrow_downward" style="border-radius: 50%;" @click="moveDown(props.row)">
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
               @click="update"/>
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
      const index = this.colslist.indexOf(row)
      const length = this.colslist.length
      let orderedList = []
      for (let i = 0; i < length-1; i++){
        if(i===index-1){
          const temp = this.colslist.shift()
          orderedList.push(this.colslist.shift())
          orderedList.push(temp)
          continue
        }
        orderedList.push(this.colslist.shift())
      }
      this.colslist = orderedList
    },
    moveDown(row){
      const index = this.colslist.indexOf(row)
      const length = this.colslist.length
      let orderedList = []
      for (let i = 0; i < length-1; i++){
        if(i===index){
          const temp = this.colslist.shift()
          orderedList.push(this.colslist.shift())
          orderedList.push(temp)
          continue
        }
        orderedList.push(this.colslist.shift())
      }
      this.colslist = orderedList
    },
    update(){
      //Update orderedColumns
      console.log('COLUMNS',this.colslist)
      let newOrder = []
      let oldOrder = this.props.orderedColumns
      while (oldOrder.length>0){
        const shift = this.colslist.shift()
        console.log(shift)
        console.log(this.props.orderedColumns)
        const i = oldOrder.findIndex(row => row.name === shift.column)
        console.log(i)
        newOrder.push(oldOrder.splice(i,1))
      }
      console.log('Neworder',newOrder)
      this.$emit('update:orderedColumns',newOrder)
      this.$emit('update:visibleColumns',this.selected.map(a => a.column));
      this.$emit('update:show',false)
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
  props: ['show', 'visibleColumns', 'columnsList', 'orderedColumns'],
  emits: ['update:visibleColumns', 'update:orderedColumns', 'update:show']
}
</script>