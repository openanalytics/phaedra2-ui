<template>
  <div class="">
    <q-badge color="green" >
      {{ tag }} <q-btn size="xs" flat dense icon-right="close" @click="removeTag"/>
    </q-badge>
  </div>
</template>

<script setup>
import {ref} from "vue";

const props = defineProps(['tag'])
const emit = defineEmits(['removeTag']);

const tag = ref(props.tag)

const removeTag = () => {
  emit('removeTag', tag.value);
}
</script>
