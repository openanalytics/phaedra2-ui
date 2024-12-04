<template>
  <div class="q-pa-sm">
    <q-card flat bordered class="row justify-between" style="width: 100%" >
      <q-card-section horizontal class="col-7">
        <q-card-section class="q-pt-xs" style="width: 100%">
          <div style="width: 100%" class="row align-content-center text-h5 q-mt-sm q-mb-xs">
            <div>
              <span>
                <q-icon lass="column q-pr-sm" name="border_outer" size="md"/>
                {{ template.name }}
              </span>
              <span class="q-mx-sm" style="font-size: 0.7em">
                ({{ template.id }})
                <q-tooltip>ID</q-tooltip>
              </span>
            </div>
            <div>

            </div>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>

</template>

<script setup>

const props = defineProps(["template"])

</script>

<style scoped>

</style>
