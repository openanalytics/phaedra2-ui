<template>
    <q-menu>
        <q-list dense>
            <q-item clickable v-close-popup @click="showWellImage">
                <q-item-section avatar><q-icon color="primary" name="image"/></q-item-section>
                <q-item-section>Show Well Image</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup>
                <q-item-section avatar><q-icon color="positive" name="check_circle"/></q-item-section>
                <q-item-section>Accept Well</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
                <q-item-section avatar><q-icon color="negative" name="cancel"/></q-item-section>
                <q-item-section>Reject Well</q-item-section>
            </q-item>
        </q-list>
    </q-menu>
</template>

<script setup>
    import {useStore} from 'vuex'

    const store = useStore();

    const showWellImage = () => {
        store.dispatch('ui/openSideView', 'wellImage');
    }

    const viewDoseResponseCurve = () => {
      store.dispatch('ui/openSideView', 'doseResponseCurve')
    }

</script>
