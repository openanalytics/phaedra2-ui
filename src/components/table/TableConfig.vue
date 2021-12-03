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
                selection="single"
                v-model:selected="selected"
            >
              <template v-slot:header="props">
                <q-tr :props="props" class="text-white bg-primary">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr class="cursor-pointer" :props="props" @click="props.selected = !props.selected">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <span v-if="!(col.name === 'select')">{{col.value }}</span>
                    <q-checkbox v-if="col.name==='select'" v-model="visible" :val="props.row.column">
                    </q-checkbox>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
          <q-card-actions align="center" vertical class="col-2 text-primary">
            <q-btn flat label="Hide All" v-close-popup disable v-if="visible.length===0"/>
            <q-btn flat label="Hide All" v-close-popup v-if="!(visible.length===0)" @click="visible=[]"/>
            <q-btn flat label="Show All" v-close-popup disable v-if="visible.length===props.columnOrder.length"/>
            <q-btn flat label="Show All" v-close-popup v-if="!(visible.length===props.columnOrder.length)" @click="visible=props.columnOrder.slice()"/><br>

            <q-btn flat label="Move up" v-close-popup disable v-if="selected.length===0" @click="moveUp(selected[0])"/>
            <q-btn flat label="Move up" v-close-popup v-if="selected.length>0" @click="moveUp(selected[0])"/>
            <q-btn flat label="Move down" v-close-popup disable v-if="selected.length===0" @click="moveDown(selected[0])"/>
            <q-btn flat label="Move down" v-close-popup v-if="selected.length>0" @click="moveDown(selected[0])"/>
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
   * @props.columnOrder list with order of columns
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
      let newOrder = []
      let tempList = this.colslist.slice()
      while (tempList.length>0){
        const shift = tempList.shift()
        newOrder.push(shift.column)
      }
      this.$emit('update:columnOrder',newOrder)
      this.$emit('update:visibleColumns',this.visible);
      this.$emit('update:show',false)
    }
  },
  setup(props) {

    const columns = [
      {name: 'select', align: 'center',label: 'Visible', field: 'select', sortable: false},
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
      colslist: this.props.columnsList.slice(),
      selected: [],
      visible: this.props.columnOrder.slice()
    }
  },
  props: ['show', 'columnsList', 'columnOrder'],
  emits: ['update:visibleColumns', 'update:columnOrder', 'update:show']
}
</script>