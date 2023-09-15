<template>
  <q-dialog v-model="showDialog" persistent>
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
                :rows="colslist.list"
                :columns="dialogColumns"
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
                    <q-checkbox v-if="col.name==='select'" v-model="visible.list" :val="props.row.column">
                    </q-checkbox>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
          <q-card-actions align="center" vertical class="col-2 text-primary">
            <q-btn flat label="Hide All" v-close-popup disable v-if="visible.list.length===0"/>
            <q-btn flat label="Hide All" v-close-popup v-if="!(visible.list.length===0)" @click="visible.list=[]"/>
            <q-btn flat label="Show All" v-close-popup disable v-if="visible.list.length===colslist.list.length"/>
            <q-btn flat label="Show All" v-close-popup v-if="!(visible.list.length===colslist.list.length)" @click="visible.list=colslist.list.map(a => a.column).slice()"/><br>

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

<script setup>

import {watch, reactive, ref, computed} from "vue";

const props = defineProps(['show', 'columns'])
const emits = defineEmits(['update:visibleColumns', 'update:columns', 'update:show'])

const showDialog = computed({
  get: () => props.show,
  set: (v) => emits('update:show', v)
})

const configdialog = ref(props.show)
const selected = ref([])

//Make props reactive so they get updated in the table
let visible = reactive({list: props.columns?.map(a => a.name)})
let colslist = reactive({
  list: props.columns?.map(a => ({
    column: a.name,
    dataType: (Math.random() + 1).toString(36).substring(7),
    description: (Math.random() + 1).toString(36).substring(2)
  }))
})

const moveUp = (row) => {
  const index = colslist.list.indexOf(row)
  if (index === 0) return
  const length = colslist.list.length
  let orderedList = []
  for (let i = 0; i < length - 1; i++) {
    if (i === index - 1) {
      const temp = colslist.list.shift()
      orderedList.push(colslist.list.shift())
      orderedList.push(temp)
      continue
    }
    orderedList.push(colslist.list.shift())
  }
  colslist.list = orderedList
}

const moveDown = (row) => {
  const index = colslist.list.indexOf(row)
  const length = colslist.list.length
  if (index === length - 1) return
  let orderedList = []
  for (let i = 0; i < length - 1; i++) {
    if (i === index) {
      const temp = colslist.list.shift()
      orderedList.push(colslist.list.shift())
      orderedList.push(temp)
      continue
    }
    orderedList.push(colslist.list.shift())
  }
  colslist.list = orderedList
}
const update = () => {
  let newOrder = []
  let tempList = colslist.list.slice()
  let tempColumns = columns.slice()
  while (tempList.length > 0) {
    const shift = tempList.shift()
    newOrder.push(tempColumns.find(obj => obj.name === shift.column))
  }
  this.$emit('update:columns', newOrder)
  this.$emit('update:visibleColumns', this.visible.list);
  this.$emit('update:show', false)
}

const dialogColumns = [
  {name: 'select', align: 'center', label: 'Visible', field: 'select', sortable: false},
  {name: 'column', align: 'left', label: 'Column', field: 'column', sortable: true},
  {name: 'dataType', align: 'left', label: 'Data Type', field: 'dataType', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true}
]

//Watch for props change to update lists
watch(props.columns, (cols) => {
  visible.list = cols.map(a => a.name)
  colslist.list = cols.map(a => ({
    column: a.name,
    dataType: (Math.random() + 1).toString(36).substring(7),
    description: (Math.random() + 1).toString(36).substring(2)
  }))
})

</script>
