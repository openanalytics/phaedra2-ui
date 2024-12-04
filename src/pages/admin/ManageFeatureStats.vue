<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'workbench' }" />
    <q-breadcrumbs-el label="Manage Feature Stats" icon="list" />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-sm">
      <oa-section title="Default Feature Stats" icon="functions">
        <feature-stat-table
          :editable="true"
          :featureStats="defaultFeatureStats"
          @onSaveStat="doSaveStat"
          @onDeleteStat="doDeleteStat"
        />
      </oa-section>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useFeatureStore } from "@/stores/feature";
import { useFormulasStore } from "@/stores/formulas";
import OaSection from "@/components/widgets/OaSection";
import FeatureStatTable from "@/components/featurestat/FeatureStatTable.vue";
import { useLoadingHandler } from "@/composable/loadingHandler";

const featureStore = useFeatureStore();
const formulasStore = useFormulasStore();
const loadingHandler = useLoadingHandler();

onMounted(async () => {
  await loadingHandler.handleLoadingDuring(prepareStats());
});

async function prepareStats() {
  await featureStore.loadDefaultFeatureStats();
  await formulasStore.loadAllFormulas();
}

const defaultFeatureStats = computed(() => featureStore.defaultFeatureStats);

async function doSaveStat(stat) {
  if (stat.id) {
    // Update existing stat
    await loadingHandler.handleLoadingDuring(
      await featureStore.updateDefaultFeatureStat(stat)
    );
  } else {
    // Create new stat
    await loadingHandler.handleLoadingDuring(
      await featureStore.createDefaultFeatureStat(stat)
    );
  }
}

async function doDeleteStat(statId) {
  await loadingHandler.handleLoadingDuring(
    await featureStore.deleteDefaultFeatureStat(statId)
  );
}
</script>
