<template>
    <oa-table
        :rows="protocols"
        :columns="columns"
        v-model:selected="selected"
        selection="single">
    </oa-table>
</template>

<script setup>
    import {ref} from "vue";
    import protocolsGraphQlAPI from "@/api/graphql/protocols"
    import OaTable from "@/components/table/OaTable.vue";

    const props = defineProps(['protocolId'])

    const protocols = ref([])
    const loading = ref(true)

    const selected = ref([]);
    const columns = [
      {name: 'id', align: 'left',label: 'ID', field: 'id', sortable: true},
      {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
      {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
    ]

    const fetchProtocols = async () => {
      const data = await protocolsGraphQlAPI.protocols()
      protocols.value = data.protocols
      loading.value = false
    }

    //TODO: Implement onError
    // const {onResult, onError} = protocolsGraphQlAPI.protocols()
    // onResult(({data}) => {
    //   protocols.value = data.protocols
    //   loading.value = false
    // })

    fetchProtocols()
</script>
