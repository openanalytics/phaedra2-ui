<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="protocol">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Protocols'" icon="list" :to="'/protocols'"/>
    <q-breadcrumbs-el :label="protocol.name" icon="ballot"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs" v-if="protocol">
    <div class="q-pa-md" v-if="!showEditProtocolDialog">
      <oa-section-header :title="protocol.name" :icon="'ballot'"/>

      <div class="row q-pa-md oa-section-body">
        <div class="col-5 q-gutter-xs">
          <div class="row">
            <div class="col-3 text-weight-bold">ID:</div>
            <div class="col">{{ protocol.id }}</div>
          </div>
          <div class="row">
            <div class="col-3 text-weight-bold">Description:</div>
            <div class="col"><EditableField :object="protocol" :fieldName="'description'" @valueChanged="onDescriptionChanged" /></div>
          </div>
          <div class="row">
            <div class="col-3 text-weight-bold">Low Well Type:</div>
            <div class="col">{{ protocol.lowWelltype }}</div>
            <div class="col-3 text-weight-bold">High Well Type:</div>
            <div class="col">{{ protocol.highWelltype }}</div>
          </div>
          <div class="row">
            <div class="col-3 text-weight-bold">Created On:</div>
            <div class="col">{{ FormatUtils.formatDate(protocol.createdOn) || '-' }} <span class="text-weight-bold">by</span> {{ protocol.createdBy || '-' }}</div>
          </div>
          <div class="row">
            <div class="col-3 text-weight-bold">Updated On:</div>
            <div class="col">{{ FormatUtils.formatDate(protocol.updatedOn) || '-' }} <span class="text-weight-bold">by</span> {{ protocol.updatedBy || '-' }}</div>
          </div>
          <div class="row">
            <div class="col-3 text-weight-bold">Tags:</div>
            <div class="col">
              <TagList :objectInfo="protocol" :objectClass="'PROTOCOL'" />
            </div>
          </div>
        </div>

        <div class="col-1"/>

        <div class="col-4">
          <PropertyTable :objectInfo="protocol" :objectClass="'PROTOCOL'"/>
        </div>

        <div class="col-2 q-gutter-xs">
          <div class="row justify-end">
            <q-btn size="sm" color="primary" icon="edit" class="oa-button-edit" label="Edit" @click="showEditProtocolDialog = true"/>
          </div>
          <div class="row justify-end">
            <q-btn size="sm" color="primary" icon="delete" class="oa-button-delete" label="Delete" @click="$refs.deleteDialog.showDialog = true"/>
          </div>
          <div class="row justify-end">
            <q-btn size="sm" color="primary" icon="import_export" class="oa-button-delete" label="Export" @click="exportToJson(protocolId)"/>
          </div>
        </div>
      </div>
    </div>

    <EditProtocol v-model:show="showEditProtocolDialog" v-model:protocol="protocol"></EditProtocol>

    <FeatureList :protocol="protocol" v-if="!showNewFeatureTab && !showEditFeatureSection"></FeatureList>

    <delete-dialog ref="deleteDialog" v-model:id="protocol.id" v-model:name="protocol.name" :objectClass="'protocol'" @onDeleted="onDeleted" />
  </q-page>
</template>

<script setup>
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import {computed, ref} from "vue";

import EditProtocol from "./EditProtocol";
import FilterUtils from "@/lib/FilterUtils.js"
import FormatUtils from "@/lib/FormatUtils.js"
import TagList from "@/components/tag/TagList"
import OaSectionHeader from "@/components/widgets/OaSectionHeader";
import PropertyTable from "@/components/property/PropertyTable";
import DeleteDialog from "@/components/widgets/DeleteDialog";
import EditableField from "@/components/widgets/EditableField";
import FeatureList from "@/components/protocol/FeatureList";

const store = useStore();
const route = useRoute();
const router = useRouter();

const loading = ref(false);

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

const onDescriptionChanged = (newDescription) => {
  store.dispatch('protocols/editProtocol', {id: protocolId, description: newDescription});
};

const columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'format', align: 'left', label: 'Format', field: 'format', sortable: true},
  {name: 'type', align: 'left', label: 'Type', field: 'type', sortable: true},
  {name: 'formulaId', align: 'left', label: 'Formula', field: 'formulaId', sortable: true},
  {name: 'menu', align: 'left', field: 'menu', sortable: false}
])

const visibleColumns = columns.value.map(a => a.name)
const configdialog = ref(false)
const filter = ref('')
const filterMethod = FilterUtils.defaultTableFilter()

const onDeleted = () => {
  router.push({name: 'browseProtocols'})
}

const getFormulaName = (id) => {
  const formula = formulas.value.find(formula => {
    return formula.id === id
  });
  return (formula || {}).name;
}

const exportToJson = (id) => {
  store.dispatch('protocols/downloadAsJson', id)
}

const showFormulaTooltip = ref([])
const showEditProtocolDialog = ref(false)
const showEditFeatureSection = ref(false)
const showNewFeatureTab = ref(false)
const selectedFeature = ref({})
</script>
