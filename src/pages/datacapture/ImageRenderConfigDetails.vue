<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'workbench' }" />
    <q-breadcrumbs-el label="Image Render Configurations" icon="list" :to="'/datacapture/render-configs'"/>
    <q-breadcrumbs-el :label="measurementStore.renderConfig?.name" icon="palette" />
  </q-breadcrumbs>

  <q-page class="oa-root-div" v-if="measurementStore.renderConfig && measurementStore.renderConfig.config">
    <div class="q-pa-sm">
      <phaedra-details-section :object-id="measurementStore.renderConfig?.id"
                               :object-title="measurementStore.renderConfig?.name"
                               title-icon="palette">
        <template v-slot:readonly>
          <div class="col">
            <div>
              <user-chip :id="measurementStore.renderConfig.createdBy" label="Created By"
                         on-hover-message="Created By"/>
            </div>
            <div>
              <date-chip :date-time="measurementStore.renderConfig.createdOn" label="Created On"
                         on-hover-message="Created On"/>
            </div>
          </div>
          <div class="col">
            <div>
              <user-chip :id="measurementStore.renderConfig.updatedBy" label="Updated By"
                         on-hover-message="Updated By"/>
            </div>
            <div>
              <date-chip :date-time="measurementStore.renderConfig.updatedOn" label="Updated On"
                         on-hover-message="Updated On"/>
            </div>
          </div>
        </template>
        <template v-slot:editable>
          <div class="row">
            <div class="col">
              <editable-field :object="measurementStore.renderConfig" fieldName="name" label="Name"
                             @value-changed="onNameChanged"/>
              <editable-field :object="measurementStore.renderConfig.config" fieldName="scale"
                             label="Scale" :number="true"
                             @value-changed="(newValue) => onConfigValueChanged('scale', newValue)"/>
            </div>
            <div class="col">
              <editable-field :object="measurementStore.renderConfig.config" fieldName="gamma"
                              label="Gamma" :number="true"
                              @value-changed="(newValue) => onConfigValueChanged('gamma', newValue)"/>
            </div>
          </div>
          <TagListEditable :tags="measurementStore.renderConfig.tags"
                           @addTag="onAddTag" @removeTag="onRemoveTag" />
        </template>
        <template v-slot:properties>
          <PropertyTable :properties="measurementStore.renderConfig.properties"
                         @addProperty="onAddProperty"
                         @removeProperty="onRemoveProperty"/>
        </template>
      </phaedra-details-section>
      <oa-section title="Channels" icon="collections" class="q-pt-sm">
        <oa-table :columns="columns" row-key="id"
                  :rows="measurementStore.renderConfig.config.channelConfigs">
          <template v-slot:top-right>
            <q-btn size="sm" color="primary" icon="add" class="q-mt-sm"
                   @click="doAddChannel" round dense/>
          </template>
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              {{ props.row.name }}
              <q-popup-edit v-model="props.row.name" v-slot="scope" buttons
                @save="(value) => doUpdateName(props.rowIndex, value)">
                <q-input v-model="scope.value" dense autofocus />
              </q-popup-edit>
            </q-td>
          </template>
          <template v-slot:body-cell-rgb="props">
            <q-td :props="props">
              <ColorButton
                v-model:rgb="props.row.rgb"
                @update:rgb="(value) => doUpdateRGB(props.rowIndex, value)"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-contrast="props">
            <q-td :props="props">
              <q-range dense thumb-size="12px" label
                :model-value="{ min: props.row.contrastMin * 100, max: props.row.contrastMax * 100 }"
                :min="0" :max="100" @change="(value) => doUpdateContrast(props.rowIndex, value)"/>
            </q-td>
          </template>
          <template v-slot:body-cell-alpha="props">
            <q-td :props="props">
              {{ props.row.alpha * 100 }}%
              <q-popup-edit v-model="props.row.alpha" v-slot="scope"
                            buttons @save="(value) => doUpdateAlpha(props.rowIndex, value)">
                <q-input v-model="scope.value" type="number" dense autofocus />
              </q-popup-edit>
            </q-td>
          </template>
          <template v-slot:body-cell-menu="props">
            <q-td :props="props">
              <q-btn size="sm" icon="delete" color="negative"
                     @click="doDeleteChannel(props.rowIndex)" round dense/>
            </q-td>
          </template>
        </oa-table>
      </oa-section>
    </div>

    <DeleteChannelDialog v-model="showDeleteChannelDialog"
                         :configId="configId" :channelNr="channelNrToDelete"/>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import EditableField from "@/components/widgets/EditableField";
