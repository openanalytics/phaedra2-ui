<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 60vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-avatar icon="playlist_add" color="primary" text-color="white"/>
        Link Plate
      </q-card-section>

      <q-card-section>
        <div class="row q-pb-md">
          <span>By linking plates with the system they were defined in, substance and control information can be retrieved and applied to the plate(s).</span>
        </div>

        <div v-if="!quickView">
          <oa-section-header :title="'Plates'" :icon="'view_module'"/>
          <q-table
              table-header-class="text-white bg-primary"
              square flat dense class="full-width"
              :rows="plates"
              :columns="plateColumns"
              :pagination="{ rowsPerPage: 10 }"
              selection="multiple"
              v-model:selected="selectedPlates"
          >
            <template v-slot:header="props">
              <q-tr :props="props" class="text-white bg-primary">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr class="cursor-pointer" :props="props" @click="props.selected = !props.selected">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  <span v-if="(col.name === 'layout')">{{ props.row.rows }} x {{ props.row.columns }}</span>
                  <q-icon v-else-if="col.name === 'status' && props.row.linkStatus==='LINKED'" name="check_circle" color="positive"/>
                  <q-icon v-else-if="col.name === 'status' && props.row.linkStatus==='NOT_LINKED'" name="cancel" color="negative"/>
                  <span v-else>{{ col.value }}</span>
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <span v-if="!checkPlateDimensions()" class="text-accent">The selected plates have different dimensions.</span><br>
        </div>

        <div v-if="!quickView">
          <div class="row text-h6 items-center q-px-sm oa-section-title full-width">
            <q-icon name="playlist_add" class="on-left"/>
            Link with
          </div>
          <q-select class="full-width" v-model="source" label="Source:" :options="sourceOptions"></q-select>
          <br>
        </div>

        <div>
          <div class="row justify-between">
            <oa-section-header :title="'Templates'" :icon="'border_outer'"/>
            <div class="action-button">
              <q-btn v-if="!quickView" size="sm" color="primary" icon="remove_red_eye" label="Show Quick view"
                     :disable="!isTemplateSelected()" @click="quickView=!quickView"/>
              <q-btn v-if="quickView" size="sm" color="accent" icon="remove_red_eye" label="Hide Quick view"
                     @click="quickView=!quickView"/>
            </div>
          </div>
          <q-table
              table-header-class="text-white bg-primary"
              square flat dense class="full-width"
              :rows="allTemplates"
              :columns="templateColumns"
              :pagination="{ rowsPerPage: 10 }"
              selection="single"
              v-model:selected="selectedTemplates"
              :filter="selectedPlates"
              :filter-method="filterMethod"
          >
            <template v-slot:header="props">
              <q-tr :props="props" class="text-white bg-primary">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr class="cursor-pointer" :props="props" @click="props.selected = !props.selected">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  <span v-if="!(col.name === 'select' || col.name === 'layout')">{{ col.value }}</span>
                  <span v-if="(col.name === 'layout')">{{ props.row.rows }} x {{ props.row.columns }}</span>
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <span v-if="!checkAllDimensions()" class="text-accent">The selected template has different dimensions compared to the selected plates.</span><br>
        </div>

        <TemplateQuickView v-if="quickView && isTemplateSelected()" :plateTemplate="selectedTemplates[0]"></TemplateQuickView>

      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup/>
        <q-btn label="Link" :disable="!isTemplateSelected() || !arePlatesSelected() || !checkAllDimensions()" @click="linkPlate" color="primary" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
  /**
   * Dialog to link plate(s) to template
   * If plateId is provided, only 1 plate is selectable in list.
   * If plateId is null, all plates of the experiment are shown in list.
   */

  import {computed, ref, watch} from "vue";
  import {useStore} from "vuex";
  import {useRoute} from "vue-router";

  import TemplateQuickView from "@/components/layout/TemplateQuickView";
  import OaSectionHeader from "@/components/widgets/OaSectionHeader";

  const props = defineProps(['show','plateId']);
  const emit = defineEmits(['update:show']);

  const store = useStore();
  const route = useRoute();

  const experimentId = parseInt(route.params.id);
  const plates = computed(() => store.getters['plates/getByExperimentId'](experimentId).filter(p => props.plateId ? p.id === props.plateId : true));
  const allTemplates = computed(() => store.getters['templates/getAll']());

  const showDialog = computed({
    get: () => props.show,
    set: (v) => emit('update:show', v)
  });
  watch(() => props.show, (newValue) => {
    if (newValue === true && allTemplates.value.length == 0) store.dispatch('templates/loadAll');
  });

  const selectedPlates = plates.value.filter(p => p.id === props.plateId);
  const selectedTemplates = ref([]);

  const source = ref('Layout Template')
  const sourceOptions = ['Layout Template']
  const quickView = ref(false);

  const plateColumns = [
    {name: 'sequence', align: 'left', label: 'Sequence', field: 'sequence', sortable: true},
    {name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true},
    {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
    {name: 'layout', align: 'center', label: 'Layout', field: 'layout', sortable: true},
    {name: 'status', align: 'center', label: 'Link status', field: 'linkStatus', sortable: true}
  ];

  const templateColumns = [
    {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
    {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
    {name: 'layout', align: 'center', label: 'Layout', field: 'layout', sortable: true}
  ];

  const linkPlate = () => {
    //TODO change to linkplate api endpoint
    const copy = JSON.parse(JSON.stringify(selectedPlates));
    copy.forEach(plate => {
      plate.linkStatus = 'LINKED'
      plate.linkSource = 'layout-template'
      plate.linkTemplateId = selectedTemplates.value[0].id
      plate.linkedOn = new Date()
      // store.dispatch('plates/editPlate', plate)
      store.dispatch('plates/applyPlateLayout', plate)
    });
  };
  const checkPlateDimensions = () => {
    // Count occurences of rows and columns in selected plates
    const countRows = selectedPlates.map(p => p.rows).filter(onlyUnique).length;
    const countColumns = selectedPlates.map(p => p.rows).filter(onlyUnique).length;
    return (countRows <= 1 && countColumns <= 1);
  };
  const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
  };
  const filterMethod = (tableRows, terms) => {
    if (terms.length === 0) return tableRows;
    if (!checkPlateDimensions()) return [];
    const correctRows = tableRows.filter(row => row.rows === terms[0].rows);
    return correctRows.filter(row => row.columns === terms[0].columns);
  };
  const checkAllDimensions = () => {
    if (!isTemplateSelected()) return true;
    const countRows = selectedPlates.filter(row => row.rows === selectedTemplates.value[0].rows).length
    const countColumns = selectedPlates.filter(row => row.columns === selectedTemplates.value[0].columns).length
    return (countRows === selectedPlates.length && countColumns === selectedPlates.length);
  };
  const isTemplateSelected = () => {
    return (selectedTemplates.value && selectedTemplates.value.length > 0);
  };
  const arePlatesSelected = () => {
    return selectedPlates.length !== 0;
  };
</script>
