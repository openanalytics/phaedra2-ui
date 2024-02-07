<template>
    <q-th style="padding: 0px 8px 0px 8px;">
        <q-input v-model="model" dense borderless input-class="q-py-none">
            <template v-slot:append>
                <q-icon size="xs" name="search"/>
            </template>
        </q-input>
    </q-th>
</template>

<style>
    .q-field__control, .q-field__append {
        height: 32px !important;
    }
</style>

<script setup>
    const model = defineModel();
</script>