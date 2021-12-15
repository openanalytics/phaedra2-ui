<template>
  <div>
    <div class="row q-pb-sm text-weight-bold">Properties:</div>
    <div class="row-cols-auto q-pb-sm full-width">
      <q-table :rows="objectInfo.properties"
               :columns="propertyColumns"
               class="oa-properties-table"
               style="max-height: 250px"
               table-header-class="bg-secondary"
               row-key="propertyName"
               selection="multiple"
               v-model:selected="selectedProperties"
               no-data-label="No properties"
               virtual-scroll
               dense
      />
    </div>
    <div class="row justify-end">
      <q-btn label="Add" size="sm" icon="add" class="oa-button-tag" @click="showNewPropertyDialog = true"/>
      <q-btn label="Delete" size="sm" icon="delete" class="oa-button-delete q-ml-sm" @click="doRemoveProperty"/>
    </div>
  </div>

  <q-dialog v-model="showNewPropertyDialog">
    <q-card style="min-width: 30vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        Add new project property
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col full-width">
            <span>Property name:</span><br/>
            <q-input dense v-model="newProperty.name" @keyup.enter="showNewPropertyDialog = false" />
            <span>Property value:</span><br/>
            <q-input dense v-model="newProperty.value" @keyup.enter="showNewPropertyDialog = false" />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn label="Cancel" v-close-popup flat/>
        <q-btn label="Save" v-close-popup class="oa-button" @click="doAddProperty" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {ref} from "vue";
import {useStore} from 'vuex'

const propertyColumns = [
  {name: 'propertyName', align: 'left', label: 'Name', field: 'propertyName', sortable: true},
  {name: 'propertyValue', align: 'left', label: 'Value', field: 'propertyValue', sortable: true}
]

const selectedProperties = ref([]);

export default {
  name: "PropertyTable",
  props: {
    objectInfo: Object,
    objectClass: String
  },
  methods: {
  },

  setup(props) {
    const store = useStore();

    const showNewPropertyDialog = ref(false);
    const newProperty = ref({name: '', value: ''});
    const doAddProperty = function () {
      const propertyInfo = {
        objectId: props.objectInfo.id,
        objectClass: props.objectClass,
        propertyName: newProperty.value.name,
        propertyValue: newProperty.value.value
      }

      if (props.objectClass === 'PROJECT')
        store.dispatch('projects/addProperty', propertyInfo);
      else if (props.objectClass === 'EXPERIMENT')
        store.dispatch('experiments/addProperty', propertyInfo);
      else if (props.objectClass === 'PLATE')
        store.dispatch('plates/addProperty', propertyInfo);
    }

    const doRemoveProperty = function () {
      if (selectedProperties.value.length > 0) {
        let removedIndex = [];
        selectedProperties.value.forEach(function (item, index) {
          const propertyInfo = {
            objectId: props.objectInfo.id,
            objectClass: props.objectClass,
            propertyName: item.propertyName
          }

          if (props.objectClass === 'PROJECT')
            store.dispatch('projects/removeProperty', propertyInfo);
          else if (props.objectClass === 'EXPERIMENT')
            store.dispatch('experiments/removeProperty', propertyInfo);
          else if (props.objectClass === 'PLATE')
            store.dispatch('plates/removeProperty', propertyInfo);

          removedIndex.push(index);
        });

        if (removedIndex.length > 0) {
          for (let i = 0; i < removedIndex.length; i++) {
            selectedProperties.value.pop();
          }
        }
      }
    }

    return {
      propertyColumns,
      selectedProperties,
      showNewPropertyDialog,
      newProperty,
      doAddProperty,
      doRemoveProperty,
    }
  }
}
</script>

<style scoped>

</style>
