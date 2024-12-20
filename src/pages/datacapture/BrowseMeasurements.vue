<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'workbench'}"/>
    <q-breadcrumbs-el :label="'Measurements'" icon="list"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section title="Captured Measurements" icon="text_snippet">
        <measurement-list @row-dlb-click="gotoMeasurementView"/>
      </oa-section>
    </div>
  </q-page>
</template>

<script setup>
import {useRouter} from "vue-router";
import OaSection from "@/components/widgets/OaSection";
import MeasurementList from "@/pages/datacapture/MeasurementList.vue";

const router = useRouter()
const gotoMeasurementView = (row) => {
  router.push('/datacapture/meas/' + row.id)
}

</script>
