<template>
    <q-breadcrumbs class="oa-breadcrumb" v-if="formula">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
        <q-breadcrumbs-el :label="'Formulas'" icon="list" :to="'/calc/formulas'"/>
        <q-breadcrumbs-el :label="formula.name" icon="functions"/>
    </q-breadcrumbs>
    
    <q-page class="oa-root-div">
        <div class="q-pa-md">
            <oa-section :title="formula.name" icon="functions" :collapsible="true">
                <div class="q-pa-md">
                    <div class="row q-col-gutter-md">
                        <div class="col-3">
                            <q-input v-model="formula.id" label="ID" readonly dense borderless></q-input>
                            <q-input v-model="formula.name" label="Name" :readonly="!editMode" stack-label dense :borderless="!editMode"></q-input>
                            <q-input v-model="formula.description" label="Description" :readonly="!editMode" stack-label dense :borderless="!editMode"></q-input>
                        </div>
                        <div class="col-3">
                            <q-select v-model="formula.language" label="Language" :options="languages" options-dense :readonly=!editMode stack-label dense :borderless="!editMode"></q-select>
                            <q-select v-model="formula.scope" label="Scope" :options="scopes" options-dense :readonly=!editMode stack-label dense :borderless="!editMode"></q-select>
                        </div>
                        <div class="col-2">
                            <q-field label="Created On" stack-label dense borderless>
                                <template v-slot:control>
                                    {{ FormatUtils.formatDate(formula.createdOn) }}
                                </template>
                            </q-field>
                            <q-field label="Created By" stack-label dense borderless>
                                <template v-slot:control>
                                    <div class="q-pt-xs">
                                        <UserChip :id="formula.createdBy"/>
                                    </div>
                                </template>
                            </q-field>
                        </div>
                        <div class="col-2">
                            <q-field label="Updated On" stack-label dense borderless>
                                <template v-slot:control>
                                    {{ FormatUtils.formatDate(formula.updatedOn) }}
                                </template>
                            </q-field>
                            <q-field label="Updated By" stack-label dense borderless>
                                <template v-slot:control>
                                    <div class="q-pt-xs">
                                        <UserChip :id="formula.updatedBy"/>
                                    </div>
                                </template>
                            </q-field>
                        </div>
                        <div class="col-2">
                            <div class="row justify-end">
                                <q-btn size="sm" color="primary" icon="edit" class="oa-action-button" label="Edit" v-show="!editMode" @click="toggleEditMode"/>
                                <q-btn size="sm" color="primary" icon="delete" class="oa-action-button" label="Delete" v-show="!editMode" @click="$refs.deleteDialog.showDialog = true"/>
                                <q-btn size="sm" color="primary" icon="save" class="oa-action-button" label="Save Changes" v-show="editMode" @click="saveChanges"/>
                                <q-btn size="sm" color="primary" icon="cancel" class="oa-action-button" label="Cancel" v-show="editMode" @click="cancelEditMode"/>
                            </div>
                        </div>
                    </div>
                </div>
            </oa-section>
            <oa-section title="Formula" icon="description" class="q-pt-md">
                <div class="q-pa-md" style="max-height: 750px">
                    <q-input v-model="formula.formula" label="Formula" type="textarea" square :readonly=!editMode></q-input>
                    <span class="text-grey text-caption">
                        Input variables detected: {{ formulaInputs.length > 0 ? formulaInputs.map(n => `\"${n}\"`).join(",") : 'None' }}
                    </span>
                </div>
            </oa-section>
        </div>
    </q-page>
    <delete-dialog ref="deleteDialog" v-model:id="formula.id" v-model:name="formula.name" :objectClass="'formula'" @onDeleted="onDeleted" />
</template>

<script>
import {computed, ref} from 'vue'
import {useStore} from 'vuex'
import {useRoute, useRouter} from 'vue-router'

import FormatUtils from "@/lib/FormatUtils.js"

import OaSection from "@/components/widgets/OaSection";
import DeleteDialog from "@/components/widgets/DeleteDialog";
import UserChip from "@/components/widgets/UserChip";

export default {
    components: {
        OaSection,
        DeleteDialog,
        UserChip
    },
    setup: function () {
        const exported = {
            FormatUtils: FormatUtils
        };
        
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
            let newFormula = null;
            if (formulaId === 0) {
                newFormula = await store.dispatch('calculations/createFormula', exported.formula.value);
            } else {
                newFormula = await store.dispatch('calculations/updateFormula', {id: formulaId, formula: exported.formula.value});
                // fetchFormulaWorkingCopy();
            }
            router.push("/calc/formula/" + newFormula.id);
            // exported.editMode.value = false;
        }
        
        exported.cancelEditMode = () => {
            if (formulaId === 0) {
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
        
        if (formulaId === 0) {
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
