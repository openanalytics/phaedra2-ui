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
    import {computed, ref} from "vue";
    import {useStore} from "vuex";

    const loading = ref(false);
    const store = useStore();
    const protocols = computed(() => store.getters['protocols/getAll']().sort((p1, p2) => p1.name.localeCompare(p2.name)));
    if (!store.getters['protocols/isLoaded']()) {
        loading.value = true;
        store.dispatch('protocols/loadAll').then(() => loading.value = false);
    }

    const selected = ref([]);
    const columns = [
        {name: 'id', align: 'left',label: 'ID', field: 'id', sortable: true},
        {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
        {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
    ]
</script>