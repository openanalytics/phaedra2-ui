<template>
    <q-menu>
        <q-list>
            <!-- Charts -->
          <q-item dense clickable>
            <q-item-section avatar>
              <q-icon name="insert_chart" />
            </q-item-section>
            <q-item-section>Charts</q-item-section>
            <q-item-section side>
              <q-icon name="keyboard_arrow_right"/>
            </q-item-section>
            <q-menu>
              <q-list>
                <q-item dense clickable @click="chart()">
                  <q-item-section avatar>
                    <q-icon name="insert_chart" />
                  </q-item-section>
                  <q-item-section>Scatterplot 2D</q-item-section>
                </q-item>
                <q-item dense clickable>
                  <q-item-section avatar>
                    <q-icon name="insert_chart" />
                  </q-item-section>
                  <q-item-section>Chart 2</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-item>
            <!-- Validation Menu -->
            <q-item dense clickable v-if="plate.approvalStatus === 'APPROVAL_NOT_SET'">
                <q-item-section avatar><q-icon name="outlined_flag"/></q-item-section>
                <q-item-section>Validation</q-item-section>
                <q-item-section side>
                    <q-icon name="keyboard_arrow_right"/>
                </q-item-section>

                <q-menu anchor="top end" self="top start">
                    <q-list>
                        <q-item dense clickable v-if="plate.validationStatus === 'VALIDATION_NOT_SET'" @click="validate()">
                        <q-item-section avatar><q-icon name="check_circle"/></q-item-section>
                        <q-item-section>Validate</q-item-section>
                        </q-item>
                        <q-item dense clickable v-if="plate.validationStatus === 'VALIDATION_NOT_SET'" @click="invalidate()">
                        <q-item-section avatar><q-icon name="cancel"/></q-item-section>
                        <q-item-section>Invalidate</q-item-section>
                        </q-item>
                        <q-item dense clickable v-if="plate.validationStatus !== 'VALIDATION_NOT_SET'" @click="resetValidation()">
                        <q-item-section avatar><q-icon name="horizontal_rule"/></q-item-section>
                        <q-item-section>Reset Validation</q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>
            </q-item>

            <!-- Approval Menu -->
            <q-item dense clickable v-if="plate.approvalStatus === 'APPROVAL_NOT_SET' && plate.validationStatus === 'VALIDATED'" >
                <q-item-section avatar><q-icon name="outlined_flag"/></q-item-section>
                <q-item-section>Approval</q-item-section>
                <q-item-section side>
                    <q-icon name="keyboard_arrow_right"/>
                </q-item-section>

                <q-menu anchor="top end" self="top start">
                    <q-list>
                        <q-item dense clickable @click="approve()">
                            <q-item-section avatar><q-icon name="check_circle"/></q-item-section>
                            <q-item-section>Approve</q-item-section>
                        </q-item>
                        <q-item dense clickable @click="disapprove()">
                            <q-item-section avatar><q-icon name="cancel"/></q-item-section>
                            <q-item-section>Disapprove</q-item-section>
                        </q-item>
                    </q-list>
                </q-menu>

            </q-item>

            <q-item dense clickable @click="calculatePlate()">
                <q-item-section avatar><q-icon name="calculate"/></q-item-section>
                <q-item-section>Calculate plate</q-item-section>
            </q-item>
            
            <q-item dense clickable @click="linkPlate()">
                <q-item-section avatar><q-icon name="playlist_add"/></q-item-section>
                <q-item-section>Link Plate Template</q-item-section>
            </q-item>

            <q-item dense clickable @click="deletePlate()">
                <q-item-section avatar><q-icon name="delete"/></q-item-section>
                <q-item-section>Delete Plate</q-item-section>
            </q-item>
        </q-list>
    </q-menu>

    <invalidate-dialog v-model:show="showInvalidateDialog" :plateId="plate.id" />
    <approve-dialog v-model:show="showApproveDialog" :plateId="plate.id" />
    <disapprove-dialog v-model:show="showDisapproveDialog" :plateId="plate.id" />
    <calculate-plate-dialog v-model:show="showCalculateDialog" :plateId="plate.id" />
    <link-plate-dialog v-model:show="showLinkDialog" :plateId="plate.id" />
    <delete-dialog ref="refDeleteDialog" :id="plate.id" :name="plate.barcode" :objectClass="'plate'" />
</template>

<script>
    import {ref} from "vue";
    import {useStore} from 'vuex'

    import InvalidateDialog from "@/components/plate/InvalidateDialog";
    import DisapproveDialog from "@/components/plate/DisapproveDialog";
    import ApproveDialog from "@/components/plate/ApproveDialog";
    import CalculatePlateDialog from "@/components/plate/CalculatePlateDialog";
    import LinkPlateDialog from "@/components/plate/LinkPlateDialog";
    import DeleteDialog from "@/components/widgets/DeleteDialog";

    export default {
        props: {
            'plate': Object
        },
        components: {
            InvalidateDialog, DisapproveDialog, ApproveDialog, CalculatePlateDialog, LinkPlateDialog, DeleteDialog
        },
        setup(props) {
            const store = useStore();

            const showInvalidateDialog = ref(false);
            const showApproveDialog = ref(false);
            const showDisapproveDialog = ref(false);
            const showCalculateDialog = ref(false);
            const showLinkDialog = ref(false);
            const refDeleteDialog = ref(null);

            return {
                showInvalidateDialog,
                showApproveDialog,
                showDisapproveDialog,
                showCalculateDialog,
                showLinkDialog,
                refDeleteDialog,

                validate() {
                    store.dispatch('plates/editPlate', { id: props.plate.id, validationStatus: 'VALIDATED' })
                },
                invalidate() {
                    showInvalidateDialog.value = true;
                },
                resetValidation() {
                    store.dispatch('plates/editPlate', { id: props.plate.id, validationStatus: 'VALIDATION_NOT_SET', invalidatedReason: "" })
                },
                approve() {
                    showApproveDialog.value = true;
                },
                disapprove() {
                    showDisapproveDialog.value = true;
                },
                calculatePlate() {
                    showCalculateDialog.value = true;
                },
                linkPlate() {
                    showLinkDialog.value = true;
                },
                deletePlate() {
                    refDeleteDialog.value.showDialog = true;
                },
                chart() {
                  // load wells by plate id
                  store.dispatch('wells/fetchByPlateId', props.plate.id).then(() => {
                  const wells = store.getters['wells/getWells'](props.plate.id);
                  console.log(wells);
                  store.dispatch('ui/selectWells', wells)
                  store.dispatch('ui/openSideView', 'chart' )}
                  )
                }
            }
        }
    }
</script>
