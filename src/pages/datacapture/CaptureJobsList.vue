<template>
    <q-table
        table-header-class="text-grey"
        dense flat
        :rows="jobs"
        :columns="columns"
        row-key="id"
        :pagination="{ rowsPerPage: 50 }"
        style="width: 100%"
    >
        <template v-slot:body-cell-statusCode="props">
            <q-td :props="props">
                <q-badge v-if="props.row.statusCode === 'Completed'" color="green">{{props.row.statusCode}}</q-badge>
                <q-badge v-if="props.row.statusCode === 'Error'" color="red">{{props.row.statusCode}}</q-badge>
                <q-badge v-if="props.row.statusCode === 'Cancelled'" color="blue">{{props.row.statusCode}}</q-badge>
                <q-badge v-if="props.row.statusCode === 'Submitted'" color="grey">{{props.row.statusCode}}</q-badge>
                <q-badge v-if="props.row.statusCode === 'Running'" color="grey">{{props.row.statusCode}}</q-badge>
            </q-td>
        </template>
    </q-table>
</template>

<script>
    import { computed } from 'vue'
    import { useStore } from 'vuex'

    export default {
        setup() {
            const store = useStore()

            const jobs = computed(() => store.getters['datacapture/getAllJobs']())
            store.dispatch('datacapture/loadAllJobs')

            const columns = [
                { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
                { name: 'createDate', align: 'left', label: 'Created On', field: 'createDate', sortable: true },
                { name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true },
                { name: 'sourcePath', align: 'left', label: 'Source Path', field: 'sourcePath', sortable: true },
                { name: 'statusMessage', align: 'left', label: 'Message', field: 'statusMessage', sortable: true },
                { name: 'statusCode', label: 'Status', field: 'statusCode', sortable: true },
            ]

            return {
                jobs,
                columns
            }
        }
    }
</script>