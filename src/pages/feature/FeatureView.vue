<template>
  <q-breadcrumbs class="oa-breadcrumb" v-if="feature && protocol">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'Protocols'" icon="list" :to="'/protocols'"/>
    <q-breadcrumbs-el :label="protocol.name" icon="ballot" :to="'/protocol/' + protocol.id"/>
    <q-breadcrumbs-el :label="feature.name" icon="functions"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs" v-if="feature">
    <div class="q-pa-md" v-if="!editdialog">
      <oa-section-header v-if="!feature" :title="'Loading feature...'" :icon="'view_module'"/>
      <div v-else>
        <oa-section-header :title="feature.name" :icon="'functions'"/>
        <div class="row q-pa-md oa-section-body">
          <div class="col-4 q-gutter-xs">
            <div class="row">
              <div class="col-3 text-weight-bold">ID:</div>
              <div class="col">{{ feature.id }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Alias:</div>
              <div class="col">{{ feature.alias }}
              </div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Description:</div>
              <div class="col">{{ feature.description }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Format:</div>
              <div class="col">{{ feature.format }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Sequence:</div>
              <div class="col">{{ feature.sequence }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Trigger:</div>
              <div class="col">{{ feature.trigger }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Type:</div>
              <div class="col">{{ feature.type }}</div>
            </div>
            <div class="row">
              <div class="col-3 text-weight-bold">Tags:</div>
              <div class="col">
                <TagList :objectInfo="feature" :objectClass="'FEATURE'"/>
              </div>
            </div>
          </div>

          <div class="col-4">
            <PropertyTable :objectInfo="feature" :objectClass="'FEATURE'"/>
          </div>

          <div class="col col-4">
            <div class="row justify-end action-button">
              <q-btn size="sm" color="primary" icon="edit" class="oa-button-edit" label="Edit"
                     @click="editdialog = true"/>
            </div>
            <div class="row justify-end action-button">
              <q-btn size="sm" color="primary" icon="delete" class="oa-button-delete" label="Delete"
                     @click="$refs.deleteDialog.showDialog = true"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <edit-feature v-if="editdialog" v-model:show="editdialog" v-model:originalFeature="feature"></edit-feature>

    <div class="q-pa-md" v-if="feature&&!editdialog">
      <q-tabs
          inline-label dense no-caps
          align="left"
          class="q-px-sm oa-section-title"
          v-model="activeTab"
      >
        <q-tab name="formula" icon="functions" label="Formula"/>
        <q-tab name="curve_fitting" label="Dose-Response Curve Fitting"/>
        <q-tab name="outlier_detection" label="Outlier Detection"/>
        <q-tab name="hit_calling" icon="rules" label="Hit Calling"/>
      </q-tabs>
      <div class="row oa-section-body">
        <q-tab-panels v-model="activeTab" animated style="width: 100%">
          <q-tab-panel name="formula" label="Formula">
            <FormulaTab :formula="formula" :formulaInputs="formulaInputs"/>
          </q-tab-panel>
          <q-tab-panel name="curve_fitting">
            <div>Not yet implemented!</div>
          </q-tab-panel>
          <q-tab-panel name="outlier_detection">
            <div>Not yet implemented!</div>
          </q-tab-panel>
          <q-tab-panel name="hit_calling">
            <div>Not yet implemented!</div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <delete-dialog ref="deleteDialog" v-model:id="feature.id" v-model:name="feature.name" :objectClass="'feature'"
                   @onDeleted="onDeleted"/>
  </q-page>
</template>

<style scoped>
.action-button {
  margin: 3px;
}
</style>

<script setup>
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import {computed, ref} from "vue";

import TagList from '../../components/tag/TagList'
import PropertyTable from "../../components/property/PropertyTable";
import OaSectionHeader from "../../components/widgets/OaSectionHeader";
import DeleteDialog from "../../components/widgets/DeleteDialog";
import FormulaTab from "./FormulaTab";
import EditFeature from "../../components/feature/EditFeature";

const store = useStore();
const route = useRoute();
const router = useRouter();

const featureId = parseInt(route.params.id);
const feature = computed(() => store.getters['features/getById'](featureId));
const protocol = computed(() => store.getters['protocols/getById'](feature.value.protocolId));
const formula = computed(() => store.getters['calculations/getFormula'](feature.value.formulaId));
const formulaInputs = computed(() => {
  return store.getters['calculations/getFormulaInputs'](feature.value.formulaId)
})
store.dispatch('features/loadByIds',[featureId]).then(() => {
  if (!protocol.value) {
    store.dispatch('protocols/loadById', feature.value.protocolId);
  }
  if (!formula.value) {
    store.dispatch('calculations/getFormula', feature.value.formulaId);
  }
  if (!formulaInputs.value) {
    store.dispatch('calculations/getFormulaInputs', feature.value.formulaId);
  }
});

const editdialog = ref(false);
const activeTab = ref('formula');
</script>
