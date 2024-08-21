<template>
  <div class="row q-pb-sm" style="font-size: 16px">
    <span>Step 1/3: Select the features to export.</span>
  </div>
  <q-separator class="q-mb-md"/>
  <oa-table :columns="columns" :rows="props.features"
            selection="multiple" v-model:selected="selectedFeatures"
            filterRow/>
</template>
<script setup>
import {ref} from "vue";
import OaTable from "@/components/table/OaTable";

const props = defineProps(["features"])
const selectedFeatures = defineModel('selectedFeatures', {required: true})
const columns = ref([
  {name: 'id', align: 'center', label: 'ID', field: 'id', sortable: true},
  {name: 'name', align: 'center', label: 'Feature', field: 'name', sortable: true},
  {name: 'protocolId', align: 'center', label: 'Protocol ID', field: "protocolId", sortable: true},
  {name: 'protocol', align: 'center', label: 'Protocol', field: "protocol", sortable: true}
])

</script>
