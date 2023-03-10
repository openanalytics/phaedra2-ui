<template>
    <div v-if="collapsible">
        <q-expansion-item :label="title" :icon="icon"
                          header-class="text-h6 oa-section-title"
                          expand-icon-class="text-white"
                          default-opened dense>
            <div class="oa-section-body">
                <slot></slot>
            </div>
        </q-expansion-item>
    </div>
    <div v-else>
        <div class="row oa-section-title">
            <div class="column" style="justify-content: center;">
                <q-icon class="q-pr-md" style="min-width: 56px;" :name="icon" />
            </div>
            <div class="column text-h6">{{title}}</div>
        </div>
        <div class="oa-section-body">
            <slot></slot>
        </div>
    </div>
</template>
  
<script setup>
    const props = defineProps([ 'title', 'icon', 'collapsible' ])
</script>
  