<template>
    <q-table
        table-header-class="text-white bg-primary"
        :rows="protocols"
        :columns="columns"
        :pagination="{ rowsPerPage: 10 }"
        class="full-width"
        square
        flat
        dense
        selection="single"
        v-model:selected="selected"
        :loading="loading"
    >
        <template v-slot:header="props">
            <q-tr :props="props" class="text-white bg-primary">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.label }}
                </q-th>
            </q-tr>
        </template>
        <template v-slot:body="props">
            <q-tr class="cursor-pointer" :props="props" @click="props.selected = !props.selected">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <span v-if="!(col.name === 'select')">{{col.value }}</span>
                </q-td>
            </q-tr>
        </template>
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