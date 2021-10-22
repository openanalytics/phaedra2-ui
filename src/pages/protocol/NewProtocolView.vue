<template>
  <q-breadcrumbs class="breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
    <q-breadcrumbs-el :label="'New protocol'" />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-md">
      <div class="q-px-sm oa-section-title">
        <div class="text-h6">Create new protocol</div>
      </div>

      <div class="row q-pa-lg oa-section-body">
        <q-form class="col col-4" @submit="onSubmit" @reset="onReset">
          <q-input v-model="newProtocol.name" label="Name: "></q-input>
          <q-input v-model="newProtocol.description" label="Description: "></q-input>
          <q-select v-model="newProtocol.lowWelltype" label="Low well type:" :options="wellTypeOptions"></q-select>
          <q-select v-model="newProtocol.highWelltype" label="High well type:" :options="wellTypeOptions"></q-select>

          <div class="row justify-start q-pt-md">
            <q-toggle v-model="newProtocol.editable" label="Is editable:"/>
            <q-toggle v-model="newProtocol.inDevelopment" label="Is in development:"/>
          </div>

          <div class="row justify-end q-pt-md">
            <q-btn label="Save" type="submit" color="primary"></q-btn>
            <q-btn label="Cancel" type="reset" color="primary" flat class="a-ml-sm"></q-btn>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  name: "NewProtocolView",
  methods: {
    onSubmit() {
      this.newProtocol.createdOn = new Date();
      console.log(this.newProtocol)
      axios.post('http://localhost:6030/phaedra/protocol-service/protocols', this.newProtocol)
          .then(response => {
            this.$store.commit('protocols/cacheProtocol', response.data)
            const protocolId = response.data.id
            this.$router.push({ name: 'protocol', params: { id: protocolId } })
          })
    },
    onReset() {
      this.newProtocol.name = null
      this.newProtocol.description = null
      this.newProtocol.editable = true
      this.newProtocol.inDevelopment = true
      this.newProtocol.lowWelltype = null
      this.newProtocol.highWelltype = null
      this.newProtocol.createdOn = null
      this.newProtocol.createdBy = null
    }
  },
  setup() {
    return {
      wellTypeOptions: ['LC', 'HC']
    }
  },
  data() {
    return {
      newProtocol: {
        name: null,
        description: null,
        editable: true,
        inDevelopment: true,
        lowWelltype: null,
        highWelltype: null,
        createdOn: null,
        createdBy: 'sasa.berberovic'
      }
    }
  }
}
</script>

<style lang="scss">
  @import "src/css/oa.global";
</style>
