<template>
  <q-breadcrumbs class="breadcrumb" v-if="protocol">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="protocol.name" icon="ballot"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs" v-if="protocol">
    <div class="q-pa-md" v-if="!editdialog">
      <oa-section-header :title="protocol.name" :icon="'ballot'"/>

      <div class="row q-pa-md oa-section-body">
        <div class="col-4 q-gutter-xs">
          <div class="row">
            <div class="col-3 text-weight-bold">ID:</div>
            <div class="col">{{ protocol.id }}</div>
          </div>
          <div class="row">
            <div class="col-3 text-weight-bold">Description:</div>
            <div class="col">{{ protocol.description }}</div>
          </div>
          <div class="row">
            <div class="col-3 text-weight-bold">Low Well Type:</div>
            <div class="col">{{ protocol.lowWelltype }}</div>
          </div>
          <div class="row">
            <div class="col-3 text-weight-bold">High Well Type:</div>
            <div class="col">{{ protocol.highWelltype }}</div>
          </div>
          <div class="row">
            <div class="col-3 text-weight-bold">Editable:</div>
            <div class="col">{{ protocol.editable }}</div>
            <div class="col-3 text-weight-bold">In Development:</div>
            <div class="col">{{ protocol.inDevelopment }}</div>
          </div>
          <div class="row">
            <div class="col-3 text-weight-bold">Tags:</div>
            <div class="col">
              <TagList :objectInfo="protocol" :objectClass="'PROTOCOL'" />
            </div>
          </div>
        </div>

        <div class="col-4">
          <PropertyTable :objectInfo="protocol" :objectClass="'PROTOCOL'"/>
        </div>

        <div class="col-4">
          <div class="row justify-end action-button">
            <q-btn size="sm" color="primary" icon="edit" class="oa-button-edit" label="Edit" @click="editdialog = true"/>
          </div>
          <div class="row justify-end action-button">
            <q-btn size="sm" color="primary" icon="delete" class="oa-button-delete" label="Delete" @click="$refs.deleteDialog.showDialog = true"/>
          </div>
          <div class="row justify-end action-button">
            <q-btn size="sm" color="primary" icon="import_export" class="oa-button-delete" label="Export" @click="exportToJson(protocolId)"/>
          </div>
        </div>
      </div>
    </div>

    <EditProtocol v-model:show="editdialog" v-model:protocol="protocol"></EditProtocol>

    <div class="q-pa-md" v-if="!newFeatureTab && formulas && !editFeatureSection">
      <oa-section-header :title="'Features'" :icon="'functions'"/>
      <q-table :rows="features" row-key="id" :columns="columns" :filter="filter" :filter-method="filterMethod" :loading="loading" :visible-columns="visibleColumns" square>
        <template v-slot:top-left>
          <div class="col action-button on-left">
            <q-btn size="sm" icon="add" class="oa-button" label="New Feature" @click="newFeatureTab = true"/>
          </div>
        </template>
        <template v-slot:top-right>
          <div class="row">
            <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
            <q-btn flat round color="primary" icon="settings" class="on-right" @click="configdialog=true"/>
          </div>
        </template>
        <template v-slot:body-cell-protocolId="props">
          <q-td :props="props">
            {{protocol.name}}
          </q-td>
        </template>
        <template v-slot:body-cell-formulaId="props">
          <q-td :props="props">
            {{getFormulaName(props.row.formulaId)}}
            <q-icon name="info" size="xs" class="text-info cursor-pointer" @click="showFormulaTooltip[props.rowIndex] = true">
              <q-tooltip v-model="showFormulaTooltip[props.rowIndex]" :delay="2000">
                <FormulaInspector :formulaId="props.row.formulaId"/>
              </q-tooltip>
            </q-icon>
          </q-td>
        </template>
        <template v-slot:body-cell-menu="props">
          <q-td :props="props">
            <div class="row items-center cursor-pointer">
              <q-btn flat round icon="more_horiz" style="border-radius: 50%;">
                <q-menu fit>
                  <q-list style="min-width: 100px">
                    <q-item clickable @click="selectedFeature=props.row;editFeatureSection=true">
                      <q-item-section>Edit feature</q-item-section>
                    </q-item>
                    <q-item clickable @click="selectedFeature=props.row;$refs.deleteDialogFeature.showDialog = true">
                      <q-item-section>Delete feature</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="full-width row text-info">
            <span>No features to show.</span>
          </div>
        </template>
      </q-table>
    </div>

    <new-feature v-if="newFeatureTab" v-model:show="newFeatureTab" v-model:protocolId="protocolId"></new-feature>
    <edit-feature v-if="editFeatureSection" v-model:show="editFeatureSection" v-model:originalFeature="selectedFeature"></edit-feature>

    <delete-dialog ref="deleteDialog" v-model:id="protocol.id" v-model:name="protocol.name" :objectClass="'protocol'" @onDeleted="onDeleted" />
    <delete-dialog ref="deleteDialogFeature" v-model:id="selectedFeature.id" v-model:name="selectedFeature.name" :objectClass="'feature'" />
    <table-config v-model:show="configdialog" v-model:visibleColumns="visibleColumns" v-model:columns="columns"></table-config>
  </q-page>
