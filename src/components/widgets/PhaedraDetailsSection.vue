<template>
  <q-card flat bordered class="row justify-between" style="width: 100%">
    <q-expansion-item class="q-pa-none" style="width: 100%; background-color: white"
                      expand-icon-toggle default-opened expand-separator dense-toggle
                      :hide-expand-icon="!collapsible" header-style="padding: 0px 0px 0px 4px">
      <template v-slot:header>
        <q-item-section class="row align-center text-h5 q-mb-xs">
          <div class="row">
            <slot name="title"></slot>
            <slot name="actions"></slot>
          </div>
        </q-item-section>
      </template>
      <q-card class="row" style="width: 100%">
        <q-card-section horizontal class="col-7">
          <q-card-section class="q-pt-xs justify-between" style="width: 100%; padding: 6px">
            <div class="row text-caption q-mt-sm">
              <slot name="readonly"></slot>
            </div>
            <div class="text-caption text-grey q-mt-sm">
              <slot name="editable"></slot>
            </div>
          </q-card-section>
        </q-card-section>
        <q-card-section class="col-grow row justify-center" style="padding: 6px">
          <slot name="properties"></slot>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-card>
</template>

<script setup>
const props = defineProps({
  collapsible: {
    default: true,
    type: Boolean
  }
})
</script>

<style scoped>
.action-button {
  margin: 3px;
}
</style>

