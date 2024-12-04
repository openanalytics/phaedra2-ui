<template>
  <div>
    <q-card flat class="row justify-between" style="width: 100%">
      <q-card-section horizontal class="col-7">
        <q-card-section style="width: 100%">
          <div style="width: 100%" class="row align-content-center text-h5">
            <div class="row">
              <q-icon class="q-mx-sm" :name="icon" size="md"/>
              <div style="align-items: baseline">
                <span> {{ title }} </span>
                <span v-if="id" class="q-mx-sm" style="font-size: 0.7em">
                  ({{ id }})
                  <q-tooltip>ID</q-tooltip>
                </span>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card-section>
      <q-card-section class="col-grow row justify-center">
        <div class="oa-section-body">
          <slot></slot>
        </div>
      </q-card-section>
    </q-card>

  </div>
</template>

<script setup>
    import PropertyTable from "@/components/property/PropertyTable.vue";
    import {template} from "underscore";

    const props = defineProps([ 'title', 'id', 'icon'])
</script>

<style scoped>
.align {
  display: flex;
  align-items: center;
}

.q-card__section--vert {
  padding: 8px;
}
</style>

