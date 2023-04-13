<template>
    <q-badge dense class="q-ma-none" :color="statusColor">
        {{props.status || 'unknown' }}
    </q-badge>
</template>

<script setup>
    import {computed} from "vue";

    const props = defineProps(['status']);

    const statusCodesGood = [ 'success', 'complete', 'completed', 'ok', 'enabled' ];
    const statusCodesBad = [ 'error', 'failed', 'failure', 'disabled' ];

    const statusColor = computed(() => {
        if (statusCodesGood.find(s => s.toUpperCase() == props.status?.toUpperCase())) return 'positive';
        if (statusCodesBad.find(s => s.toUpperCase() == props.status?.toUpperCase())) return 'negative';
        return 'info';
    });
</script>
