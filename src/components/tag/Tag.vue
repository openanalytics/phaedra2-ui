<template>
  <q-badge color="green">
    {{ tagInfo.tag }} <q-btn label="x" size="xs" flat dense round @click="removeTag(tagInfo.tag)"/>
  </q-badge>
</template>

<script>
export default {
  name: "Tag",
  props: {
    tagInfo: Object
  },
  methods: {
    removeTag() {
      if (this.tagInfo.objectClass === 'PROJECT')
        this.$store.dispatch('projects/removeTag', this.tagInfo)
      else if (this.tagInfo.objectClass === 'EXPERIMENT')
        this.$store.dispatch('experiments/removeTag', this.tagInfo)
    },
    setup() {
    }
  }
}
</script>

<style>

</style>
