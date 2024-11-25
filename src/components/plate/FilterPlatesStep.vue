<template>
  <div class="row q-pb-sm" style="font-size: 16px">
    <span>Step 2/3: Select the plates to export.</span>
  </div>
  <q-separator class="q-mb-md" />
  <div class="q-pa-xs">
    <q-checkbox
      v-model="filterPlates.filterOnValidation"
      label="Filter on validation"
      dense
    />
    <q-input
      v-model="filterPlates.validationFilter.username"
      label="Validated by"
      class="q-pb-sm"
      dense
      :disable="!filterPlates.filterOnValidation"
      size="10"
    />
    <div class="row">
      <q-input
        v-model="filterPlates.validationFilter.validationDate.start"
        mask="date"
        label="Validated from"
        class="col q-pb-sm q-pr-sm"
        dense
        :disable="!filterPlates.filterOnValidation"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="filterPlates.validationFilter.validationDate.start"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        v-model="filterPlates.validationFilter.validationDate.end"
        mask="date"
        label="Validated to"
        class="col q-pb-sm q-pl-sm"
        dense
        :disable="!filterPlates.filterOnValidation"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="filterPlates.validationFilter.validationDate.end"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
  </div>
  <div class="q-pa-xs">
    <q-checkbox
      v-model="filterPlates.filterOnApproval"
      label="Filter on approval"
      dense
    />
    <q-input
      v-model="filterPlates.approvalFilter.username"
      label="Approved by"
      class="q-pb-sm"
      dense
      :disable="!filterPlates.filterOnApproval"
    />
    <div class="row">
      <q-input
        v-model="filterPlates.approvalFilter.approvalDate.start"
        mask="date"
        label="Approved from"
        class="col q-pb-sm q-pr-sm"
        dense
        :disable="!filterPlates.filterOnApproval"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="filterPlates.approvalFilter.approvalDate.start">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        v-model="filterPlates.approvalFilter.approvalDate.end"
        mask="date"
        label="Approved to"
        class="col q-pb-sm q-pl-sm"
        dense
        :disable="!filterPlates.filterOnApproval"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="filterPlates.approvalFilter.approvalDate.end">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
  </div>
  <div class="q-pa-xs">
    <div>
      <q-checkbox
        v-model="filterPlates.includeInvalidatedPlates"
        label="Include invalidated plates"
        dense
      />
    </div>
    <div>
      <q-checkbox
        v-model="filterPlates.includeDisapprovedPlates"
        label="Include disapproved plates"
        dense
      />
    </div>
  </div>
</template>
<script setup>
const filterPlates = defineModel("filterPlates", { required: true });
</script>
