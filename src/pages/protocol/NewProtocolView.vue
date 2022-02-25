<template>
  <q-breadcrumbs class="breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
    <q-breadcrumbs-el :label="'New Protocol'"/>
  </q-breadcrumbs>

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

<script>
import OaSectionHeader from "../../components/widgets/OaSectionHeader";

export default {
  name: "NewProtocolView",
  components: {OaSectionHeader},
  methods: {
    onSubmit() {
      this.newProtocol.createdOn = new Date();
      console.log(this.newProtocol)
      this.$store.dispatch("protocols/saveProtocol", this.newProtocol)
          .then(protocol => {
            this.$router.push({path: '/protocol/' + protocol?.id});
          });
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
        createdBy: null
      }
    }
  }
}
</script>