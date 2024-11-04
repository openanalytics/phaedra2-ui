<template>
  <div v-if="tags.length > 0">
    <div class="tag-icon flex inline" v-for="tag in tags" :key="tag">
      <Tag :tag="tag" @removeTag="handleRemoveTag" :readOnly="props.readOnly" />
    </div>
  </div>
  <div class="full-width row text-dark" v-else>No tags available</div>
</template>

<style scoped>
.tag-icon {
  margin-right: 5px;
}
</style>

<script setup>
import { computed } from "vue";
import Tag from "@/components/tag/Tag";

const props = defineProps(["tags", "readOnly"]);
const emits = defineEmits(["removeTag"]);
const tags = computed(() => props.tags ?? []);

const handleRemoveTag = (tag) => {
  emits("removeTag", tag);
};
</script>
