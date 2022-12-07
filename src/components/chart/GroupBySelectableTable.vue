<template>
  <q-table
      table-header-class="text-grey"
      square flat dense
      :rows="props.grouperValues"
      :columns="columns"
      :pagination="{ rowsPerPage: 10, sortBy: 'value' }"
      row-key="value"
      selection="multiple"
      v-model:selected="selected"
      :loading="loading"
      @update:selected="updateSelected"
  >
    <template v-slot:body-cell-color="props">
      <q-td :props="props" :style="{color:props.color}">
        <span :style="{height:'20px',width:'20px',backgroundColor:props.row.color,borderRadius:'50%',display:'inline-block'}"></span>
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import {computed, ref, watch} from "vue";
import {useStore} from "vuex";

const props = defineProps(['grouperValues'])
const emits = defineEmits(['grouperSelection'])

const loading = ref(false);

//Selected is a copy of the list of all grouper values
const selected = ref([...props.grouperValues]);
const columns = [
  {name: 'value', align: 'center',  field: 'value', sortable: true},
  {name: 'color', align: 'center', field: 'color', sortable: true},
]

const updateSelected = () => {
  // Filter out selected values if {value: 'value', color: 'color'} is in selected
  const notSelected = props.grouperValues.filter(v => !selected.value.some(s => s.value === v.value))
  emits('grouperSelection', notSelected);
}

//If the grouperValues props changes, we update the selected list
watch(props, () => {
  console.log('watch props', props.grouperValues)
  selected.value = [...props.grouperValues];
})
</script>