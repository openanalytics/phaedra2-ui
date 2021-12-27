<template>
  <q-dialog v-model="props.show" persistent>
    <q-card style="min-width: 40vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-avatar icon="playlist_add" color="primary" text-color="white"/>
        Link Plate Template
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div>
            <span>By linking plates with the system they were defined in, substance and control information can be retrieved and applied to the plate(s).</span><br><br>
          </div>
        </div>
        <div class="row text-h6 items-center q-px-sm oa-section-title">
          <q-icon name="view_module" class="on-left"/>Plates
        </div>
        <q-table
            table-header-class="text-white bg-primary"
            :rows="plates"
            :columns="columns"
            :pagination="{ rowsPerPage: 10 }"
            class="full-width"
            square
            flat
            dense
            selection="multiple"
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
                <span v-if="!(col.name === 'select')">{{ col.value }}</span>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>

import {useStore} from "vuex";
import {computed, ref} from "vue";
import {useRoute} from "vue-router";

export default {
  name: 'LinkPlate',
  setup(props) {
    const store = useStore()
    const route = useRoute()

    const experimentId = parseInt(route.params.id);
    const plates = computed(() => store.getters['plates/getByExperimentId'](experimentId))
    const selected = ref([])
    return {
      props,
      plates,
      selected,
      columns: [
        {name: 'sequence', align: 'left', label: 'Sequence', field: 'sequence', sortable: true},
        {name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true},
        {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
        {name: 'status', align: 'left', label: 'Status', field: 'linkStatus', sortable: true}
      ]
    }
  },
  props: ['show'],
  emits: ['update:show']
}
</script>