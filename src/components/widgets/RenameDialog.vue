<template>
    <q-dialog v-model="showDialog">
        <q-card style="min-width: 30vw">
            <q-card-section class="text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
                <q-icon name="edit" class="q-pr-sm"/>
                Rename {{objectClass}}
            </q-card-section>

            <q-card-section>
                <q-input dense v-model="fieldValue" />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
                <q-btn label="Cancel" v-close-popup @click="cancelChanges" flat/>
                <q-btn label="Save" v-close-popup class="oa-button" @click="saveChanges" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
    import {ref, computed} from "vue";

    const props = defineProps({
        objectClass: String,
        object: Object,
        fieldName: String,
        show: Boolean
    });
    const emit = defineEmits([ 'valueChanged', 'update:show' ]);

    const showDialog = computed({
        get: () => props.show,
        set: (v) => emit('update:show', v)
    });

    const newFieldValue = ref(null);
    const fieldValue = computed({
        get: () => props.object[props.fieldName || 'name'],
        set: (newValue) => { newFieldValue.value = newValue }
    });

    const cancelChanges = () => {
        newFieldValue.value = null;
    };
    const saveChanges = () => {
        if (newFieldValue.value) {
            emit('valueChanged', newFieldValue.value);
            newFieldValue.value = null;
        }
    };
</script>
