<template>
  <q-table
      :rows="rows"
      :columns="columns"
      :filter="filter"
      :filter-method="filterMethod"
      :row-key="rowKey"
      :column-key="columnKey"
      :selection="selection"
      :selected="selected"
      :pagination="pagination"
      :loading="loading"
      class="full-width"
      table-header-class="text-grey"
      separator="cell"
      flat dense square virtual-scroll bordered>
    <template v-slot:header="props" v-if="props.filterRow">
      <q-tr :props="props">
        <q-th v-if="selection" auto-width/>
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{col.label}}
          <q-tooltip>
            {{ col.description || col.label}}
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

    <template v-slot:body-cell-tags="props">
      <q-td :props="props">
        <tag-list :tags="props.row.tags" :readOnly="true" />
      </q-td>
    </template>
    <template v-slot:body-cell-createdBy="props">
      <q-td :props="props">
        <UserChip :id="props.row.createdBy"/>
      </q-td>
    </template>
    <template v-slot:body-cell-updatedBy="props">
      <q-td :props="props">
        <UserChip :id="props.row.updatedBy"/>
      </q-td>
    </template>
    <template v-slot:body-cell-status="props">
      <q-td :props="props">
        <StatusLabel :status="props.row.status || props.row.statusCode"/>
      </q-td>
    </template>

    <slot />

    <template v-for="(value, name) in $slots" v-slot:[name]="data">
      <slot :name="name" v-bind="data" />
    </template>
  </q-table>
</template>

<script setup>
import {defineProps, ref} from 'vue'
import ColumnFilter from "@/components/table/ColumnFilter";
import FilterUtils from "@/lib/FilterUtils";
import TagList from "@/components/tag/TagList.vue";
import UserChip from "@/components/widgets/UserChip.vue";
import StatusLabel from "@/components/widgets/StatusLabel.vue";

// use defineProps for props
const props = defineProps({
  rows: { type: Array, required: true, default: () => [] },
  columns: { type: Array, required: true },
  rowKey: {type: String, required:  false, default: () => "id"},
  columnKey: {type: String, required: false, default: () => "name"},
  visibleColumns: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  selection: {type: String, required: false},
  pagination: { type: Object,
    default: () =>
        ({ rowsPerPage: 10, sortBy: 'createdOn', descending: true})
  },
  filterRow: {type: Boolean, required: false, default: () => true}
})

const filter = FilterUtils.makeFilter(props.columns)
const filterMethod = FilterUtils.defaultFilterMethod()

const selected = ref([])
</script>
