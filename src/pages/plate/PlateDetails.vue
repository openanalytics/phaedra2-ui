<template>
  <div class="q-pa-sm">
    <q-card
      v-if="plate && plate.barcode"
      flat
      bordered
      class="row justify-between"
      style="width: 100%"
    >
      <q-card-section horizontal class="col-7">
        <q-card-section class="q-pt-xs" style="width: 100%">
          <div
            style="width: 100%"
            class="row align-center text-h5 q-mt-sm q-mb-xs"
          >
            <div>
              <span>
                {{ plate.barcode }}
              </span>

              <span class="q-mx-sm" style="font-size: 0.7em">
                ({{ plate.id }})
                <q-tooltip>ID</q-tooltip>
              </span>
            </div>
            <span v-if="!readOnly">
              <span>
                <q-btn
                  icon="edit"
                  size="xs"
                  color="positive"
                  round
                  dense
                  @click="showEditDialog = true"
                >
                  <q-tooltip>Edit Experiment</q-tooltip>
                </q-btn>
              </span>
              <span class="q-ml-sm">
                <q-btn
                  size="xs"
                  icon="calculate"
                  color="warning"
                  round
                  dense
                  @click="showCalculateDialog = true"
                >
                  <q-tooltip>Recalculate</q-tooltip>
                </q-btn>
              </span>
              <span class="q-ml-sm">
                <q-btn
                  round
                  dense
                  icon="delete"
                  size="xs"
                  color="negative"
                  @click="showDeleteDialog = true"
                  ><q-tooltip>Delete Plate</q-tooltip></q-btn
                >
              </span>
            </span>
          </div>

          <div class="col">
            <div class="row">
              <div class="col-6">
                <div class="text-caption">
                  <DimensionsChip
                    :rows="plate.rows"
                    :columns="plate.columns"
                    onHoverMessage="Dimensions"
                    calculate
                  />
                </div>
                <div class="text-caption">
                  <UserChip
                    :id="plate.createdBy"
                    onHoverMessage="Created By"
                    label="Created By"
                  />
                </div>
                <div class="text-caption">
                  <DateChip
                    :dateTime="plate.createdOn"
                    onHoverMessage="Created On"
                    label="Created On"
                  />
                </div>
              </div>
              <div class="col-6">
                <div class="text-caption">
                  <UserChip
                    :id="plate.updatedBy"
                    onHoverMessage="Updated By"
                    label="Updated By"
                  />
                </div>
                <div class="text-caption">
                  <DateChip
                    :dateTime="plate.updatedOn"
                    onHoverMessage="Updated On"
                    label="Updated On"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="text-caption text-grey q-mt-sm">
            <EditableField read-only :object="plate" fieldName="description" />
            <TagListEditable
              :tags="plate.tags"
              :read-only="readOnly"
              @addTag="onAddTag"
              @removeTag="onRemoveTag"
            />
          </div>
        </q-card-section>
      </q-card-section>
      <q-card-section class="col-grow row justify-center">
        <PropertyTable
          :properties="plate.properties"
          :read-only="readOnly"
          @addProperty="onAddProperty"
          @removeProperty="onRemoveProperty"
        />
      </q-card-section>
    </q-card>
  </div>

  <EditResourceDialog
    v-model:show="showEditDialog"
    :project="plate"
    @valueChanged="onEdited"
  />

  <delete-dialog
    v-model:show="showDeleteDialog"
    :id="plate.id"
    :name="plate.barcode"
    :objectClass="'plate'"
    @onDeleted="onDeleted"
  />

  <CalculatePlateDialog
    v-model:show="showCalculateDialog"
    :plates="[plate]"
    :protocol-id="plateStore.activeResultSet?.protocolId"
  />
</template>

<script setup>
import { usePlateStore } from "@/stores/plate";
import { ref } from "vue";
import UserChip from "@/components/widgets/UserChip";
import EditableField from "@/components/widgets/EditableField";
import DateChip from "@/components/widgets/DateChip.vue";
import PropertyTable from "@/components/property/PropertyTable";
import DeleteDialog from "@/components/widgets/DeleteDialog.vue";
import { useExperimentStore } from "@/stores/experiment";
import TagListEditable from "@/components/tag/TagListEditable.vue";
import EditResourceDialog from "@/components/widgets/EditResourceDialog";
import DimensionsChip from "@/components/plate/DimensionsChip.vue";
import CalculatePlateDialog from "@/components/plate/CalculatePlateDialog.vue";
import { useLoadingHandler } from "@/composable/loadingHandler";

const props = defineProps(["plate", "activeMeasurement"]);
const emits = defineEmits(["updated", "deleted"]);

const experimentStore = useExperimentStore();
const plateStore = usePlateStore();

const showDeleteDialog = ref(false);
const showCalculateDialog = ref(false);

const readOnly = ref(
  props.plate?.approvalStatus === "APPROVED" || experimentStore.isClosed
);
const showEditDialog = ref(false);

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