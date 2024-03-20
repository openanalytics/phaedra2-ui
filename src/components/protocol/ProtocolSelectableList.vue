<template>
    <q-table
        table-header-class="text-grey"
        square flat dense
        hide-selected-banner
        :rows="protocols"
        :columns="columns"
        :pagination="{ rowsPerPage: 10, sortBy: 'name' }"
        selection="single"
        v-model:selected="selected"
        :loading="loading"
    >
    </q-table>
</template>

<script setup>
    import {ref} from "vue";
    import protocolsGraphQlAPI from "@/api/graphql/protocols"

    const loading = ref(true);
    const protocols = ref([])

    //TODO: Implement onError
    const {onResult, onError} = protocolsGraphQlAPI.protocols()
    onResult(({data}) => {
      protocols.value = data.protocols
      loading.value = false
    })

    const selected = ref([]);
    const columns = [
        {name: 'id', align: 'left',label: 'ID', field: 'id', sortable: true},
        {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
        {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
    ]
</script>
