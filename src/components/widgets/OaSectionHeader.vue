<template>
  <div class="row text-h6 items-center q-px-md oa-section-title">
    <q-icon :name="icon" class="on-left"/>
    {{title}}
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    icon: String
  }
}
</script>