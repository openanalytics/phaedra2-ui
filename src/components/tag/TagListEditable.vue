<template>
  <div class="row items-center q-mt-xs"
       style="font-size: 10px; color: rgba(0, 0, 0, 0.6)">
    <div>Tags</div>
    <div>
      <q-btn
        class="q-my-xs"
        icon="add"
        size="xs"
        @click="openAddTagModal(true)"
        round
        flat
        color="primary"
        dense
        v-show="!props.readOnly"
      >
        <q-tooltip>Add a new Tag</q-tooltip>
      </q-btn>
    </div>
  </div>
  <TagList :tags="tags" @removeTag="(e) => emits('removeTag', e)" />
  <AddTagModal v-model:show="addTagModal" @addTag="(e) => emits('addTag', e)" />
</template>

<script setup>
import { ref } from "vue";
import TagList from "./TagList.vue";
import AddTagModal from "./AddTagModal.vue";

const props = defineProps(["tags", "readOnly"]);
const emits = defineEmits(["addTag", "removeTag"]);

const addTagModal = ref(false);
function openAddTagModal(val) {
  addTagModal.value = val;
}
</script>
