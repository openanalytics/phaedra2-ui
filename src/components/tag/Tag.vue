<template>
  <q-badge color="green">
    {{ tagInfo.tag }} <q-btn size="xs" flat dense icon-right="close" @click="removeTag(tagInfo.tag)"/>
  </q-badge>
</template>

<script>
export default {
  name: "Tag",
  props: {
    tagInfo: Object,
    objectInfo: Object,
    objectClass: String
  },
  methods: {
    removeTag() {
      let taggedObject = {
        tag: this.tagInfo.tag,
        objectId: this.objectInfo.id,
        objectClass: this.objectClass,
      }

      if (this.objectClass === 'PROJECT')
        this.$store.dispatch('projects/removeTag', taggedObject);
      else if (this.objectClass === 'EXPERIMENT')
        this.$store.dispatch('experiments/removeTag', taggedObject);
      else if (this.objectClass === 'PLATE')
        this.$store.dispatch('plates/removeTag', taggedObject);
      else if (this.objectClass === 'WELL')
        this.$store.dispatch('plates/removeTag', taggedObject);
      else if (this.objectClass === 'PROTOCOL')
        this.$store.dispatch('protocols/removeTag', taggedObject);
      else if (this.objectClass === 'FEATURE')
        this.$store.dispatch('features/removeTag', taggedObject);
    },
    setup() {
    }
  }
}
</script>

<style>

</style>
