<template>
  <oa-section-header :title="'Formula: '+ formula.name" :icon="'functions'"/>
    <div class="q-pa-sm text-black text-body2 shadow-1 bg-white" style="min-width: 30vw">
        <div class="row">
            <div class="col-3 text-weight-bold">ID:</div>
            <div class="col">{{ formula.id }}</div>
        </div>
        <div class="row">
            <div class="col-3 text-weight-bold">Description:</div>
            <div class="col">{{ formula.description }}</div>
        </div>
        <div class="row">
            <div class="col-3 text-weight-bold">Category:</div>
            <div class="col">{{ formula.category }}</div>
        </div>
        <div class="row">
            <div class="col-3 text-weight-bold">Language:</div>
            <div class="col">{{ formula.language }}</div>
        </div>
        <div class="row">
            <div class="col-3 text-weight-bold">Scope:</div>
            <div class="col">{{ formula.scope }}</div>
        </div>
        <div class="row">
            <div class="col-3 text-weight-bold">Created By:</div>
            <div class="col">{{ formula.createdBy }}</div>
        </div>
        <div class="row">
            <div class="col-3 text-weight-bold">Created On:</div>
            <div class="col">{{ FormatUtils.formatDate(formula.createdOn) }}</div>
        </div>
        <div class="row">
            <div class="col-3 text-weight-bold">Updated On:</div>
            <div class="col">{{ FormatUtils.formatDate(formula.updatedOn) }}</div>
        </div>
        <div class="q-pt-md">
            <q-input v-model="formula.formula" label="Formula" type="textarea" outlined square ></q-input>
            <span class="text-grey text-caption">
                Input variables: {{formulaInputs.length > 0 ? formulaInputs : 'None'}}
            </span>
        </div>
    </div>
</template>

<script>
    import {computed} from 'vue'
    import {useStore} from 'vuex'
    import FormatUtils from "@/lib/FormatUtils";
    import OaSectionHeader from "./OaSectionHeader";

    export default {
        props: {
            formulaId: Number
        },
      components: {OaSectionHeader},
        setup(props) {
            const exported = {};
            
            const store = useStore();
            exported.formula = computed(() => (store.getters['calculations/getFormula'](props.formulaId) || {}));

            exported.formulaInputs = computed(() => { return store.getters['calculations/getFormulaInputs'](props.formulaId) || [] })
            store.dispatch('calculations/getFormulaInputs', props.formulaId);

            exported.FormatUtils = FormatUtils;
            return exported;
        }
    }
</script>
