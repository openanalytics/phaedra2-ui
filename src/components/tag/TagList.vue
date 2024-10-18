<template>
  <div>
    <div class="tag-icon flex inline" v-for="tag in tags" :key="tag">
      <Tag :tag="tag" @removeTag="handleRemoveTag" :readOnly="props.readOnly" />
    </div>
    <q-btn
      class="q-my-xs"
      icon="add"
      size="xs"
      @click="showAddTagDialog = true"
      round
      dense
      v-show="!props.readOnly"
    >
      <q-tooltip :delay="500" class="text-black bg-secondary"
        >Add a new Tag</q-tooltip
      >
    </q-btn>

    <q-dialog v-model="showAddTagDialog">
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
  </div>
</template>

<style scoped>
.tag-icon {
  margin-right: 5px;
}
</style>

<script setup>
import { computed, ref } from "vue";
import Tag from "@/components/tag/Tag";

const props = defineProps(["tags", "objectId", "objectClass", "readOnly"]);
const emits = defineEmits(["addTag", "removeTag"]);
const tags = computed(() => props.tags ?? []);

const showAddTagDialog = ref(false);
const newTag = ref("");

const doAddTag = () => {
  emits("addTag", newTag.value);
};

const handleRemoveTag = (tag) => {
  emits("removeTag", tag);
};
</script>
