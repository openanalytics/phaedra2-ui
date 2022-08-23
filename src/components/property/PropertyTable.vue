<template>
    <div class="q-px-md">
      <q-table :rows="propertyRows"
               :columns="propertyColumns"
               class="oa-properties-table"
               table-header-class="bg-secondary"
               row-key="propertyName"
               :pagination="{ rowsPerPage: 0 }"
               hide-pagination
               dense flat bordered
      >
        <template v-slot:body-cell="props">
            <q-td :props="props" @mouseover="toggleDeleteBtn(true, props.rowIndex)" @mouseleave="toggleDeleteBtn(false, props.rowIndex)">
              {{props.row[props.col.name]}}
            </q-td>
        </template>
        <template v-slot:header-cell-actions="props">
            <q-th :props="props">
                <q-btn style="border-radius: 0px;" dense icon="add" color="primary" size="xs" @click="showNewPropertyDialog = true">
                  <q-tooltip :delay="500" class="text-black bg-secondary">Add a new Property</q-tooltip>
                </q-btn>
            </q-th>
        </template>
        <template v-slot:body-cell-actions="props">
            <q-td :props="props" @mouseover="toggleDeleteBtn(true, props.rowIndex)" @mouseleave="toggleDeleteBtn(false, props.rowIndex)">
                <q-btn style="border-radius: 0px;" dense icon="delete" size="xs" @click="doRemoveProperty(props.row)" v-show="deleteBtnShown[props.rowIndex]">
                  <q-tooltip :delay="500" class="text-black bg-secondary">Delete this Property</q-tooltip>
                </q-btn>
            </q-td>
        </template>
        <template v-slot:no-data>
          <div class="full-width row text-info">
            <span>No properties</span>
          </div>
        </template>
      </q-table>
    </div>

  <q-dialog v-model="showNewPropertyDialog">
    <q-card style="min-width: 30vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-icon name="add" class="q-pr-sm"/>
        Add Property
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col full-width">
            <q-input label="Name" dense v-model="newProperty.name" @keyup.enter="showNewPropertyDialog = false" />
            <q-input label="Value" dense v-model="newProperty.value" @keyup.enter="showNewPropertyDialog = false" />
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
import {ref, computed} from "vue";
import {useStore} from 'vuex'

export default {
  name: "PropertyTable",
  props: {
    objectInfo: Object,
    objectClass: String
  },
  setup(props) {
    const exported = {};
    const store = useStore();

    exported.propertyColumns = [
      {name: 'propertyName', align: 'left', label: 'Property Name', field: 'propertyName', sortable: true},
      {name: 'propertyValue', align: 'left', label: 'Value', field: 'propertyValue', sortable: true},
      {name: 'actions'}
    ]

    exported.propertyRows = computed(() => store.getters['metadata/getProperties']({ objectId: props.objectInfo.id, objectClass: props.objectClass }));
    // if (props.objectInfo.id) store.dispatch('metadata/loadProperties', { objectId: props.objectInfo.id, objectClass: props.objectClass });
    // else watch(() => props.objectInfo, () => store.dispatch('metadata/loadProperties', { objectId: props.objectInfo.id, objectClass: props.objectClass }));

    exported.showNewPropertyDialog = ref(false);
    exported.newProperty = ref({name: '', value: ''});

    exported.doAddProperty = function () {
      store.dispatch('metadata/addProperty', {
        objectId: props.objectInfo.id,
        objectClass: props.objectClass,
        propertyName: exported.newProperty.value.name,
        propertyValue: exported.newProperty.value.value
      });
    }

    exported.doRemoveProperty = function (row) {
      store.dispatch('metadata/removeProperty', {
        objectId: props.objectInfo.id,
        objectClass: props.objectClass,
        propertyName: row.propertyName
      });
    }

    exported.deleteBtnShown = ref([]);
    for (const i in props.objectInfo.properties) exported.deleteBtnShown[i] = false;

    exported.toggleDeleteBtn = (show, rowIndex) => {
      exported.deleteBtnShown.value[rowIndex] = show;
    }

    return exported;
  }
}
</script>
