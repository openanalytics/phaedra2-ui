<template>
  <div class="q-pa-md">
    <div class="q-px-sm oa-section-title">
      <div class="text-h6">Features</div>
    </div>
    <q-table
        table-header-class="text-dark"
        flat square
        :rows="features"
        :columns="columns"
        row-key="id"
        no-data-label="No features defined for this protocol"
        class="oa-section-body">
      <template v-slot:top-right>
        <q-btn dense color="primary" label="Add feature" @click="openFeatureDialog = true">
        </q-btn>
      </template>
    </q-table>
  </div>
</template>

<script>

import {useStore} from "vuex";
import {computed} from "vue";

const columns = [
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'format', align: 'left', label: 'Format', field: 'dimensions', sortable: true},
  {name: 'type', align: 'left', label: 'Type', field: 'type', sortable: true},
  {name: 'sequence', align: 'left', label: 'Sequence', field: 'sequence', sortable: true},
  {name: 'formulaId', align: 'left', label: 'Formula', field: 'formulaId', sortable: true},
  {name: 'trigger', align: 'left', label: 'Trigger', field: 'trigger', sortable: true}
];

export default {
  props: {
    protocol: Object
  },
  setup(props) {
    const store = useStore();

    const features = computed(() => store.getters['features/getByProtocolId'](props.protocol?.id));
    store.dispatch("features/loadByProtocolId", props.protocol?.id);

    return {
      columns,
      features
    }
  }
}
</script>

<style scoped>

</style>
