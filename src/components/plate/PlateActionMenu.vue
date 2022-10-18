<template>
    <q-menu>
        <q-list dense>

            <!-- Validation Menu -->
            <q-item clickable v-if="props.plate.approvalStatus === 'APPROVAL_NOT_SET'">
                <q-item-section avatar><q-icon color="primary" name="outlined_flag"/></q-item-section>
                <q-item-section>Validation</q-item-section>
                <q-item-section side><q-icon name="keyboard_arrow_right"/></q-item-section>

                <q-menu anchor="top end" self="top start">
                    <q-list dense>
                        <q-item clickable v-if="props.plate.validationStatus === 'VALIDATION_NOT_SET'" @click="validate()">
                        <q-item-section avatar><q-icon color="positive" name="check_circle"/></q-item-section>
                        <q-item-section>Validate</q-item-section>
                        </q-item>
                        <q-item clickable v-if="props.plate.validationStatus === 'VALIDATION_NOT_SET'" @click="invalidate()">
                        <q-item-section avatar><q-icon color="negative" name="cancel"/></q-item-section>
                        <q-item-section>Invalidate</q-item-section>
                        </q-item>
                        <q-item clickable v-if="props.plate.validationStatus !== 'VALIDATION_NOT_SET'" @click="resetValidation()">
                        <q-item-section avatar><q-icon color="primary" name="horizontal_rule"/></q-item-section>
                        <q-item-section>Reset Validation</q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
            </q-item>

            <!-- Approval Menu -->
            <q-item clickable v-if="props.plate.approvalStatus === 'APPROVAL_NOT_SET' && props.plate.validationStatus === 'VALIDATED'" >
                <q-item-section avatar><q-icon color="primary" name="outlined_flag"/></q-item-section>
                <q-item-section>Approval</q-item-section>
                <q-item-section side><q-icon name="keyboard_arrow_right"/></q-item-section>

                <q-menu anchor="top end" self="top start">
                    <q-list dense>
                        <q-item clickable @click="approve()">
                            <q-item-section avatar><q-icon color="positive" name="check_circle"/></q-item-section>
                            <q-item-section>Approve</q-item-section>
                        </q-item>
                        <q-item clickable @click="disapprove()">
                            <q-item-section avatar><q-icon color="negative" name="cancel"/></q-item-section>
                            <q-item-section>Disapprove</q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
            </q-item>

            <q-separator />

            <q-item clickable @click="calculatePlate()">
                <q-item-section avatar><q-icon name="calculate"/></q-item-section>
                <q-item-section>Calculate plate</q-item-section>
            </q-item>

            <q-item clickable @click="linkPlate()">
                <q-item-section avatar><q-icon name="playlist_add"/></q-item-section>
                <q-item-section>Link Plate Template</q-item-section>
            </q-item>

            <q-item clickable @click="showPlateInspector()">
                <q-item-section avatar><q-icon color="primary" name="info"/></q-item-section>
                <q-item-section>Plate Inspector</q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable @click="deletePlate()">
                <q-item-section avatar><q-icon color="negative" name="delete"/></q-item-section>
                <q-item-section>Delete Plate</q-item-section>
            </q-item>
        </q-list>

        <invalidate-dialog v-model:show="showInvalidateDialog" :plateId="props.plate.id" />
        <approve-dialog v-model:show="showApproveDialog" :plateId="props.plate.id" />
        <disapprove-dialog v-model:show="showDisapproveDialog" :plateId="props.plate.id" />
        <calculate-plate-dialog v-model:show="showCalculateDialog" :plateId="props.plate.id" />
        <link-plate-dialog v-model:show="showLinkDialog" :plateId="props.plate.id" />
        <delete-dialog ref="refDeleteDialog" :id="props.plate.id" :name="props.plate.barcode" objectClass="plate" />
    </q-menu>

</template>

<script setup>
    import {ref} from "vue";
    import {useStore} from 'vuex'

    import InvalidateDialog from "@/components/plate/InvalidateDialog";
    import DisapproveDialog from "@/components/plate/DisapproveDialog";
    import ApproveDialog from "@/components/plate/ApproveDialog";
    import CalculatePlateDialog from "@/components/plate/CalculatePlateDialog";
    import LinkPlateDialog from "@/components/plate/LinkPlateDialog";
    import DeleteDialog from "@/components/widgets/DeleteDialog";

    const store = useStore();

    const showInvalidateDialog = ref(false);
    const showApproveDialog = ref(false);
    const showDisapproveDialog = ref(false);
    const showCalculateDialog = ref(false);
    const showLinkDialog = ref(false);
    const refDeleteDialog = ref(null);

    const props = defineProps(['plate']);

    const validate = () => {
        store.dispatch('plates/editPlate', {id: props.plate.id, validationStatus: 'VALIDATED'})
    }
    const invalidate = () => {
        showInvalidateDialog.value = true;
    }
    const resetValidation = () => {
        store.dispatch('plates/editPlate', {
            id: props.plate.id,
            validationStatus: 'VALIDATION_NOT_SET',
            invalidatedReason: ""
        });
    }

    const approve = () => {
        showApproveDialog.value = true;
    }
    const disapprove = () => {
        showDisapproveDialog.value = true;
    }
    const calculatePlate = () => {
        showCalculateDialog.value = true;
    }
    const linkPlate = () => {
        showLinkDialog.value = true;
    }
    const showPlateInspector = () => {
        store.dispatch('ui/openSideView', 'plateInspector');
    }
    const deletePlate = () => {
        refDeleteDialog.value.showDialog = true;
    }
</script>
