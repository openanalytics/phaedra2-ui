<template>
    <q-menu
        touch-position
        context-menu
    >
        <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup>
                <q-item-section>Open in this tab</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
                <q-item-section>Open in new tab</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup>
                <q-item-section>Delete...</q-item-section>
            </q-item>
        </q-list>
    </q-menu>
</template>

<script>

</script>
