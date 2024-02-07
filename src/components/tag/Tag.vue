<template>
  <div class="">
    <q-badge color="green" >
      {{ tag }} <q-btn size="xs" flat dense icon-right="close" v-show="!props.readOnly" @click="removeTag"/>
    </q-badge>
  </div>
</template>

<script setup>
import {ref} from "vue";

const props = defineProps(['tag', 'readOnly'])
const emit = defineEmits(['removeTag']);

const tag = ref(props.tag)

const removeTag = () => {
  emit('removeTag', tag.value);
}
</script>
