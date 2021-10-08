<template>
  <q-breadcrumbs class="breadcrumb" v-if="protocol">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
    <q-breadcrumbs-el :label="protocol.name" icon="folder" />
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-md">
      <div class="q-px-sm oa-section-title">
        <div class="text-h6">{{ protocol.name }}</div>
      </div>

      <div class="row col-4 q-pa-lg oa-section">
        <div class="col col-4">
          <div class="row">
            <div class="col-3 text-weight-bold">ID:</div>
            <div class="col">{{ protocol.id }}</div>
          </div>
          <div class="row">
            <div class="col-3 text-weight-bold">Description:</div>
            <div class="col">{{ protocol.description }}</div>
          </div>
          <div class="row">
            <div class="col-3 text-weight-bold">Low Well Type:</div>
            <div class="col">{{ protocol.lowWelltype }}</div>
          </div>
          <div class="row">
            <div class="col-3 text-weight-bold">High Well Type:</div>
            <div class="col">{{ protocol.highWelltype }}</div>
          </div>
          <div class="row">
            <div class="col-3 text-weight-bold">Editable:</div>
            <div class="col">{{ protocol.editable }}</div>
            <div class="col-3 text-weight-bold">In Development:</div>
            <div class="col">{{ protocol.inDevelopment }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="q-pa-md">
      <div class="q-px-sm oa-section-title">
        <div class="text-h6">Features</div>
      </div>
      <q-table>
        <template v-slot:top-right>
          <q-btn dense color="primary" label="Add feature">
          </q-btn>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import {computed} from "vue";

export default {
  name: "ProtocolView",
  setup() {
    const store = useStore()
    const route = useRoute()

    const protocolId = parseInt(route.params.id);
    const protocol = computed(() => store.getters['protocols/getById'](protocolId))

    return {
      protocolId: protocolId,
      protocol: protocol
    }
  }

}
</script>

<style lang="scss">
  @import "src/css/oa.global";

</style>
