<template>
  <q-table
      table-header-class="text-white bg-primary"
      :rows="protocols"
      :columns="columns"
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
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>

import {useStore} from "vuex";
import {computed} from "vue";

export default {
  name: 'ProtocolSelectableList',
  setup(props){
    const store = useStore()
    const protocols = computed(() => store.getters['protocols/getAll']())
    if (!store.getters['protocols/isLoaded']()){
      store.dispatch('protocols/loadAll')
    }
    return {
      props,
      protocols,
      selected: [],
      columns: [
        {name: 'id', align: 'left',label: 'Id', field: 'id', sortable: true},
        {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
        {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
        {name: 'highWellType', align: 'left', label: 'High Well Type', field: 'highWellType', sortable: true},
        {name: 'lowWellType', align: 'left', label: 'Low Well Type', field: 'lowWellType', sortable: true},
      ]
    }
  }
}
</script>