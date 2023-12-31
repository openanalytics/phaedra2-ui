<template>
  <q-menu>
    <q-list dense>
      <!-- Charts -->
      <q-item dense clickable>
        <q-item-section avatar>
          <q-icon name="insert_chart"/>
        </q-item-section>
        <q-item-section>Charts</q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right"/>
        </q-item-section>
        <q-menu>
          <q-list>
            <q-item dense clickable @click="chart('scatter', props.plate.id)" v-close-popup>
              <q-item-section avatar>
                <q-icon name="insert_chart"/>
              </q-item-section>
              <q-item-section>Scatterplot 2D</q-item-section>
            </q-item>
            <q-item dense clickable @click="chart('box', props.plate.id)" v-close-popup>
              <q-item-section avatar>
                <q-icon name="insert_chart"/>
              </q-item-section>
              <q-item-section>Boxplot</q-item-section>
            </q-item>
<!--            <q-item dense clickable @click="chart('bar', props.plate.id)" v-close-popup>-->
<!--              <q-item-section avatar>-->
<!--                <q-icon name="insert_chart"/>-->
<!--              </q-item-section>-->
<!--              <q-item-section>Barplot</q-item-section>-->
<!--            </q-item>-->
<!--            <q-item dense clickable @click="chart('line', props.plate.id)" v-close-popup>-->
<!--              <q-item-section avatar>-->
<!--                <q-icon name="insert_chart"/>-->
<!--              </q-item-section>-->
<!--              <q-item-section>Lineplot</q-item-section>-->
<!--            </q-item>-->
            <q-item dense clickable @click="chart('histogram', props.plate.id)" v-close-popup>
              <q-item-section avatar>
                <q-icon name="insert_chart"/>
              </q-item-section>
              <q-item-section>1D Histogram</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-item>
      <!-- Validation Menu -->
      <q-item clickable v-if="props.plate.approvalStatus === 'APPROVAL_NOT_SET'">
        <q-item-section avatar>
          <q-icon color="primary" name="outlined_flag"/>
        </q-item-section>
        <q-item-section>Validation</q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right"/>
        </q-item-section>

        <q-menu anchor="top end" self="top start">
          <q-list dense>
            <q-item clickable v-if="props.plate.validationStatus === 'VALIDATION_NOT_SET'" @click="validate()">
              <q-item-section avatar>
                <q-icon color="positive" name="check_circle"/>
              </q-item-section>
              <q-item-section>Validate</q-item-section>
            </q-item>
            <q-item clickable v-if="props.plate.validationStatus === 'VALIDATION_NOT_SET'" @click="invalidate()">
              <q-item-section avatar>
                <q-icon color="negative" name="cancel"/>
              </q-item-section>
              <q-item-section>Invalidate</q-item-section>
            </q-item>
            <q-item clickable v-if="props.plate.validationStatus !== 'VALIDATION_NOT_SET'" @click="resetValidation()">
              <q-item-section avatar>
                <q-icon color="primary" name="horizontal_rule"/>
              </q-item-section>
              <q-item-section>Reset Validation</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-item>

      <!-- Approval Menu -->
      <q-item clickable
              v-if="props.plate.approvalStatus === 'APPROVAL_NOT_SET' && props.plate.validationStatus === 'VALIDATED'">
        <q-item-section avatar>
          <q-icon color="primary" name="outlined_flag"/>
        </q-item-section>
        <q-item-section>Approval</q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right"/>
        </q-item-section>

        <q-menu anchor="top end" self="top start">
          <q-list dense>
            <q-item clickable @click="approve()">
              <q-item-section avatar>
                <q-icon color="positive" name="check_circle"/>
              </q-item-section>
              <q-item-section>Approve</q-item-section>
            </q-item>
            <q-item clickable @click="disapprove()">
              <q-item-section avatar>
                <q-icon color="negative" name="cancel"/>
              </q-item-section>
              <q-item-section>Disapprove</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-item>

      <q-separator/>

      <q-item clickable @click="calculatePlate()">
        <q-item-section avatar>
          <q-icon name="calculate"/>
        </q-item-section>
        <q-item-section>Calculate plate</q-item-section>
      </q-item>

      <q-item dense clickable @click="fitCurves()">
        <q-item-section avatar>
          <q-icon name="show_chart"/>
        </q-item-section>
        <q-item-section>Fit Dose-Response Curves</q-item-section>
      </q-item>

      <q-item clickable @click="linkPlate()">
        <q-item-section avatar>
          <q-icon name="playlist_add"/>
        </q-item-section>
        <q-item-section>Link Plate Template</q-item-section>
      </q-item>

      <q-item clickable @click="openPlateInspector()">
        <q-item-section avatar>
          <q-icon color="primary" name="info"/>
        </q-item-section>
        <q-item-section>Plate Inspector</q-item-section>
      </q-item>

      <q-separator/>

      <q-item clickable @click="deletePlate()">
        <q-item-section avatar>
          <q-icon color="negative" name="delete"/>
        </q-item-section>
        <q-item-section>Delete Plate</q-item-section>
      </q-item>
    </q-list>

    <invalidate-dialog v-model:show="showInvalidateDialog" :plateId="props.plate.id"/>
    <approve-dialog v-model:show="showApproveDialog" :plateId="props.plate.id"/>
    <disapprove-dialog v-model:show="showDisapproveDialog" :plateId="props.plate.id"/>
    <calculate-plate-dialog v-model:show="showCalculateDialog" :plateId="props.plate.id"/>
    <link-plate-dialog v-model:show="showLinkDialog" :plateId="props.plate.id"/>
    <delete-dialog v-model:show="showDeleteDialog" :id="props.plate.id" :name="props.plate.barcode"
                   :objectClass="'plate'"/>
  </q-menu>
</template>

<script setup>
import InvalidateDialog from "@/components/plate/InvalidateDialog";
import DisapproveDialog from "@/components/plate/DisapproveDialog";
import ApproveDialog from "@/components/plate/ApproveDialog";
import CalculatePlateDialog from "@/components/plate/CalculatePlateDialog";
import LinkPlateDialog from "@/components/plate/LinkPlateDialog";
import DeleteDialog from "@/components/widgets/DeleteDialog";

import {ref} from "vue";
import {useStore} from 'vuex'

const store = useStore();
const props = defineProps(['plate']);

const showInvalidateDialog = ref(false);
const showApproveDialog = ref(false);
const showDisapproveDialog = ref(false);
const showCalculateDialog = ref(false);
const showLinkDialog = ref(false);
const showDeleteDialog = ref(null);

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
  })
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

const fitCurves = () => {
  store.dispatch()
}

const linkPlate = () => {
  showLinkDialog.value = true;
}

const deletePlate = () => {
  showDeleteDialog.value = true;
}

const chart = (type, plateId) => {
  store.dispatch('ui/addChartView', {'type': type, "plateId": plateId})
}
</script>
