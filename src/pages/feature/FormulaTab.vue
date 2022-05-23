<template>
  <div class="row q-col-gutter-md" v-if="props.formula">
    <div class="col-6">
      <div class="row">
        <div class="col-3 text-weight-bold">Name:</div>
        <div class="col">{{ props.formula.name }}</div>
      </div>
      <div class="row">
        <div class="col-3 text-weight-bold">Description:</div>
        <div class="col">{{ props.formula.description }}</div>
      </div>
      <div class="row">
        <div class="col-3 text-weight-bold">Category:</div>
        <div class="col">{{ props.formula.category }}</div>
      </div>
      <div class="row">
        <div class="col-3 text-weight-bold">Language:</div>
        <div class="col">{{ props.formula.language }}</div>
      </div>
      <div class="row">
        <div class="col-3 text-weight-bold">Name:</div>
        <div class="col">{{ props.formula.scope }}</div>
      </div>

    </div>
    <div class="col-6">
      <div class="row">
        <div class="col-3 text-weight-bold">Id:</div>
        <div class="col">{{ props.formula.id }}</div>
      </div>
      <div class="row">
        <div class="col-3 text-weight-bold">Created by:</div>
        <div class="col">{{ props.formula.createdBy }}</div>
      </div>
      <div class="row">
        <div class="col-3 text-weight-bold">Created on:</div>
        <div class="col">{{ props.formula.createdOn }}</div>
      </div>
      <div class="row">
        <div class="col-3 text-weight-bold">Updated on:</div>
        <div class="col">{{ props.formula.updatedOn }}</div>
      </div>
    </div>
  </div>
  <br>
  <div class="q-pt-md" style="max-height: 750px" v-if="props.formula">
    <div class="col-3 text-weight-bold">Formula:</div><br>
    <p style="border: 3px solid gray;padding: 1em;white-space: pre-line;" class="text-italic" >{{props.formula.formula}}</p>
    <span class="text-grey text-caption">
                        Input variables: {{ formulaInputs.length > 0 ? formulaInputs : 'None' }}
                    </span>
  </div>

</template>

<script setup>
import {useStore} from "vuex";
import {computed} from "vue";

const store = useStore()

const props = defineProps({
  formula: Object
})

const formulaInputs = computed(() => {
  return store.getters['calculations/getFormulaInputs'](props.formula.id) || []
})

</script>