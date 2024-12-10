<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 30vw">
      <q-card-section style="width: 100%; padding: 4px">
        <div class="row align-center text-h5 q-mb-xs">
          <div class="row">
            <q-icon name="add" size="md" class="q-mr-sm"/>
            <div style="align-items: baseline">
              <span> Add Tag </span>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row items-center">
          <div class="col-1">
            <q-icon name="sell" size="md" class="q-mr-sm"/>
          </div>
          <div class="col">
            <q-input dense v-model="newTag" autofocus @keyup.enter="showAddTagDialog = false"
                     label="New Tag Name" />
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
  emit("addTag", newTag.value);
}
</script>