import OaSection from "@/components/widgets/OaSection";
import ColorButton from "@/components/image/ColorButton";
import DeleteChannelDialog from "@/components/image/DeleteChannelDialog";
import UserChip from "@/components/widgets/UserChip";

import { useMeasurementStore } from "@/stores/measurement";
import OaTable from "@/components/table/OaTable.vue";
import { useLoadingHandler } from "@/composable/loadingHandler";
import PhaedraDetailsSection from "@/components/widgets/PhaedraDetailsSection.vue";
import DateChip from "@/components/widgets/DateChip.vue";
import TagListEditable from "@/components/tag/TagListEditable.vue";
import PropertyTable from "@/components/property/PropertyTable.vue";

const route = useRoute();
const configId = parseInt(route.params.id);

const columns = ref([
  { name: "sequence", align: "left", label: "Sequence", field: "nr", sortable: true },
  { name: "name", align: "left", label: "Name", field: "name", sortable: true },
  { name: "rgb", align: "left", label: "Color", field: "rgb", sortable: true },
  { name: "contrast", label: "Contrast Range", align: "left", headerStyle: "width: 200px"},
  { name: "alpha", align: "left", label: "Alpha", field: "alpha", sortable: true },
  { name: "menu", align: "left", field: "menu", sortable: false }
]);

const measurementStore = useMeasurementStore();

const fetchRenderConfig = async () => {
  await measurementStore.loadRenderConfig(configId);
};

const loadingHandler = useLoadingHandler();
loadingHandler.handleLoadingDuring(fetchRenderConfig())

const onNameChanged = async (newValue) => {
  measurementStore.renderConfig.name = newValue
  await loadingHandler.handleLoadingDuring(measurementStore.updateRenderConfig())
}

const onConfigValueChanged = async (fieldName, newValue) => {
  measurementStore.renderConfig.config[fieldName] = newValue
  await loadingHandler.handleLoadingDuring(measurementStore.updateRenderConfig());
}

const doAddChannel = async () => {
  await measurementStore.addRenderConfigChannel()
  await loadingHandler.handleLoadingDuring(
    measurementStore.updateRenderConfig({ id: configId, config: measurementStore.renderConfig.config })
  );
  await measurementStore.loadRenderConfig(configId)
};

const showDeleteChannelDialog = ref(false);
const channelNrToDelete = ref(null);
const doDeleteChannel = (index) => {
  channelNrToDelete.value = index + 1;
  showDeleteChannelDialog.value = true;
};

const doUpdateName = (rowIndex, newName) => {
  doUpdateChannelField(rowIndex, "name", newName);
};

const doUpdateRGB = (row, rgb) => {
  doUpdateChannelField(row, "rgb", rgb);
};

const doUpdateAlpha = (row, newAlpha) => {
  doUpdateChannelField(row, "alpha", newAlpha);
};

const doUpdateContrast = async (rowIndex, newContrast) => {
  measurementStore.renderConfig.config.channelConfigs[rowIndex].contrastMin = newContrast.min / 100;
  measurementStore.renderConfig.config.channelConfigs[rowIndex].contrastMax = newContrast.max / 100;
  await loadingHandler.handleLoadingDuring(
    measurementStore.updateRenderConfig()
  );
};

const doUpdateChannelField = async (rowIndex, fieldName, newValue) => {
  measurementStore.renderConfig.config.channelConfigs[rowIndex][fieldName] = newValue;
  await loadingHandler.handleLoadingDuring(
    measurementStore.updateRenderConfig()
  );
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
