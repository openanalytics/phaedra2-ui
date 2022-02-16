<template>
  <q-page class="oa-root-div">
    <div class="q-pa-md">
      <oa-section-header :title="'Formula: ' + formula.name" :icon="'functions'"/>
      <div class="q-pa-lg oa-section-body">
        <div class="row q-col-gutter-md">
          <div class="col-4">
            <q-input v-model="formula.name" label="Name" :readonly=!editMode></q-input>
            <q-input v-model="formula.description" label="Description" :readonly=!editMode></q-input>

            <q-select v-model="formula.category" label="Category" :options="categories" options-dense
                      :readonly=!editMode></q-select>
            <q-select v-model="formula.language" label="Language" :options="languages" options-dense
                      :readonly=!editMode></q-select>
            <q-select v-model="formula.scope" label="Scope" :options="scopes" options-dense
                      :readonly=!editMode></q-select>
          </div>
          <div class="col-6">
            <q-input v-model="formula.id" label="ID" readonly></q-input>
            <q-input v-model="formula.createdBy" label="Created By" readonly></q-input>
            <q-input v-model="formula.createdOn" label="Created On" readonly></q-input>
            <q-input v-model="formula.updatedOn" label="Last Updated On" readonly></q-input>
          </div>
          <div class="col-2">
            <div class="row justify-end">
              <q-btn size="sm" color="primary" icon="edit" class="oa-button" label="Edit" v-show="!editMode"
                     @click="toggleEditMode"/>
              <q-btn size="sm" color="primary" icon="delete" class="oa-button q-mt-sm" label="Delete" v-show="!editMode"
                     @click="$refs.deleteDialog.showDialog = true"/>

              <q-btn size="sm" color="primary" icon="save" class="oa-button" label="Save Changes" v-show="editMode"
                     @click="saveChanges"/>
              <q-btn size="sm" color="primary" icon="cancel" class="oa-button q-mt-sm" label="Cancel" v-show="editMode"
                     @click="cancelEditMode"/>
            </div>
          </div>
        </div>
        <div class="q-pt-md">
          <q-input v-model="formula.formula" label="Formula" type="textarea" outlined square
                   :readonly=!editMode></q-input>
          <span class="text-grey text-caption">
                        Input variables: {{ formulaInputs.length > 0 ? formulaInputs : 'None' }}
                    </span>
        </div>
      </div>
    </div>
  </q-page>
  <delete-dialog ref="deleteDialog" v-model:id="formula.id" v-model:name="formula.name" :objectClass="'formula'" @onDeleted="onDeleted" />
</template>

<script>
import {computed, ref} from 'vue'
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'
import OaSectionHeader from "../../../components/widgets/OaSectionHeader";
import DeleteDialog from "../../../components/widgets/DeleteDialog";

export default {
  components: {
    OaSectionHeader,
    DeleteDialog
  },
  setup() {
    const exported = {};

    const route = useRoute();
    const router = useRouter();
    const formulaId = parseInt(route.params.id);

    exported.editMode = ref(false);
    exported.toggleEditMode = () => {
      exported.editMode.value = !exported.editMode.value;
    }

    exported.onDeleted = () => {
      router.push({name: 'calcFormulas'})
    }

    exported.saveChanges = async () => {
      if (formulaId == 0) {
        const newFormula = await store.dispatch('calculations/createFormula', exported.formula.value);
        router.push("/calc/formula/" + newFormula.id);
      } else {
        await store.dispatch('calculations/updateFormula', {id: formulaId, formula: exported.formula.value});
        fetchFormulaWorkingCopy();
      }
      exported.editMode.value = false;
    }

    exported.cancelEditMode = () => {
      if (formulaId == 0) {
        router.push("/calc/formulas");
      } else {
        exported.editMode.value = false;
        fetchFormulaWorkingCopy();
      }
    }

    exported.formula = ref({});
    const store = useStore();
    const fetchFormulaWorkingCopy = () => {
      let originalFormula = store.getters['calculations/getFormula'](formulaId) || {};
      // Return a shallow copy of the formula for editing
      exported.formula.value = {...originalFormula}
    }

    if (formulaId == 0) {
      exported.editMode.value = true;
    } else {
      store.dispatch('calculations/getFormula', formulaId).then(fetchFormulaWorkingCopy);
    }

    exported.formulaInputs = computed(() => {
      return store.getters['calculations/getFormulaInputs'](formulaId) || []
    })
    if (formulaId > 0) store.dispatch('calculations/getFormulaInputs', formulaId);

    exported.categories = computed(() => (store.getters['calculations/getCategories']() || []));
    exported.languages = computed(() => (store.getters['calculations/getLanguages']() || []));
    exported.scopes = computed(() => (store.getters['calculations/getScopes']() || []));

    return exported;
  },
}
</script>