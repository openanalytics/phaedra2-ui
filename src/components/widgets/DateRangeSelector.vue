<template>
    <q-input outlined dense label="From" stack-label v-model="fromValue">
        <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="fromValue" :mask="dateMask">
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat/>
                        </div>
                    </q-date>
                </q-popup-proxy>
            </q-icon>
        </template>
        <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="fromValue" :mask="dateMask" format24h>
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat/>
                        </div>
                    </q-time>
                </q-popup-proxy>
            </q-icon>
        </template>
    </q-input>
    <q-input outlined dense label="Until" stack-label v-model="toValue" class="on-right">
        <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="toValue" :mask="dateMask">
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat/>
                        </div>
                    </q-date>
                </q-popup-proxy>
            </q-icon>
        </template>
        <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="toValue" :mask="dateMask" format24h>
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat/>
                        </div>
                    </q-time>
                </q-popup-proxy>
            </q-icon>
        </template>
    </q-input>
</template>

<script setup>
    import {computed} from "vue";
    import { date } from 'quasar';

    const props = defineProps({ from: Date, to: Date });
    const emit = defineEmits([ 'update:from', 'update:to', 'rangeChanged' ]);

    const dateMask = "YYYY-MM-DD HH:mm";

    const fromValue = computed({
        get: () => date.formatDate(props.from, dateMask),
        set: (newValue) => { emit('update:from', date.extractDate(newValue, dateMask)); emit('rangeChanged'); }
    });
    const toValue = computed({
        get: () => date.formatDate(props.to, dateMask),
        set: (newValue) => { emit('update:to', date.extractDate(newValue, dateMask)); emit('rangeChanged'); }
    });
</script>