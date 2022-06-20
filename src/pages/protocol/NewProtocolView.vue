<template>
  <q-page class="oa-root-div">
    <div class="q-pa-md">
      <oa-section-header :title="'New Protocol'" :icon="'ballot'"/>
      <div class="row q-pa-md oa-section-body">
        <q-form class="col" @submit="onSubmit" @reset="onReset">
          <q-input v-model="newProtocol.name" label="Name: "></q-input>
          <q-input v-model="newProtocol.description" label="Description: "></q-input>
          <q-select v-model="newProtocol.lowWelltype" label="Low well type:" :options="wellTypeOptions"></q-select>
          <q-select v-model="newProtocol.highWelltype" label="High well type:" :options="wellTypeOptions"></q-select>

          <div class="row justify-end q-pt-md">
            <router-link :to="{ name: 'browseProtocols' }" class="nav-link">
              <q-btn label="Cancel" type="reset" color="primary" flat class="a-ml-sm on-right"></q-btn>
            </router-link>
            <router-link :to="{ name: 'importProtocol' }" class="nav-link">
              <q-btn label="Import From File..." color="primary" class="on-left"/>
            </router-link>
            <q-btn label="Save" type="submit" color="primary"></q-btn>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import OaSectionHeader from "../../components/widgets/OaSectionHeader";
import {useStore} from "vuex";
import {ref} from "vue";
import {useRouter} from "vue-router";

const store = useStore();
const router = useRouter();

const name = "NewProtocolView";
const wellTypeOptions = ['LC', 'HC', 'NC', 'PC'];

const newProtocol = ref({
  name: null,
  description: null,
  editable: true,
  inDevelopment: true,
  lowWelltype: null,
  highWelltype: null,
  createdOn: null,
  createdBy: null
});

const onSubmit = () => {
  newProtocol.value.createdOn = new Date();
  console.log(newProtocol.value);
  store.dispatch("protocols/saveProtocol", newProtocol.value)
      .then(protocol => {
        router.push({path: '/protocol/' + protocol?.id});
      })
}

const onReset = () => {
  newProtocol.value.name = null
  newProtocol.value.description = null
  newProtocol.value.editable = true
  newProtocol.value.inDevelopment = true
  newProtocol.value.lowWelltype = null
  newProtocol.value.highWelltype = null
  newProtocol.value.createdOn = null
  newProtocol.value.createdBy = null
}
</script>
