<template>
    <q-dialog v-model="showDialog" persistent>
        <q-card style="min-width: 30vw">
            <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
                <q-avatar icon="delete" color="primary" text-color="white"/> Delete Formula
            </q-card-section>
            <q-card-section>
                <div class="row">
                    <div class="col-10">
                    <span>Are you sure you want to delete the formula <b>{{formulaToDelete.name}}</b>?</span><br/>
                    <br>
                    <span class="text-accent">WARNING: There may be features referencing this formula!</span>
                    </div>
                </div>
            </q-card-section>
            <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup/>
                <q-btn label="Delete Formula" color="accent" v-close-popup @click="confirmDelete"/>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import {ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'

const store = useStore();
const router = useRouter();

const showDialog = ref(false);
const formulaToDelete = ref(null);

const openDialog = (formula) => {
  formulaToDelete.value = formula;
  showDialog.value = true;
}

const confirmDelete = async () => {
  await store.dispatch('calculations/deleteFormula', formulaToDelete.value.id);
  await router.push("/calc/formulae");
}
</script>
