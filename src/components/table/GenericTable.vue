<template>
  <q-table
      class="full-width"
      table-header-class="text-grey"
      :rows="rows"
      :columns="columns"
      :filter="filter"
      :filter-method="filterMethod"
      row-key="id"
      column-key="name"
      :selection="selection"
      :selected="selected"
      :pagination="pagination"
      :loading="loading"
      separator="cell"
      @row-click="rowClick"
      @row-dblclick="rowDblclick"
      @row-contextmenu="rowContextMenu"
      flat dense square virtual-scroll
  >
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-if="selection" auto-width/>
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{col.label}}
          <q-tooltip>
            {{ col.description }}
          </q-tooltip>
        </q-th>
      </q-tr>
      <q-tr :props="props">
        <q-th v-if="selection" auto-width>
          <q-checkbox v-if="selection === 'multiple'" v-model="props.selected" dense />
        </q-th>
        <column-filter v-for="col in props.cols" :key="col.name" v-model="filter[col.name]"/>
      </q-tr>
    </template>

    <slot />

    <template v-for="(value, name) in $slots" v-slot:[name]="data">
      <slot :name="name" v-bind="data" />
    </template>
  </q-table>
</template>

<script setup>
import {defineProps, defineEmits, ref, computed} from 'vue'
import ColumnFilter from "@/components/table/ColumnFilter";
import FilterUtils from "@/lib/FilterUtils";

// use defineProps for props
const props = defineProps({
  rows: { type: Array, required: true },
  columns: { type: Array, required: true },
  visibleColumns: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  selection: {type: String, required: false},
  pagination: { type: Object,
    default: () =>
        ({ rowsPerPage: 10, sortBy: 'createdOn', descending: true})
  }
})

const filter = FilterUtils.makeFilter(props.columns)
const filterMethod = FilterUtils.defaultFilterMethod()

const selected = ref([])

// Use defineEmit to define emit function
const emit = defineEmits(['row-dblclick'])

// Methods are no longer required
const rowClick = (event, row) => {
  emit('row-click', event, row)
}

const rowDblclick = (event, row) => {
  emit('row-dblclick', event, row)
}

const rowContextMenu = (event, row) => {
  emit('row-contextmenu', event, row)
}
</script>
