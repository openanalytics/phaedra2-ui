<template>
  <div class="q-pa-sm" style="width: 100%">
    <q-card v-if="well && well.pos" flat bordered class="row justify-between">
      <q-card-section horizontal class="col-7">
        <q-card-section class="q-pt-xs justify-between" style="width: 100%">
          <div class="row align-center text-h5 q-mt-sm q-mb-xs">
            <div>
              <span> {{ well.pos }} </span>
              <span class="q-mx-sm" style="font-size: 0.7em">
                ({{ well.id }})
                <q-tooltip>ID</q-tooltip>
              </span>
            </div>
            <span v-if="!readOnly">
              <span class="q-ml-sm" v-if="well.status.startsWith('ACCEPT')">
                <q-btn
                  icon="close"
                  size="xs"
                  color="negative"
                  round
                  dense
                  @click="handleRejectWells"
                >
                  <q-tooltip>Reject Well</q-tooltip>
                </q-btn>
              </span>

              <span class="q-ml-sm" v-if="well.status.startsWith('REJECT')">
                <q-btn
                  icon="check"
                  size="xs"
                  color="positive"
                  round
                  dense
                  @click="handleAcceptWells"
                >
                  <q-tooltip>Accept Well</q-tooltip>
                </q-btn>
              </span>
            </span>
          </div>

          <div class="row">
            <div class="col">
              <div class="text-caption">
                <DimensionsChip
                  :rows="well.row"
                  :columns="well.column"
                  onHoverMessage="Row x Column"
                  label="Row x Column"
                />
              </div>
              <div class="text-caption">
                <span style="font-size: 10px; color: rgba(0, 0, 0, 0.6)">
                  Well Status:
                </span>
                <q-chip
                  v-if="well.status"
                  dense
                  size="12px"
                  :color="wellStateColor"
                  :text-color="calculateTextColor(wellStateColor)"
                >
                  {{ well.status }}
                  <q-tooltip>Status</q-tooltip>
                </q-chip>
              </div>
              <div class="text-caption">
                <span style="font-size: 10px; color: rgba(0, 0, 0, 0.6)">
                  Well Type:
                </span>
                <q-chip
                  v-if="well.wellType"
                  dense
                  size="12px"
                  :color="wellTypeColor"
                  :text-color="calculateTextColor(wellTypeColor)"
                >
                  {{ well.wellType }}
                  <q-tooltip>Well Type</q-tooltip>
                </q-chip>
              </div>
            </div>
            <div class="col">
              <div class="text-caption">
                <span style="font-size: 10px; color: rgba(0, 0, 0, 0.6)">
                  Substance:
                </span>
                <q-chip v-if="well.wellSubstance?.name" dense size="12px">
                  {{ well.wellSubstance?.name }}
                  <q-tooltip>Substance Name</q-tooltip>
                </q-chip>
              </div>
              <div class="text-caption">
                <span style="font-size: 10px; color: rgba(0, 0, 0, 0.6)">
                  Substance Type:
                </span>
                <q-chip v-if="well.wellSubstance?.type" dense size="12px">
                  {{ well.wellSubstance?.type }}
                  <q-tooltip>Substance Type</q-tooltip>
                </q-chip>
              </div>
              <div class="text-caption">
                <span style="font-size: 10px; color: rgba(0, 0, 0, 0.6)">
                  Concentration:
                </span>
                <q-chip dense size="12px">
                  {{ well.wellSubstance?.concentration }}
                  <q-tooltip>Concentration</q-tooltip>
                </q-chip>
              </div>
            </div>
          </div>
          <div class="col text-caption text-grey q-mt-sm">
            <EditableField read-only :object="well" fieldName="description" />
            <TagListEditable
              :tags="well.tags"
              :read-only="readOnly"
              @addTag="onAddTag"
              @removeTag="onRemoveTag"
            />
          </div>
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
  </div>
</template>

<script setup>
import { useWellStore } from "@/stores/well";
import PropertyTable from "@/components/property/PropertyTable.vue";
import DimensionsChip from "@/components/plate/DimensionsChip.vue";
import TagListEditable from "@/components/tag/TagListEditable.vue";
import EditableField from "@/components/widgets/EditableField";
import { computed, readonly } from "vue";

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

const wellStateColor = computed(() =>
  props.well.status.startsWith("ACCEPT")
    ? "positive"
    : props.well.status.startsWith("REJECT")
    ? "negative"
    : "default"
);

const wellTypeColor = computed(() =>
  props.well.wellType == "PC"
    ? "positive"
    : props.well?.wellType == "NC"
    ? "negative"
    : "default"
);

const calculateTextColor = (color) => {
  switch (color) {
    case "positive":
    case "negative":
      return "white";
    case "grey":
    default:
      return;
  }
};
</script>

<style scoped></style>
