<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 30vw">
      <q-card-section
        class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary"
      >
        <q-icon name="add" class="q-pr-sm" />
        Add Tag
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-2 row items-center">
            <q-avatar icon="sell" color="primary" text-color="white" />
          </div>
          <div class="col-10">
            <span>New Tag Name:</span><br />
            <q-input
              dense
              v-model="newTag"
              autofocus
              @keyup.enter="showAddTagDialog = false"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          label="Add tag"
          v-close-popup
          color="primary"
          @click="doAddTag"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.tag-icon {
  margin-right: 5px;
}
</style>

<script setup>
import { computed, ref } from "vue";
import { addTag } from "../../lib/MetadataUtils";

const props = defineProps(["show", "projects"]);
const emit = defineEmits(["addTag", "update:show"]);

const showDialog = computed({
  get: () => props.show,
  set: (v) => {
    emit("update:show", v);
    newTag.value = "";
  },
});

const showAddTagDialog = ref(false);
const newTag = ref("");

function doAddTag() {
  const projectsArray = Array.from(props.projects);
  const newTagLocal = newTag.value;
  projectsArray.forEach((project) => {
    addTag(project.id, "PROJECT", newTagLocal, () => {}).then(() => {
      project.tags = [...project.tags, newTagLocal];
    });
  });
  emit("addTag");
}
</script>
