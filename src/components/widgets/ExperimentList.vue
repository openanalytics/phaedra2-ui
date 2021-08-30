<template>
    <q-table
        title="Experiments"
        :rows="experiments"
        :columns="columns"
        row-key="id"
    >
        <template v-slot:body-cell-name="props">
            <q-td :props="props">
                <div class="row items-center">
                    <q-icon name="folder" class="icon" /> {{props.row.name}}
                </div>
            </q-td>
        </template>    
        <template v-slot:body-cell-tags="props">
            <q-td :props="props">
                <div class="icon flex inline" v-for="tag in props.row.tags" :key="tag.value">
                    <q-badge color="green">
                        {{ tag }}
                    </q-badge>
                </div>
            </q-td>
        </template>
    </q-table>
</template>

<style scoped>
    .icon {
        margin-right: 5px;
    }
</style>

<script>

const columns = [
    { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
    { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
    { name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true },
    { name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: val => `${val.toLocaleString()}` },
    { name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true }
]

export default {
    props: {
        experiments: Object
    },
    setup() {
        return {
            columns
        }
    }
}

</script>
