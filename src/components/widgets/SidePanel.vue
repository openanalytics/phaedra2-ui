<template>
    <div class="q-pt-sm">
        <q-tabs
            v-model="activeTab"
            inline-label dense no-caps
            class="q-px-sm oa-section-title">
            <q-tab v-for="cfg in openSideViewConfigs" :key="cfg.id" :name="cfg.id" :label="cfg.label" :icon="cfg.icon">
                <q-btn size="xs" flat dense icon="close" class="on-right" @click="store.dispatch('ui/closeSideView', cfg.id)"/>
            </q-tab>
        </q-tabs>

        <q-separator />
        
        <div class="row oa-section-body">
            <q-tab-panels v-model="activeTab" animated>
                <q-tab-panel v-for="cfg in openSideViewConfigs" :key="cfg.id" :name="cfg.id" class="q-pa-sm">
                    <component :is="loadAsyncComponent(cfg.componentPath)"/>
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </div>
</template>

<script setup>
    import {computed, ref, defineAsyncComponent, watchEffect} from 'vue'
    import {useStore} from 'vuex'

    const activeTab = ref(null);
    const store = useStore();

    const openSideViews = computed(() => store.getters['ui/getOpenSideViews']());
    const openSideViewConfigs = computed(() => openSideViews.value.map(id => store.getters['ui/getSideViewConfig'](id)));
    watchEffect(() => {
        if (activeTab.value == null && openSideViews.value.length > 0) activeTab.value = openSideViews.value[0];
    });
    const loadAsyncComponent = (path) => {
        // Needs a hardcoded prefix, see here for info: https://github.com/webpack/webpack/issues/6680
        return defineAsyncComponent(() => import(`@/components/${path}`));
    };
</script>