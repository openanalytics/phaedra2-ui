<template>
  <phaedra-details-section v-if="plate && plate.barcode" :collapsible="collapsible">
    <template v-slot:title>
      <div>
        <span> {{ plate.barcode }} </span>
        <span class="q-mx-sm" style="font-size: 0.7em">
            ({{ plate.id }})
            <q-tooltip>ID</q-tooltip>
          </span>
      </div>
    </template>
    <template v-slot:actions>
        <span v-if="!readOnly">
          <span>
            <q-btn icon="edit" size="xs" color="positive" round dense
                   @click="showEditDialog = true">
              <q-tooltip>Edit Experiment</q-tooltip>
            </q-btn>
          </span>
          <span class="q-ml-sm">
            <q-btn size="xs" icon="calculate" color="warning" round dense
                   @click="showCalculateDialog = true" :disable="disableRecalculateButton">
              <q-tooltip>
                Recalculate
                <span v-if="disableRecalculateButton">
                  ({{ disabledRecalculateButtonMessage }})
                </span>
              </q-tooltip>
            </q-btn>
          </span>
          <span class="q-ml-sm">
            <q-btn round dense icon="delete" size="xs" color="negative"
                   @click="showDeleteDialog = true">
              <q-tooltip>Delete Plate</q-tooltip>
            </q-btn>
          </span>
        </span>
    </template>
    <template v-slot:readonly>
      <div class="col-6">
        <div>
          <DimensionsChip :rows="plate.rows" :columns="plate.columns"
                          onHoverMessage="Dimensions" calculate/>
        </div>
        <div>
          <UserChip :id="plate.createdBy" onHoverMessage="Created By" label="Created By"/>
        </div>
        <div>
          <DateChip :dateTime="plate.createdOn" onHoverMessage="Created On" label="Created On"/>
        </div>
      </div>
      <div class="col-6">
        <div>
          <UserChip :id="plate.updatedBy" onHoverMessage="Updated By" label="Updated By"/>
        </div>
        <div>
          <DateChip :dateTime="plate.updatedOn" onHoverMessage="Updated On" label="Updated On"/>
        </div>
      </div>
    </template>
    <template v-slot:editable>
      <EditableField read-only :object="plate" fieldName="description" label="Description"/>
      <TagListEditable :tags="plate.tags" :read-only="readOnly"
                       @addTag="onAddTag" @removeTag="onRemoveTag"/>
    </template>
    <template v-slot:properties>
      <PropertyTable :properties="plate.properties" :read-only="readOnly"
                     @addProperty="onAddProperty" @removeProperty="onRemoveProperty"/>
    </template>
  </phaedra-details-section>

  <EditResourceDialog v-model:show="showEditDialog" :project="plate" @valueChanged="onEdited"/>
  <delete-dialog v-model:show="showDeleteDialog" :id="plate.id" :name="plate.barcode"
                 :objectClass="'plate'" @onDeleted="onDeleted"/>

  <CalculatePlateDialog v-model:show="showCalculateDialog" :plates="[plate]"
                        :protocol-id="plateStore.activeResultSet?.protocolId"/>
</template>

<script setup>
import {usePlateStore} from "@/stores/plate";
import {computed, ref} from "vue";
import UserChip from "@/components/widgets/UserChip";
import EditableField from "@/components/widgets/EditableField";
import DateChip from "@/components/widgets/DateChip.vue";
import PropertyTable from "@/components/property/PropertyTable";
import DeleteDialog from "@/components/widgets/DeleteDialog.vue";
import {useExperimentStore} from "@/stores/experiment";
import TagListEditable from "@/components/tag/TagListEditable.vue";
import EditResourceDialog from "@/components/widgets/EditResourceDialog";
import DimensionsChip from "@/components/plate/DimensionsChip.vue";
import CalculatePlateDialog from "@/components/plate/CalculatePlateDialog.vue";
import {useLoadingHandler} from "@/composable/loadingHandler";
import PhaedraDetailsSection from "@/components/widgets/PhaedraDetailsSection.vue";

const props = defineProps({
  plate: Object,
  activeMeasurement: Object,
  collapsible: {
    type: Boolean,
    default: true,
  }
});
const emits = defineEmits(["updated", "deleted"]);

const experimentStore = useExperimentStore();
const plateStore = usePlateStore();

const showDeleteDialog = ref(false);
const showCalculateDialog = ref(false);

const readOnly = ref(
    props.plate?.approvalStatus === "APPROVED" || experimentStore.isClosed
);
const showEditDialog = ref(false);

const disableRecalculateButton = computed(
    () => props.plate.linkStatus !== "LINKED"
);
const disabledRecalculateButtonMessage =
    "to enable set plate layout and link active measurements ";

const loadingHandler = useLoadingHandler();
const onEdited = async (newVal) => {
  await loadingHandler.handleLoadingDuring(
      plateStore.editPlate(props.plate.id, newVal).then(() => {
        emits("updated");
      })
  );
};

const onDeleted = async () => {
  const experimentId = props.plate?.experimentId;
  const promise = plateStore.deletePlate(props.plate?.id);
  emits("deleted", promise, experimentId);
};

const onAddTag = async (newTag) => {
  await loadingHandler.handleLoadingDuring(
      plateStore.handleAddTag(props.plate?.id, newTag).then(() => {
        emits("updated");
      })
  );
};

const onRemoveTag = async (tag) => {
  await loadingHandler.handleLoadingDuring(
      plateStore.handleDeleteTag(props.plate?.id, tag).then(() => {
        emits("updated");
      })
  );
};

const onAddProperty = async (newProperty) => {
  await loadingHandler.handleLoadingDuring(
      plateStore.handleAddProperty(props.plate?.id, newProperty).then(() => {
        emits("updated");
      })
  );
};

const onRemoveProperty = async (property) => {
  await loadingHandler.handleLoadingDuring(
      plateStore.handleDeleteProperty(props.plate?.id, property).then(() => {
        emits("updated");
      })
  );
};
</script>

<style scoped></style>
