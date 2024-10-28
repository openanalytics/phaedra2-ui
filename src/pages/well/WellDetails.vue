<template>
  <q-card
    v-if="well && well.pos"
    flat
    bordered
    class="row justify-between"
    style="width: 100%"
  >
    <q-card-section horizontal class="col-7">
      <q-card-section class="q-pt-xs">
        <div
          style="width: 100%"
          class="row align-center text-h5 q-mt-sm q-mb-xs"
        >
          <div>
            <span>
              {{ well.pos }}
            </span>

            <span class="q-mx-sm" style="font-size: 0.7em"
              >({{ well.id }}) <q-tooltip>ID</q-tooltip></span
            >
          </div>
          <span v-if="!readOnly">
            <span>
              <q-btn
                round
                dense
                icon="calculate"
                size="xs"
                color="positive"
                @click="handleAcceptWells"
                ><q-tooltip>Accept</q-tooltip></q-btn
              >
            </span>

            <span class="q-ml-sm">
              <q-btn
                round
                dense
                icon="delete"
                size="xs"
                color="negative"
                @click="handleRejectWells"
                ><q-tooltip>Reject</q-tooltip></q-btn
              >
            </span>
          </span>
        </div>

        <div class="row col-sm">
          <div class="text-overline">
            <DimensionsChip
              :rows="well.row"
              :columns="well.column"
              onHoverMessage="Row x Column"
            />
          </div>
          <div class="text-overline">
            <q-chip v-if="well.status" dense size="12px"
              >{{ well.status }}<q-tooltip>Status</q-tooltip></q-chip
            >

            <q-chip v-if="well.wellType" dense size="12px"
              >{{ well.wellType }}<q-tooltip>Well Type</q-tooltip></q-chip
            >

            <q-chip v-if="well.wellSubstance?.name" dense size="12px"
              >{{ well.wellSubstance?.name
              }}<q-tooltip>Substance Name</q-tooltip></q-chip
            >

            <q-chip v-if="well.wellSubstance?.type" dense size="12px"
              >{{ well.wellSubstance?.type
              }}<q-tooltip>Substance Type</q-tooltip></q-chip
            >

            <q-chip dense size="12px"
              >{{ well.wellSubstance?.concentration
              }}<q-tooltip>Concentration</q-tooltip></q-chip
            >
          </div>
        </div>
        <div class="text-caption text-grey q-my-sm">
          <EditableField readOnly :object="well" fieldName="description" />
        </div>
        <TagListEditable
          :tags="well.tags"
          :read-only="readOnly"
          @addTag="onAddTag"
          @removeTag="onRemoveTag"
          class="q-pt-xs"
        />
      </q-card-section>
    </q-card-section>

    <q-card-section class="col-grow row justify-center">
      <PropertyTable
        :properties="well.properties"
        :read-only="readOnly"
        @addProperty="onAddProperty"
        @removeProperty="onRemoveProperty"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useWellStore } from "@/stores/well";
import PropertyTable from "@/components/property/PropertyTable.vue";
import DimensionsChip from "@/components/plate/DimensionsChip.vue";
import TagListEditable from "@/components/tag/TagListEditable.vue";
import EditableField from "@/components/widgets/EditableField";

const props = defineProps(["well"]);
const emit = defineEmits(["wellStatusChanged", "updated"]);

const wellStore = useWellStore();

const onAddTag = async (newTag) => {
  await wellStore.handleAddTag(props.well.id, newTag).then(() => {
    emit("updated");
  });
};

const onRemoveTag = async (tag) => {
  await wellStore.handleDeleteTag(props.well.id, tag).then(() => {
    emit("updated");
  });
};

const onAddProperty = async (newProperty) => {
  await wellStore.handleAddProperty(props.well.id, newProperty).then(() => {
    emit("updated");
  });
};

const onRemoveProperty = async (property) => {
  await wellStore.handleDeleteProperty(props.well.id, property).then(() => {
    emit("updated");
  });
};

const handleRejectWells = async () => {
  if (props.well) {
    await wellStore.rejectWell(
      props.well.plateId,
      "REJECTED_PHAEDRA",
      "Well rejection from chart!"
    );
    emit("updated");
    emit("wellStatusChanged");
  }
};

const handleAcceptWells = async () => {
  if (props.well) {
    await wellStore.acceptWell(props.well.plateId);
    emit("updated");
    emit("wellStatusChanged");
  }
};
</script>

<style scoped></style>
