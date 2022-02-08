<template>
  <q-dialog v-model="props.show" persistent>
    <q-card style="min-width: 40vw">
      <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
        <q-avatar icon="playlist_add" color="primary" text-color="white"/>
        Link Plate Template
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div>
            <span>By linking plates with the system they were defined in, substance and control information can be retrieved and applied to the plate(s).</span><br><br>
          </div>
        </div>
        <div v-if="!quickView">
          <div class="row text-h6 items-center q-px-sm oa-section-title full-width">
            <q-icon name="playlist_add" class="on-left"/>
            Link with
          </div>
          <q-select class="full-width" v-model="source" label="Source:" :options="sourceOptions"></q-select>
          <br>
        </div>
        <div v-if="!quickView">
          <oa-section-header v-if="plateId" :title="'Plate'" :icon="'view_module'"/>
          <oa-section-header v-if="!plateId" :title="'Plates'" :icon="'view_module'"/>
          <q-table
              table-header-class="text-white bg-primary"
              :rows="plateId?plates.filter(p => p.id === plateId):plates"
              :columns="plateColumns"
              :pagination="{ rowsPerPage: 10 }"
              class="full-width"
              square
              flat
              dense
              selection="multiple"
              v-model:selected="selectedPlates.list"
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
                  <q-icon v-else-if="col.name === 'status' && props.row.linkStatus==='LINKED'" name="check_circle"
                          color="positive"/>
                  <q-icon v-else-if="col.name === 'status' && props.row.linkStatus==='NOT_LINKED'" name="cancel"
                          color="negative"/>
                  <span v-else>{{ col.value }}</span>
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <span v-if="!checkPlateDimensions()" class="text-accent">The selected plates have different dimensions.</span><br>
        </div>
        <div>
          <div class="row justify-between">
            <oa-section-header :title="'Templates'" :icon="'border_outer'"/>
            <div class="action-button">
              <q-btn v-if="!selectedTemplate.length>0&&!quickView" size="sm" color="primary" icon="remove_red_eye"
                     label="Show Quick view"
                     disable/>
              <q-btn v-if="selectedTemplate.length>0&&!quickView" size="sm" color="primary" icon="remove_red_eye"
                     label="Show Quick view"
                     @click="quickView=!quickView"/>
              <q-btn v-if="quickView" size="sm" color="accent" icon="remove_red_eye"
                     label="Hide Quick view"
                     @click="quickView=!quickView"/>
            </div>
          </div>
          <q-table
              table-header-class="text-white bg-primary"
              :rows="allTemplates"
              :columns="templateColumns"
              :pagination="{ rowsPerPage: 10 }"
              class="full-width"
              square
              flat
              dense
              selection="single"
              v-model:selected="selectedTemplate"
              :filter="selectedPlates.list"
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
        <TemplateQuickView v-if="quickView&&selectedTemplate.length>0"
                           :plateTemplate="selectedTemplate[0]"></TemplateQuickView>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup @click="quickView=false;$emit('update:show',false)"/>
        <q-btn flat label="Link" disable v-if="!isTemplateSelected()||!arePlatesSelected()||!checkAllDimensions()"
               v-close-popup/>
        <q-btn flat label="Link" v-if="isTemplateSelected()&&arePlatesSelected()&&checkAllDimensions()"
               @click="linkPlate" v-close-popup/>
      </q-card-actions>
      {{plateId}}
    </q-card>
  </q-dialog>
</template>
<script>

import {useStore} from "vuex";
import {computed, reactive, ref, watch} from "vue";
import {useRoute} from "vue-router";
import TemplateQuickView from "../../components/layout/TemplateQuickView";
import OaSectionHeader from "../../components/widgets/OaSectionHeader";

/**
 * Dialog to link plate(s) to template
 * If plateId is provided, only 1 plate is selectable in list.
 * If plateId is null, all plates of the experiment are shown in list.
 */
export default {
  name: 'LinkPlate',
  components: {TemplateQuickView, OaSectionHeader},
  setup(props) {
    const store = useStore()
    const route = useRoute()

    const experimentId = parseInt(route.params.id);
    const plates = computed(() => store.getters['plates/getByExperimentId'](experimentId))
    const allTemplates = store.getters['templates/getAll']()

    let selectedPlates = reactive({list : []})
    //Watch for props change to change selectedPlates in [plateId]
    watch(props, (p) => {
      if(p.plateId)
        selectedPlates.list = plates.value.filter(plate=>plate.id===p.plateId)
    })
    const selectedTemplate = ref([])
    const source = ref('Layout Template')
    const sourceOptions = ['Layout Template']
    return {
      props,
      plates,
      selectedPlates,
      allTemplates,
      selectedTemplate,
      source,
      sourceOptions,
      plateColumns: [
        {name: 'sequence', align: 'left', label: 'Sequence', field: 'sequence', sortable: true},
        {name: 'barcode', align: 'left', label: 'Barcode', field: 'barcode', sortable: true},
        {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
        {name: 'layout', align: 'center', label: 'Layout', field: 'layout', sortable: true},
        {name: 'status', align: 'center', label: 'Link status', field: 'linkStatus', sortable: true}
      ],
      templateColumns: [
        {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
        {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
        {name: 'layout', align: 'center', label: 'Layout', field: 'layout', sortable: true}
      ],
      quickView: ref(false)
    }
  },
  props: ['show','plateId'],
  emits: ['update:show'],
  methods: {
    linkPlate() { //TODO change to linkplate api endpoint
      const copy = JSON.parse(JSON.stringify(this.selectedPlates.list));
      copy.forEach(plate => {
        plate.linkStatus = 'LINKED'
        plate.linkSource = 'layout-template'
        plate.linkTemplateId = this.selectedTemplate[0].id
        plate.linkedOn = new Date()
        // this.$store.dispatch('plates/editPlate', plate)
        this.$store.dispatch('plates/applyPlateLayout', plate)
      })
      this.$emit('update:show', false)
    },
    checkPlateDimensions() {
      //Count occurences of rows and columns in selected plates
      const countRows = this.selectedPlates.list.map(p => p.rows).filter(this.onlyUnique).length
      const countColumns = this.selectedPlates.list.map(p => p.rows).filter(this.onlyUnique).length
      if (countRows > 1 || countColumns > 1) return false
      return true
    },
    openQuickView() {

    },
    onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    },
    filterMethod(cols, terms) {
      if (terms.length === 0) return cols
      if (!this.checkPlateDimensions()) return []
      const correctRows = cols.filter(row => row.rows === terms[0].rows)
      return correctRows.filter(row => row.columns === terms[0].columns)
    },
    checkAllDimensions() {
      if (!this.isTemplateSelected()) return true
      const countRows = this.selectedPlates.list.filter(row => row.rows === this.selectedTemplate[0].rows).length
      const countColumns = this.selectedPlates.list.filter(row => row.columns === this.selectedTemplate[0].columns).length
      if (countRows === this.selectedPlates.list.length && countColumns === this.selectedPlates.list.length) return true
      return false
    },
    isTemplateSelected() {
      return this.selectedTemplate.length !== 0
    },
    arePlatesSelected() {
      return this.selectedPlates.list.length !== 0
    }
  }
}
</script>
