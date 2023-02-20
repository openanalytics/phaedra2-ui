<template>
  <div class="q-pa-md" v-if="props.show">
    <oa-section-header :title="'Edit Template'" :icon="'edit'"/>
    <div class="row q-pa-md oa-section-body">
<!--      <q-card-section class="row" style="min-width: 95vw">-->
        <div class="col col-4">
          <q-input label="Name" v-model="templateStore.template.name" stack-label dense autofocus/>
          <q-input label="Description" v-model="templateStore.template.description" stack-label dense/>
          <q-field label="Tags" stack-label dense>
            <template v-slot:control>
              <div class="self-center full-width no-outline">
                <TagList :objectInfo="templateStore.template" :objectClass="'PLATE_TEMPLATE'"/>
              </div>
            </template>
          </q-field>
        </div>
        <div class="col-4">
          <PropertyTable :objectInfo="templateStore.template" :objectClass="'PLATE_TEMPLATE'"/>
        </div>
      <div class="col-4">
        <div class="row justify-end action-button">
          <router-link :to="'/template/' + templateStore.template.id" class="nav-link">
            <q-btn size="sm" label="Save" class="oa-action-button" @click="editPlateTemplate"/>
          </router-link>
        </div>
        <div class="row justify-end action-button">
          <q-btn size="sm" label="Cancel" class="oa-action-button" @click="$emit('update:show',false)"/>
        </div>
      </div>
<!--      </q-card-section>-->
    </div>
  </div>
</template>

<script setup>
import OaSectionHeader from "../../components/widgets/OaSectionHeader";
import {useTemplateStore} from "@/stores/template";
import TagList from "@/components/tag/TagList";
import PropertyTable from "@/components/property/PropertyTable";

const templateStore = useTemplateStore()

const props = defineProps(["show"])
const emit = defineEmits(["update:show"])

const editPlateTemplate = () => {
  templateStore.saveTemplate()
  emit('update:show', false)
}
</script>
