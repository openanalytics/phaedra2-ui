<template>
  <div>
    <q-card flat class="justify-between" style="width: 100%">
      <q-card-section horizontal>
        <q-card-section style="width: 100%">
          <div style="width: 100%" class="row align-content-center text-h5">
            <div class="row">
              <q-icon class="q-mx-sm" :name="icon" size="md"/>
              <div style="align-items: baseline">
                <span> {{ title }} </span>
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
    const props = defineProps([ 'title', 'icon'])
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