</template>

<script>
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import {computed, ref} from "vue";

import EditProtocol from "./EditProtocol";
import TagList from "@/components/tag/TagList"
import FormulaInspector from "@/components/widgets/FormulaInspector";
import FilterUtils from "@/lib/FilterUtils.js"
import OaSectionHeader from "../../components/widgets/OaSectionHeader";
import TableConfig from "../../components/table/TableConfig";
import EditFeature from "../../components/protocol/EditFeature";
import NewFeature from "../../components/protocol/NewFeature";
import PropertyTable from "@/components/property/PropertyTable";
import DeleteDialog from "../../components/widgets/DeleteDialog";

let columns = ref([
  {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  {name: 'format', align: 'left', label: 'Format', field: 'format', sortable: true},
  {name: 'type', align: 'left', label: 'Type', field: 'type', sortable: true},
  {name: 'sequence', align: 'left', label: 'Sequence', field: 'sequence', sortable: true},
  {name: 'formulaId', align: 'left', label: 'Formula', field: 'formulaId', sortable: true},
  {name: 'menu', align: 'left', field: 'menu', sortable: false}
    ])

export default {
  name: "ProtocolView",
  components: {
    TagList,
    PropertyTable,
    EditProtocol,
    TableConfig,
    EditFeature,
    NewFeature,
    FormulaInspector,
    OaSectionHeader,
    DeleteDialog
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const loading = ref(false)
    const protocolId = parseInt(route.params.id);
    const protocol = computed(() => store.getters['protocols/getCurrentProtocol']())
    store.dispatch('protocols/loadById', protocolId)
    const  features = computed(() => store.getters['features/getByProtocolId'](protocolId))
    if(!store.getters['features/isProtocolLoaded'](protocolId)) {
      store.dispatch('features/loadByProtocolId', protocolId)
      loading.value = false
    }
    const formulas = computed(() => store.getters['calculations/getFormulas']())
    store.dispatch('calculations/getAllFormulas')

    return {
      protocolId,
      protocol,
      featureTypes: ['CALCULATION', 'NORMALIZATION', 'RAW'],
      formulas,
      features,
      loading,
      columns,
      visibleColumns: columns.value.map(a => a.name),
      configdialog: ref(false),
      filter: ref(''),
      filterMethod: FilterUtils.defaultTableFilter(),
      showFormulaTooltip: ref([]),
      onDeleted: () => {
        router.push({name: 'browseProtocols'})
      }
    }
  },
  data() {
    return {
      openFeatureDialog: ref(false),
      newFeature: {
        name: null,
        alias: null,
        description: null,
        format: null,
        type: null,
        sequence: 0,
        protocolId: this.protocolId,
        formulaId: null,
        trigger: null
      },
      newFeatureTab: false,
      protocolName: ref(""),
      editdialog: ref(false),
      editFeatureSection: ref(false),
      selectedFeature: ref({id:9})
    }
  },
  methods: {
    onClick() {
      const tagInfo = {
        objectId: this.protocol.id,
        objectClass: "PROTOCOL",
        tag: this.protocolTag
      }

      this.$store.dispatch('protocols/tagProtocol', tagInfo)
    },
    addFeature() {
      this.newFeature.formulaId = this.newFeature.formulaId.id
      this.$store.dispatch('protocols/addNewFeature', this.newFeature)
      this.newFeatureTab = false
    },
    getFormulaName(id){
      const formula = this.formulas.find(formula => {return formula.id === id})
      if(formula){
        return formula.name
      }
      else return 'NOT_IN_DB'
    },
    exportToJson(id){
      this.$store.dispatch('protocols/downloadAsJson',id)
    }
  }

}
</script>
