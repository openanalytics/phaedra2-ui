<template>
  <q-badge color="green">
    {{ tagInfo.tag }} <q-btn size="xs" flat dense icon-right="close" @click="removeTag(tagInfo.tag)"/>
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
