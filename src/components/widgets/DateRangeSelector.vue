<template>
    <q-input dense label="From" stack-label v-model="fromValue">
        <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="fromDatePopup">
                    <q-date v-model="fromValue" :mask="dateMask">
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat/>
                        </div>
                    </q-date>
                </q-popup-proxy>
            </q-icon>
        </template>
    </q-input>
    <q-input dense label="Until" stack-label v-model="toValue" class="on-right">
        <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="toDatePopup">
                    <q-date v-model="toValue" :mask="dateMask">
                        <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat/>
                        </div>
                    </q-date>
                </q-popup-proxy>
            </q-icon>
        </template>
    </q-input>
</template>

<script setup>
    import { ref, computed } from "vue";
    import { date } from 'quasar';

    const props = defineProps({ from: Date, to: Date });
    const emit = defineEmits([ 'update:from', 'update:to', 'rangeChanged' ]);

    const fromDatePopup = ref(null);
    const toDatePopup = ref(null);

    const dateMask = "DD-MMM-YYYY";

    const fromValue = computed({
        get: () => date.formatDate(props.from, dateMask),
        set: (newValue) => { emit('update:from', date.extractDate(newValue, dateMask)); emit('rangeChanged'); fromDatePopup.value?.hide(); }
    });
    const toValue = computed({
        get: () => date.formatDate(props.to, dateMask),
        set: (newValue) => { emit('update:to', date.extractDate(newValue, dateMask)); emit('rangeChanged'); toDatePopup.value?.hide(); }
    });
</script>