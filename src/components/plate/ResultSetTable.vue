<template>
  <oa-table
           :title="'Result Set ' + props.resultSet[0].resultSetId"
           :rows="props.resultSet"
           :columns="columns"
           no-data-label="No result sets available for this plate"
  >
    <template v-slot:top-left>
      <q-btn size="sm" color="primary" icon="arrow_back" label="Back" @click="emit('update:resultSetShow', false)"/>
    </template>
  </oa-table>
</template>

<script setup>
  import {computed, ref} from 'vue'
  import {useStore} from "vuex";
  import OaTable from "@/components/table/OaTable.vue";

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
  });

</script>
