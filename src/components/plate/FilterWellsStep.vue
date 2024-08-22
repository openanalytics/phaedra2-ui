<template>
  <div class="row q-pb-md" style="font-size: 16px">
    <span>Step 3/4: Set well and/or substance filters.</span>
  </div>
  <q-separator class="q-mb-md"/>
<!--  <div class="q-pa-xs">-->
<!--    <span>Filter by substance:</span>-->
<!--    <div class="row">-->
<!--      <div class="col-5">-->
<!--      <q-input v-model="substanceName" label="Substance name"-->
<!--               class="q-pb-sm q-pr-sm" size="10" dense/>-->
<!--      </div>-->
<!--      <div class="col-5">-->
<!--      <q-input v-model="substanceType" label="Substance type"-->
<!--               class="q-pb-sm q-pr-sm" size="10" dense/>-->
<!--      </div>-->
<!--      <div class="col-2 flex items-center">-->
<!--        <q-btn size="xs" icon="add" color="primary" style="text-align: center" @click="addSubstance" round dense/>-->
<!--      </div>-->
<!--    </div>-->
<!--    <div>-->
<!--      <q-list dense>-->
<!--        <q-item v-for="(substance, index) in wellFilter.substances" :key="index">-->
<!--          <q-item-section>-->
<!--            <q-item-label>{{ substance.name + " " + substance.type }}</q-item-label>-->
<!--          </q-item-section>-->
<!--          <q-item-section side>-->
<!--            <q-btn @click="removeSubstance(index)" icon="delete" color="negative"/>-->
<!--          </q-item-section>-->
<!--        </q-item>-->
<!--      </q-list>-->
<!--    </div>-->
<!--  </div>-->
  <div class="q-pa-xs">
    <div>
      <q-checkbox v-model="wellFilter.includeRejectedWells" label="Include rejected wells" dense/>
    </div>
  </div>
  <q-separator class="q-mb-md q-mt-md"/>
  <div class="q-pa-xs">
    <div class="q-mb-md">
      <span>Filter by well type:</span>
    </div>
    <div class="row">
      <q-option-group v-model:="wellFilter.wellTypes"
                      :options="wellTypeOptions" type="checkbox" inline dense/>
    </div>
  </div>
</template>
<script setup>
import {ref} from "vue";

const wellFilter = defineModel('wellFilter', {required: true})
console.log("filterPlates: " + JSON.stringify(wellFilter.value))

const wellTypeOptions = ref([
  {label: 'SAMPLE', value: 'SAMPLE'},
  {label: 'NC', value: 'NC'},
  {label: 'PC', value: 'PC'},
  {label: 'LC', value: 'LC'},
  {label: 'HC', value: 'HC'}
])

const substanceName = ref(null)
const substanceType = ref(null)

const addSubstance = () => {
    if (substanceName.value || substanceType.value)
    wellFilter.value.substances.push({name: substanceName.value ?? "", type: substanceType.value ?? ""})
}

const removeSubstance = (index) => {
  wellFilter.value.substances.splice(index, 1)
}

</script>
