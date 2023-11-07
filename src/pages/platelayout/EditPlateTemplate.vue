<template>
  <div class="q-pa-sm" v-if="props.show">
    <oa-section title="Edit Template" icon="edit">
      <div class="row q-pa-md">
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
      </div>
    </oa-section>
  </div>
</template>

<script setup>
import OaSection from "@/components/widgets/OaSection";
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
