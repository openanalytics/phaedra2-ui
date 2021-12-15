<template>
  <q-breadcrumbs class="breadcrumb" v-if="protocol">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="protocol.name" icon="ballot"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs" v-if="protocol">
    <div class="q-pa-md" v-if="!editdialog">
      <div class="row text-h6 items-center q-px-md oa-section-title">
        <q-icon name="ballot" class="q-pr-sm"/>
        {{ protocol.name }}
      </div>

      <div class="row col-4 q-pa-md oa-section-body">
        <div class="col col-6 q-gutter-xs">
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
              <div class="tag-icon flex inline" v-for="tag in protocol.tags" :key="tag.tag">
                <Tag :tagInfo="tag" :objectInfo="protocol" :objectClass="'PROTOCOL'"></Tag>
              </div>
            </div>
          </div>
        </div>
        <div class="col col-6">
          <div class="row justify-end action-button">
            <q-btn size="sm" color="primary" icon="edit" class="oa-button-edit" label="Edit" @click="editdialog = true"/>
          </div>
          <div class="row justify-end action-button">
            <q-btn size="sm" color="primary" icon="delete" class="oa-button-delete" label="Delete" @click="deletedialog = true"/>
          </div>
          <div class="row justify-end action-button">
            <q-btn size="sm" color="primary" icon="sell" class="oa-button-tag" label="Add Tag" @click="prompt = true"/>
          </div>
        </div>
      </div>
    </div>

    <EditProtocol v-model:show="editdialog" v-model:protocol="protocol"></EditProtocol>

    <div class="q-pa-md" v-if="!newFeatureTab && formulas">
      <div class="row text-h6 items-center q-px-md oa-section-title">
        <q-icon name="functions" class="q-pr-sm"/>
        Features
      </div>
      <q-table :rows="features" :columns="getColumns()" :filter="filter" :filter-method="filterMethod" :loading="loading" :visible-columns="visibleColumns" square>
        <template v-slot:top-right>
          <div class="col action-button on-left">
            <q-btn size="sm" color="primary" icon="add" label="Add Feature..." @click="newFeatureTab = true"/>
          </div>
          <div class="row">
            <q-input outlined rounded dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
            <q-btn flat round color="primary" icon="settings" style="border-radius: 50%;" @click="configdialog=true"/>
          </div>
        </template>
        <template v-slot:body-cell-formulaId="props" >
          <q-td :props="props">
            {{getFormulaName(props.row.formulaId)}}
          </q-td>
        </template>
        <template v-slot:body-cell-protocolId="props">
          <q-td :props="props">
            {{protocol.name}}
          </q-td>
        </template>
        <template v-slot:no-data>
          <div class="full-width row text-info">
            <span>No features to show.</span>
          </div>
        </template>
      </q-table>
    </div>

    <div class="q-pa-md" v-if="newFeatureTab">
      <div class="row text-h6 items-center q-px-md oa-section-title">
        <q-icon name="edit" class="q-pr-sm"/>
        New Feature
      </div>
      <div class="oa-section-body">
        <q-card-section class="row">
          <div class="col-5">
            <q-input v-model="newFeature.name" square autofocus label="Name"></q-input>
            <q-input v-model="newFeature.alias" square label="Alias"></q-input>
            <q-input v-model="newFeature.description" square label="Description"></q-input>
            <q-input v-model="newFeature.format" square label="Format" placeholder="#.##"
                     style="width: 100px"></q-input><br>
            <q-btn flat label="Cancel" color="primary" @click="newFeatureTab = false"/>
          </div>
          <div class="col-1"/>
          <div class="col-5">
            <q-select v-model="newFeature.type" square label="Type" :options="featureTypes"></q-select>
            <q-select v-model="newFeature.formulaId" square label="Formula" :options="formulas.filter(formula => formula.category === newFeature.type)" option-value="id"
                      option-label="name"></q-select>
            <q-input v-model="newFeature.sequence" square label="Sequence"></q-input>
            <q-input v-model="newFeature.trigger" square label="Trigger"></q-input><br>
            <q-btn align="right" label="Add feature" v-close-popup color="primary" @click="addFeature"/>
          </div>
        </q-card-section>
      </div>
    </div>

    <q-dialog v-model="prompt" persistent>
      <q-card>
        <q-card-section style="min-width: 350px">
          <div class="text-h6">Tag:</div>
        </q-card-section>

        <q-card-section>
          <q-input dense v-model="protocolTag" autofocus @keyup.enter="prompt = false"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Add tag" v-close-popup @click="onClick"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deletedialog" persistent>
      <q-card style="min-width: 30vw">
        <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
          <q-avatar icon="delete" color="primary" text-color="white"/> Delete Protocol
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-10">
              <span>Are you sure you want to delete the protocol <b>{{protocol.name}}</b>?</span><br/>
              <span>Type <span
                  style="font-weight: bold">{{ protocol.name }}</span> and press the button to confirm:</span><br/>
              <q-input dense v-model="protocolName" autofocus/><br>
              <span class="text-accent">WARNING: The protocol, features and associated data will be deleted!</span>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn label="Delete protocol" color="accent" v-if="protocol.name==protocolName" v-close-popup
                 @click="deleteProtocol"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <table-config v-model:show="configdialog" v-model:visibleColumns="visibleColumns" v-model:columnsList="columnsList" v-model:columnOrder="columnOrder"></table-config>
  </q-page>
