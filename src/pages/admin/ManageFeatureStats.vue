<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el label="Manage Feature Stats" icon="list"/>
  </q-breadcrumbs>
  
  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section title="Default Feature Stats" icon="functions">
        <feature-stat-table :featureStats="defaultFeatureStats" @onSaveStat="doSaveStat" @onDeleteStat="doDeleteStat" />
      </oa-section>
    </div>
  </q-page>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {useFeatureStore} from "@/stores/feature";
import {useFormulasStore} from "@/stores/formulas";
import OaSection from "@/components/widgets/OaSection";
import FeatureStatTable from '@/components/featurestat/FeatureStatTable.vue';

const featureStore = useFeatureStore();
const formulasStore = useFormulasStore();

onMounted(() => {
  featureStore.loadDefaultFeatureStats();
  formulasStore.loadAllFormulas();
});

const defaultFeatureStats = computed(() => featureStore.defaultFeatureStats);

async function doSaveStat(stat) {
  if (stat.id) {
      // Update existing stat
      await featureStore.updateDefaultFeatureStat(stat);
  } else {
      // Create new stat
      await featureStore.createDefaultFeatureStat(stat);
  }
}

async function doDeleteStat(statId) {
  await featureStore.deleteDefaultFeatureStat(statId);
}

</script>
