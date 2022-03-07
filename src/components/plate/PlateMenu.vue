<template>
  <q-menu fit>
    <q-list>
      <q-item clickable v-if="approvalStatus==='APPROVAL_NOT_SET'">
        <q-item-section avatar>
          <q-icon name="check_circle"/>
        </q-item-section>
        <q-item-section>Validation</q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right"/>
        </q-item-section>

        <q-menu anchor="top end" self="top start">
          <q-list>
            <q-item clickable v-if="validationStatus==='VALIDATION_NOT_SET'"
                    @click="validate(plateId, experimentId)">
              <q-item-section avatar>
                <q-icon name="check_circle"/>
              </q-item-section>
              <q-item-section>Validate</q-item-section>
            </q-item>
            <q-item v-if="validationStatus==='VALIDATION_NOT_SET'" clickable @click="$refs.invalidateDialog.showDialog = true">
              <q-item-section avatar>
                <q-icon name="cancel"/>
              </q-item-section>
              <q-item-section>Invalidate</q-item-section>
            </q-item>
            <q-item v-if="validationStatus!=='VALIDATION_NOT_SET'" clickable @click="resetValidation(plateId, experimentId)">
              <q-item-section avatar>
                <q-icon name="horizontal_rule"/>
              </q-item-section>
              <q-item-section>Reset Validation</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-item>
      <q-item clickable v-if="validationStatus==='VALIDATED'">
        <q-item-section>Approval</q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right"/>
        </q-item-section>

        <q-menu anchor="top end" self="top start">
          <q-list>
            <q-item v-if="approvalStatus==='APPROVAL_NOT_SET'" clickable @click="$refs.approveDialog.showDialog = true">
              <q-item-section avatar>
                <q-icon name="check_circle"/>
              </q-item-section>
              <q-item-section>Approve</q-item-section>
            </q-item>
            <q-item v-if="approvalStatus==='APPROVAL_NOT_SET'" clickable @click="$refs.disapproveDialog.showDialog = true">
              <q-item-section avatar>
                <q-icon name="cancel"/>
              </q-item-section>
              <q-item-section>Disapprove</q-item-section>
            </q-item>
            <q-item v-if="approvalStatus!=='APPROVAL_NOT_SET'" clickable @click="resetApproval(plateId, experimentId)">
              <q-item-section avatar>
                <q-icon name="horizontal_rule"/>
              </q-item-section>
              <q-item-section>Reset Validation</q-item-section>
            </q-item>
          </q-list>
        </q-menu>

      </q-item>
<!--      <q-item clickable @click="calculatePlate(plateId)">-->
      <q-item clickable @click="$refs.plateCalculateDialog.showDialog = true">
        <q-item-section avatar>
          <q-icon name="calculate"/>
        </q-item-section>
        <q-item-section>Calculate plate</q-item-section>
      </q-item>
      <q-item clickable @click="selectedPlateId=plateId;linkDialog = true">
        <q-item-section avatar>
          <q-icon name="playlist_add"/>
        </q-item-section>
        <q-item-section>Link Plate Template</q-item-section>
      </q-item>
    </q-list>
  </q-menu>

  <InvalidateDialog ref="invalidateDialog" :plateId="plateId" :experimentId="experimentId"/>
  <ApproveDialog ref="approveDialog" :plateId="plateId" :experimentId="experimentId"/>
  <DisapproveDialog ref="disapproveDialog" :plateId="plateId" :experimentId="experimentId"/>
  <PlateCalculateDialog ref="plateCalculateDialog" :plateId="plateId" :experimentId="experimentId"/>
</template>

<script>
import PlateCalculateDialog from "@/components/plate/CalculatePlateDialog";
import InvalidateDialog from "@/components/plate/InvalidateDialog";
import DisapproveDialog from "@/components/plate/DisapproveDialog";
import ApproveDialog from "@/components/plate/ApproveDialog";

import {useStore} from "vuex";

export default {
  props: {
    plateId: Number,
    experimentId: Number,
    validationStatus: String,
    approvalStatus: String
  },
  components: {
    PlateCalculateDialog,
    InvalidateDialog,
    DisapproveDialog,
    ApproveDialog
  },
  setup(props) {
    const store = useStore();
    return {
      validate: () => {
        console.log('VALIDATE PLATE');
        const validatePlate = {
          id: props.plateId,
          experimentId: props.experimentId,
          validationStatus: 'VALIDATED'
        }
        store.dispatch('plates/editPlate', validatePlate)
      },
      resetValidation: () => {
        const resetValidation = {
          id: props.plateId,
          experimentId: props.experimentId,
          validationStatus: 'VALIDATION_NOT_SET',
          invalidatedReason: ''
        }
        store.dispatch('plates/editPlate', resetValidation);
      },
      resetApproval: () => {
        const resetApproval = {
          id: props.plateId,
          experimentId: props.experimentId,
          approvalStatus: 'APPROVAL_NOT_SET',
        }
        store.dispatch('plates/editPlate', resetApproval);
      }
    }
  }
  // methods: {
  //   calculatePlate(id){
  //     this.selectedPlateId = id
  //     this.calculateDialog = true
  //   }
  // }
}

</script>
