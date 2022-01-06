<template>
    <div style="min-height: 20px;" @mouseover="toggleEditBtn(true)" @mouseleave="toggleEditBtn(false)">
        <span>
            {{object[fieldName]}}
        </span>
        <q-btn round dense icon="edit" size="xs" class="on-right" v-show="editBtnShown" @click="showEditDialog = true" />
    </div>

    <q-dialog v-model="showEditDialog">
        <q-card style="min-width: 30vw">
            <q-card-section class="text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
                <q-icon name="edit" class="q-pr-sm"/>
                Edit {{fieldName}}
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

<script>
    import {ref, computed} from "vue";

    export default {
        props: {
            object: Object,
            fieldName: String
        },
        emits: [ 'valueChanged' ],
        setup(props, {emit}) {
            const exported = {};
            const newFieldValue = ref(null);

            exported.editBtnShown = ref(false);
            exported.toggleEditBtn = (show) => {
                exported.editBtnShown.value = show;
            }
            exported.showEditDialog = ref(false);
            exported.fieldValue = computed({
                get: () => props.object[props.fieldName],
                set: (newValue) => { newFieldValue.value = newValue }
            });
            
            exported.cancelChanges = () => {
                newFieldValue.value = null;
            };
            exported.saveChanges = () => {
                if (newFieldValue.value) {
                    emit('valueChanged', newFieldValue.value);
                    newFieldValue.value = null;
                }
            };

            return exported;
        }
    }
</script>
