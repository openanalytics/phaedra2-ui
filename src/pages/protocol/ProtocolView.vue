<template>
  <q-breadcrumbs class="breadcrumb" v-if="protocol">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
    <q-breadcrumbs-el :label="protocol.name" icon="ballot" />
  </q-breadcrumbs>

  <q-page class="oa-root-div" :style-fn="pageStyleFnForBreadcrumbs">
    <div class="q-pa-md">
      <div class="row text-h6 items-center q-px-md oa-section-title">
        <q-icon name="ballot" class="q-pr-sm"/>{{ protocol.name }}
      </div>

      <div class="row col-4 q-pa-md oa-section-body">
        <div class="col col-6 q-gutter-xs">
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
          <div class="row">
            <div class="col-3 text-weight-bold">Tags:</div>
            <div class="col">
              <div class="tag-icon flex inline" v-for="tag in protocol.tags" :key="tag.tag">
                <Tag :tagInfo="tag"></Tag>
              </div>
            </div>
          </div>
        </div>
        <div class="col col-6">
          <div class="row justify-end action-button">
            <q-btn size="sm" color="primary" label="Edit"/>
          </div>
          <div class="row justify-end action-button">
            <q-btn size="sm" color="primary" label="Delete"/>
          </div>
          <div class="row justify-end action-button">
            <q-btn size="sm" color="primary" label="Add Tag" @click="prompt = true"/>
          </div>
        </div>
      </div>
    </div>

<!--    <div class="q-pa-md">-->
<!--      <div class="row text-h6 items-center q-px-md oa-section-title">-->
<!--        <q-icon name="functions" class="q-pr-sm"/>Features-->
<!--      </div>-->
<!--      <q-table square>-->
<!--        <template v-slot:top-right>-->
<!--          <q-btn color="primary" label="Add Feature..." @click="openFeatureDialog = true"></q-btn>-->
<!--        </template>-->
<!--        <template v-slot:no-data>-->
<!--            <div class="full-width row text-info">-->
<!--                <span>No features to show.</span>-->
<!--            </div>-->
<!--        </template>-->
<!--      </q-table>-->
<!--    </div>-->
    <FeatureList :protocol="protocol"></FeatureList>

    <q-dialog v-model="prompt" persistent>
      <q-card>
        <q-card-section style="min-width: 350px">
          <div class="text-h6">Tag:</div>
        </q-card-section>

        <q-card-section>
          <q-input dense v-model="protocolTag" autofocus @keyup.enter="prompt = false" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add tag" v-close-popup @click="onClick" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="openFeatureDialog" persistent class="q-gutter-sm">
      <q-card style="min-width: 800px">
        <q-card-section>
          <div class="text-h6">Add new feature: </div>
        </q-card-section>

        <q-card-section class="row">
          <div class="col col-7">
            <q-input v-model="newFeature.name" square autofocus label="Name"></q-input>
            <q-input v-model="newFeature.alias" square label="Alias"></q-input>
            <q-input v-model="newFeature.description" square label="Description"></q-input>
            <q-input v-model="newFeature.format" square label="Format" placeholder="#.##" style="width: 100px"></q-input>
          </div>
          <div class="col col-1">

          </div>
          <div class="col col-4">
            <q-select v-model="newFeature.type" square label="Type" :options="featureTypes"></q-select>
            <q-input v-model="newFeature.sequence" square label="Sequence"></q-input>
            <q-select v-model="newFeature.formulaId" square label="Formula" :options="formulas" option-value="id" option-label="name"></q-select>
            <q-input v-model="newFeature.trigger" square label="Trigger"></q-input>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup color="primary" />
          <q-btn label="Add feature" v-close-popup color="primary" @click="addFeature" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import {computed, ref} from "vue";

import Tag from "@/components/tag/Tag";

export default {
  name: "ProtocolView",
  components: {
    Tag
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    const protocolId = parseInt(route.params.id);
    const protocol = computed(() => store.getters['protocols/getById'](protocolId))
    if (!store.getters['protocols/isLoaded'](protocolId)) {
      store.dispatch('protocols/loadById', protocolId)
    }
    store.dispatch('protocols/loadProtocolsTags', protocolId)

    const formulas = computed(() => store.getters['calculations/getFormulas']())

    return {
      protocolId,
      protocol,
      featureTypes: ['CALCULATION', 'NORMALIZATION', 'RAW'],
      formulas
    }
  },
  data() {
    return {
      protocolTag: ref(""),
      prompt: ref(false),
      openFeatureDialog: ref(false),
      newFeature: {
        name: null,
        alias: null,
        description: null,
        format: null,
        type: null,
        sequence: 0,
        protocolId: this.protocolId,
        formulaId: null,
        trigger: null
      }
    }
  },
  methods: {
    onClick() {
      const tagInfo = {
        objectId: this.protocol.id,
        objectClass: "PROTOCOL",
        tag: this.protocolTag
      }

      this.$store.dispatch('protocols/tagProtocol', tagInfo)
    },
    addFeature() {
      this.$store.dispatch('protocols/addNewFeature', this.newFeature)
    }
  }

}
</script>

<style lang="scss">
  @import "src/css/oa.global";

</style>
