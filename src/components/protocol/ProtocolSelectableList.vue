<template>
    <q-table
        :rows="protocols"
        :columns="columns"
        :pagination="{ rowsPerPage: 5, sortBy: 'name' }"
        :filter="filter"
        v-model:selected="selected"
        selection="single"
        virtual-scroll
        style="max-height: 400px"
        table-header-class="text-grey"
        square flat dense>
      <template v-slot:top-left>
        <div class="row">
          <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
        </div>
      </template>
    </q-table>
</template>

<script setup>
    import {ref} from "vue";
    import protocolsGraphQlAPI from "@/api/graphql/protocols"

    const protocols = ref([])
    const filter = ref('')
    const loading = ref(true)

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

    const filterMethod = (tableRows, terms) => {
      if (terms.length === 0) return tableRows;
      const correctRows = tableRows.filter(row => row.id === terms[0].id);
      return correctRows.filter(row => row.name === terms[0].name);
    }
</script>
