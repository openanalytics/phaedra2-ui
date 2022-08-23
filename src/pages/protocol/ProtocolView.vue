<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="protocol">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Protocols'" icon="list" :to="'/protocols'"/>
    <q-breadcrumbs-el :label="protocol.name" icon="ballot"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div" v-if="protocol">
    <ViewProtocol v-if="!editMode" v-model:show="editMode" :protocol="protocol"/>
    <EditProtocol v-if="editMode" v-model:show="editMode" :protocol="protocol"/>
    <FeatureList :protocol="protocol" @addFeature="addNewFeature"/>
  </q-page>
</template>

<script setup>
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import {computed, ref} from "vue";

import ViewProtocol from "@/components/protocol/ViewProtocol";
import EditProtocol from "../../components/protocol/EditProtocol";
import FeatureList from "@/components/feature/FeatureList";

const store = useStore();
const route = useRoute();
const router = useRouter();

const loading = ref(false);
const protocolUpdated = ref(false)

const protocolId = parseInt(route.params.id);
const protocol = computed(() => store.getters['protocols/getById'](protocolId))
store.dispatch('protocols/loadById', protocolId);

const features = computed(() => store.getters['features/getByProtocolId'](protocolId))
if (!store.getters['features/isProtocolLoaded'](protocolId)) {
  loading.value = true;
  store.dispatch('features/loadByProtocolId', protocolId).then(() => {
    loading.value = false;
  });
}

const formulas = computed(() => store.getters['calculations/getFormulas']())
store.dispatch('calculations/getAllFormulas')

const editMode = ref(false)

// const onDescriptionChanged = (newDescription) => {
//   store.dispatch('protocols/editProtocol', {id: protocolId, description: newDescription});
// };

// const columns = ref([
//   {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
//   {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
//   {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
//   {name: 'format', align: 'left', label: 'Format', field: 'format', sortable: true},
//   {name: 'type', align: 'left', label: 'Type', field: 'type', sortable: true},
//   {name: 'formulaId', align: 'left', label: 'Formula', field: 'formulaId', sortable: true},
//   {name: 'menu', align: 'left', field: 'menu', sortable: false}
// ])

// const visibleColumns = columns.value.map(a => a.name)
// const configdialog = ref(false)
// const filter = ref('')
// const filterMethod = FilterUtils.defaultTableFilter()

// const getFormulaName = (id) => {
//   const formula = formulas.value.find(formula => {
//     return formula.id === id
//   });
//   return (formula || {}).name;
// }

const addNewFeature = (feature) => {
  store.dispatch('features/addNewFeatureToProtocol', feature)
  protocolUpdated.value = true
}

// const updateProtocolView = () => {
//   // protocol.value = updated
//   store.dispatch('protocols/editProtocol', updated)
//   store.dispatch('protocols/loadById', updated.id);
// }

// const showFormulaTooltip = ref([])
// const showEditProtocolDialog = ref(false)
// const showEditFeatureSection = ref(false)
// const showNewFeatureTab = ref(false)
// const selectedFeature = ref({})
</script>