</template>

<script>
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import {computed, ref} from "vue";

import Tag from "@/components/tag/Tag";
import EditProtocol from "./EditProtocol";
import TableConfig from "../../components/table/TableConfig";

const columns = {
  id: {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
  name: {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
  description: {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
  format: {name: 'format', align: 'left', label: 'Format', field: 'format', sortable: true},
  type: {name: 'type', align: 'left', label: 'Type', field: 'type', sortable: true},
  sequence: {name: 'sequence', align: 'left', label: 'Sequence', field: 'sequence', sortable: true},
  protocolId: {name: 'protocolId', align: 'left', label: 'Protocol', field: 'protocolId', sortable: true},
  formulaId: {name: 'formulaId', align: 'left', label: 'Formula', field: 'formulaId', sortable: true},
  trigger: {name: 'trigger', align: 'left', label: 'Trigger', field: 'trigger', sortable: true},
    }

const filterMethod = function (rows, term) {
  return rows.filter(row => {
    return (row.id == term
        || row.barcode.toLowerCase().includes(term)
        || row.description.toLowerCase().includes(term)
        || (row.tags && row.tags.some(tag => tag.toLowerCase().includes(term))))
  })
}

export default {
  name: "ProtocolView",
  components: {
    Tag,
    EditProtocol,
    TableConfig
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const loading = ref(false)
    const protocolId = parseInt(route.params.id);
    const protocol = computed(() => store.getters['protocols/getCurrentProtocol']())
    // if (!store.getters['protocols/isLoaded'](protocolId)) {
      store.dispatch('protocols/loadById', protocolId)
    // }
    // store.dispatch('protocols/loadProtocolsTags', protocolId)

    const  features = computed(() => store.getters['features/getByProtocolId'](protocolId))
    if(!store.getters['features/isProtocolLoaded'](protocolId)) {
      store.dispatch('features/loadByProtocolId', protocolId)
      loading.value = false
    }

    const formulas = computed(() => store.getters['calculations/getFormulas']())
    store.dispatch('calculations/getAllFormulas')

    let columnOrder = ['id','name','description','format','type','sequence','protocolId','formulaId','trigger']
    let columnsList = []
    columnOrder.forEach(function (col) {
      columnsList.push({column: col})
    })
    columnsList.forEach(function (col) {
      //Dummy data
      col.dataType = (Math.random() + 1).toString(36).substring(7)
      col.description = (Math.random() + 1).toString(36).substring(2)
    })
    return {
      protocolId,
      protocol,
      featureTypes: ['CALCULATION', 'NORMALIZATION', 'RAW'],
      formulas,
      features,
      loading,
      columns,
      visibleColumns: ['id','name','description','format','type','sequence','protocolId','formulaId','trigger'],
      columnsList,
      configdialog: ref(false),
      columnOrder,
      filter: ref(''),
      filterMethod
    }
  },
  data() {
    return {
      protocolTag: ref(""),
      prompt: ref(false),
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
      deletedialog: ref(false),
      editdialog: ref(false),
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
    deleteProtocol() {
      this.$store.dispatch('protocols/deleteProtocol', this.protocol).then(() => {
        this.$router.push({name: 'dashboard'})
      })
    },
    getFormulaName(id){
      const formula = this.formulas.find(formula => {return formula.id === id})
      if(formula){
        return formula.name
      }
      else return 'NOT_IN_DB'
    },
    getColumns(){
      let newOrder = []
      let tempList = this.columnOrder.slice()
      while (tempList.length>0){
        const shift = tempList.shift()
        newOrder.push(this.columns[shift])
      }
      return newOrder
    }
  }

}
</script>

<style lang="scss">
@import "src/css/oa.global";

</style>
