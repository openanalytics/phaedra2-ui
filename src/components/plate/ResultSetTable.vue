<template>
  <q-table
           table-header-class="text-grey"
           flat square dense
           :title="'Result Set ' + props.resultSet[0].resultSetId"
           :rows="props.resultSet"
           :columns="columns"
           :visible-columns="visibleColumns"
           row-key="id"
           :filter-method="filterMethod"
           :filter="filter"
           :pagination="{ rowsPerPage: 10 }"
           no-data-label="No result sets available for this plate"
  >
    <template v-slot:top-left>
      <q-btn size="sm" color="primary" icon="arrow_back" label="Back" @click="emit('update:resultSetShow', false)"/>
    </template>
    <template v-slot:top-right>
      <div class="row">
        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
        <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;" @click="showConfigDialog=true"/>
      </div>
    </template>
    <template v-slot:body-cell-status="props">
      <q-td :props="props">
        <StatusLabel :status="props.value" />
      </q-td>
    </template>
  </q-table>
  <table-config v-model:show="showConfigDialog" v-model:visibleColumns="visibleColumns" v-model:columns="columns" />
</template>

<script setup>
  import {computed, ref} from 'vue'
  import {useStore} from "vuex";

  import FilterUtils from "@/lib/FilterUtils";
  import TableConfig from "@/components/table/TableConfig";
  import StatusLabel from "@/components/widgets/StatusLabel";

  const store = useStore();
  const props = defineProps({
    resultSet: Array,
    resultSetShow: Boolean
  });
  const emit = defineEmits(['update:resultSetShow']);

  const getFeatureName = (id) => {
    const feature = features.value?.find(formula => formula.id === id);
    if (feature) return feature.name.split("_feature")[0];
    else return '';
  };

  const columns = ref([
    {name: 'feature', align: 'left', label: 'Feature', field: 'featureId', format: getFeatureName, sortable: true},
    {name: 'status', align: 'left', label: 'Status', field: 'statusCode', sortable: true},
    {name: 'menu', align: 'left', field: 'menu', sortable: false}
  ]);

  let visibleColumns = columns.value.map(a => a.name);
  const showConfigDialog = ref(false);
  const filter = ref('');
  const filterMethod = FilterUtils.defaultTableFilter();

  const features = computed(() => store.getters['features/getByProtocolId'](props.resultSet[0].protocolId));
  if (!store.getters['features/isProtocolLoaded'](props.resultSet[0].protocolId)) {
    store.dispatch('features/loadByProtocolId', props.resultSet[0].protocolId);
  }

  const allStats = props.resultSet.flatMap(rs => rs.plateStats).map(s => s.name);
  Array.from(new Set(allStats)).forEach(stat => {
    columns.value.push({
      name: stat,
      align: 'left',
      label: stat,
      field: row => row.plateStats.find(ps => ps.name === stat)?.value,
      sortable: true
    });
    visibleColumns.push(stat);
  });

</script>