<template>
    <q-badge dense class="q-ma-none" :color="statusColor">
        {{statusCode}}
    </q-badge>
</template>

<script setup>
    const props = defineProps(['status']);
    const statusCode = (props.status || 'unknown').toLowerCase();

    const statusCodesGood = [ 'success', 'complete', 'completed', 'ok' ];
    const statusCodesBad = [ 'error', 'failed' ];

    let statusColor = 'info';
    if (statusCodesGood.find(s => s === statusCode)) statusColor = 'positive';
    if (statusCodesBad.find(s => s === statusCode)) statusColor = 'negative';
</script>
