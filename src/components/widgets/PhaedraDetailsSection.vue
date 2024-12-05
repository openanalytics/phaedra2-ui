<template>
  <q-card flat bordered class="row justify-between" style="width: 100%">
    <q-card-section horizontal class="col-7">
      <q-card-section class="q-pt-xs justify-between" style="width: 100%">
        <div class="row align-center text-h5 q-mt-sm q-mb-xs">
          <div class="row">
            <slot name="title"></slot>
          </div>
          <div>
            <slot name="actions"></slot>
          </div>
        </div>
        <div class="row text-caption q-mt-sm">
          <slot name="readonly"></slot>
        </div>
        <div class="text-caption text-grey q-mt-sm">
          <slot name="editable"></slot>
        </div>
      </q-card-section>
    </q-card-section>
    <q-card-section class="col-grow row justify-center">
      <slot name="properties"></slot>
    </q-card-section>
  </q-card>
</template>

<script setup>
</script>

<style scoped>
.action-button {
  margin: 3px;
}
</style>

