<template>
  <q-badge color="green">
    {{ tagInfo.tag }} <q-btn size="xs" flat dense icon-right="close" v-show="!readOnly" @click="removeTag"/>
  </q-badge>
</template>

<script>
import {useStore} from 'vuex'

export default {
  name: "Tag",
  props: {
    tagInfo: Object,
    objectInfo: Object,
    objectClass: String,
    readOnly: Boolean
  },
  setup(props) {
    const exported = {};
    const store = useStore();

    exported.removeTag = function() {
      store.dispatch('metadata/removeTag', {
        tag: props.tagInfo.tag,
        objectId: props.objectInfo.id,
        objectClass: props.objectClass,
      });
    }

    return exported;
  }
}
</script>
