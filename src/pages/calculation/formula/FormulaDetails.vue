<template>
  <phaedra-details-section v-if="formulaStore.formula && formulaStore.formula.name">
    <template v-slot:title>
      <q-icon class="q-mx-sm" name="functions" size="md"/>
      <span> {{ formulaStore.formula.name }} </span>
      <span class="q-mx-sm" style="font-size: 0.7em">
        ({{ formulaStore.formula.id }})
        <q-tooltip>ID</q-tooltip>
      </span>
    </template>
    <template v-slot:actions>
      <span v-show="!editMode" class="q-ml-xs">
        <q-btn size="xs" icon="edit" color="positive" round @click="toggleEditMode">
          <q-tooltip>Edit Formula</q-tooltip>
        </q-btn>
      </span>
      <span v-show="editMode" class="q-ml-xs">
        <q-btn size="xs" icon="save" color="positive" round @click="saveChanges">
          <q-tooltip>Save Changes</q-tooltip>
        </q-btn>
      </span>
      <span v-show="editMode" class="q-ml-xs">
        <q-btn size="xs" icon="cancel" color="negative" round @click="cancelEditMode">
          <q-tooltip>Cancel Changes</q-tooltip>
        </q-btn>
      </span>
    </template>
    <template v-slot:readonly>
      <div class="col">
        <div>
          <user-chip :id="formulaStore.formula.createdBy" label="Created By" on-hover-message="Created By"/>
        </div>
        <div>
          <date-chip :date-time="formulaStore.formula.createdOn" label="Created On" on-hover-message="Created On"/>
        </div>
      </div>
      <div class="col">
        <div>
          <user-chip :id="formulaStore.formula.updatedBy" label="Updated By" on-hover-message="Updated By"/>
        </div>
        <div>
          <date-chip :date-time="formulaStore.formula.updatedOn" label="Updated On" on-hover-message="Updated On"/>
        </div>
      </div>
    </template>
    <template v-slot:editable>
      <div class="row">
        <div class="col">
          <editable-field :object="formulaStore.formula" field-name="versionNumber"
                          :read-only="!editMode" label="Version"
                          @value-changed="(value) => formulaStore.formula.versionNumber = value"/>
          <editable-field :object="formulaStore.formula" field-name="name"
                          :read-only="!editMode" label="Name"
                          @value-changed="(value) => formulaStore.formula.name = value"/>
          <editable-field :object="formulaStore.formula" field-name="description"
                          :read-only="!editMode" label="Description"
                          @value-changed="(value) => formulaStore.formula.description = value"/>
          <q-field label="Deprecated" stack-label dense borderless>
            <template v-slot:control>
              <q-toggle size="sm" dense :disable="!editMode" v-model="formulaStore.formula.deprecated"/>
            </template>
          </q-field>
        </div>
        <div class="col">
          <q-select v-model="formulaStore.formula.category" label="Category" :options="categories"
                    :readonly=!editMode stack-label dense options-dense/>
          <q-select v-model="formulaStore.formula.language" label="Language" :options="languages"
                    :readonly=!editMode stack-label dense options-dense/>
          <q-select v-model="formulaStore.formula.scope" label="Scope" :options="scopes"
                    :readonly=!editMode stack-label dense options-dense/>
        </div>
      </div>
      <TagListEditable :tags="formulaStore.formula.tags"
                       @addTag="onAddTag" @removeTag="onRemoveTag" />
    </template>
    <template v-slot:properties>
      <PropertyTable :properties="formulaStore.formula.properties"
                     @addProperty="onAddProperty" @removeProperty="onRemoveProperty"/>
    </template>
  </phaedra-details-section>
</template>

<script setup>

import PhaedraDetailsSection from "@/components/widgets/PhaedraDetailsSection.vue";
import {ref} from "vue";
import {useRouter} from "vue-router";
import UserChip from "@/components/widgets/UserChip.vue";
import DateChip from "@/components/widgets/DateChip.vue";
import EditableField from "@/components/widgets/EditableField.vue";
import TagListEditable from "@/components/tag/TagListEditable.vue";
import PropertyTable from "@/components/property/PropertyTable.vue";
import {useLoadingHandler} from "@/composable/loadingHandler";
import {useFormulasStore} from "@/stores/formulas";
import {useCalcStore} from "@/stores/calculations";

const router = useRouter();

const emit = defineEmits(['edit'])
const editMode = ref(false);
const toggleEditMode = () => {
  editMode.value = !editMode.value;
  emit('edit', editMode.value);
};

const formulaStore = useFormulasStore()

const calculationStore = useCalcStore()
const categories = calculationStore.categories
const languages = calculationStore.languages
const scopes = calculationStore.scopes

const saveChanges = async () => {
  await formulaStore.updateFormula(formulaStore.formula)
  await router.push("/calc/formula/" + formulaStore.formula.id);
}

const loadingHandler = useLoadingHandler()
const cancelEditMode = async () => {
  await loadingHandler.handleLoadingDuring(formulaStore.reloadFormula())
  toggleEditMode()
};


const onAddTag = async (newTag) => {
  // TODO: implement add tags for formulas
}

const onRemoveTag = async (tag) => {
  // TODO: implement add tags for formulas
}

const onAddProperty = async (newProperty) => {
  // TODO: implement add properties for formulas
}

const onRemoveProperty = async (property) => {
  // TODO: implement add properties for formulas
}

</script>

<style scoped>

</style>
