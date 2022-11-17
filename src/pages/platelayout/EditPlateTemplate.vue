<template>
  <div class="q-pa-md" v-if="props.show">
    <oa-section-header :title="'Edit Template'" :icon="'edit'"/>
    <div class="row col-12 q-pa-md oa-section-body">
      <q-card-section class="row" style="min-width: 95vw">
        <div class="col col-5">
          <q-input v-model="templateStore.template.name" square autofocus label="Name"></q-input><br>
          <q-btn flat label="Cancel" color="primary" @click="$emit('update:show',false)"/>
        </div>
        <div class="col col-1">

        </div>
        <div class="col col-4">
          <q-input v-model="templateStore.template.description" square label="Description"></q-input><br>
          <router-link :to="'/template/' + templateStore.template.id" class="nav-link">
            <q-btn label="Edit template" v-close-popup color="primary" @click="editPlateTemplate" />
          </router-link>
        </div>
      </q-card-section>
    </div>
  </div>
</template>

<script setup>
import OaSectionHeader from "../../components/widgets/OaSectionHeader";
import {useTemplateStore} from "@/stores/template";

const templateStore = useTemplateStore()

const props = defineProps(["show"])
const emit = defineEmits(["update:show"])

const editPlateTemplate = () => {
  templateStore.saveTemplate()
  emit('update:show', false)
}
</script>
