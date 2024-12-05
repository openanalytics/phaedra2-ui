<template>
  <phaedra-details-section v-if="well && well.pos">
    <template v-slot:title>
      <div>
        <span> {{ well.pos }} </span>
        <span class="q-mx-sm" style="font-size: 0.7em">
              ({{ well.id }})
              <q-tooltip>ID</q-tooltip>
          </span>
      </div>
    </template>
    <template v-slot:actions>
        <span v-if="!readOnly">
          <span class="q-ml-sm" v-if="well.status.startsWith('ACCEPT')">
            <q-btn icon="close" size="xs" color="negative" round dense @click="handleRejectWells">
              <q-tooltip>Reject Well</q-tooltip>
            </q-btn>
          </span>

          <span class="q-ml-sm" v-if="well.status.startsWith('REJECT')">
            <q-btn icon="check" size="xs" color="positive" round dense @click="handleAcceptWells">
              <q-tooltip>Accept Well</q-tooltip>
            </q-btn>
          </span>
        </span>
    </template>
    <template v-slot:readonly>
      <div class="col">
        <DimensionsChip label="Row x Column" :rows="well.row" :columns="well.column"
                        onHoverMessage="Row x Column"/>
        <div>
          <span style="font-size: 10px; color: rgba(0, 0, 0, 0.6)"> Well Status: </span>
          <q-chip v-if="well.status" dense size="12px"
                  :color="wellStateColor" :text-color="calculateTextColor(wellStateColor)">
            {{ well.status }}
            <q-tooltip>Status</q-tooltip>
          </q-chip>
        </div>
        <div>
          <span style="font-size: 10px; color: rgba(0, 0, 0, 0.6)"> Well Type: </span>
          <q-chip v-if="well.wellType" dense size="12px"
                  :color="wellTypeColor" :text-color="calculateTextColor(wellTypeColor)">
            {{ well.wellType }}
            <q-tooltip>Well Type</q-tooltip>
          </q-chip>
        </div>
      </div>
      <div class="col">
        <div>
          <span style="font-size: 10px; color: rgba(0, 0, 0, 0.6)"> Substance: </span>
          <q-chip v-if="well.wellSubstance?.name" dense size="12px">
            {{ well.wellSubstance?.name }}
            <q-tooltip>Substance Name</q-tooltip>
          </q-chip>
        </div>
        <div>
          <span style="font-size: 10px; color: rgba(0, 0, 0, 0.6)"> Substance Type: </span>
          <q-chip v-if="well.wellSubstance?.type" dense size="12px">
            {{ well.wellSubstance?.type }}
            <q-tooltip>Substance Type</q-tooltip>
          </q-chip>
        </div>
        <div>
          <span style="font-size: 10px; color: rgba(0, 0, 0, 0.6)"> Concentration: </span>
          <q-chip dense size="12px">
            {{ well.wellSubstance?.concentration }}
            <q-tooltip>Concentration</q-tooltip>
          </q-chip>
        </div>
      </div>
    </template>
    <template v-slot:editable>
      <EditableField :object="well" fieldName="description"/>
      <TagListEditable :tags="well.tags" :read-only="readOnly"
                       @addTag="onAddTag" @removeTag="onRemoveTag"/>
    </template>
    <template v-slot:properties>
      <PropertyTable :properties="well.properties" :read-only="readOnly"
                     @addProperty="onAddProperty" @removeProperty="onRemoveProperty"/>
    </template>
  </phaedra-details-section>
</template>

<script setup>
import { useWellStore } from "@/stores/well";
import PropertyTable from "@/components/property/PropertyTable.vue";
import DimensionsChip from "@/components/plate/DimensionsChip.vue";
import TagListEditable from "@/components/tag/TagListEditable.vue";
import EditableField from "@/components/widgets/EditableField";
import { computed, readonly } from "vue";
import { useLoadingHandler } from "../../composable/loadingHandler";
import PhaedraDetailsSection from "@/components/widgets/PhaedraDetailsSection.vue";

const props = defineProps(["well"]);
const emit = defineEmits(["wellStatusChanged", "updated"]);

const wellStore = useWellStore();

const loadingHandler = useLoadingHandler();
const onAddTag = async (newTag) => {
  await loadingHandler.handleLoadingDuring(
    wellStore.handleAddTag(props.well.id, newTag).then(() => {
      emit("updated");
    })
  );
};

const onRemoveTag = async (tag) => {
  await loadingHandler.handleLoadingDuring(
    wellStore.handleDeleteTag(props.well.id, tag).then(() => {
      emit("updated");
    })
  );
};

const onAddProperty = async (newProperty) => {
  await loadingHandler.handleLoadingDuring(
    wellStore.handleAddProperty(props.well.id, newProperty).then(() => {
      emit("updated");
    })
  );
};

const onRemoveProperty = async (property) => {
  await loadingHandler.handleLoadingDuring(
    wellStore.handleDeleteProperty(props.well.id, property).then(() => {
      emit("updated");
    })
  );
};

const handleRejectWells = async () => {
  if (props.well) {
    await loadingHandler.handleLoadingDuring(
      wellStore.rejectWell(
        props.well.plateId,
        "REJECTED_PHAEDRA",
        "Well rejection from chart!"
      )
    );
    emit("updated");
    emit("wellStatusChanged");
  }
};

const handleAcceptWells = async () => {
  if (props.well) {
    await loadingHandler.handleLoadingDuring(
      wellStore.acceptWell(props.well.plateId)
    );
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
