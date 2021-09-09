<template>
    <q-table
        table-header-class="text-grey"
        dense flat
        :rows="plate.wells"
        :columns="columns"
        row-key="id"
        :pagination="{ rowsPerPage: 50 }"
        :filter="filter"
        :filter-method="filterMethod"
    >
        <template v-slot:top-right>
            <q-input outlined rounded dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
        </template>
        <template v-slot:body-cell-coordinate="props">
            <q-td :props="props">
                {{ WellUtils.getWellCoordinate(props.row.row, props.row.column) }}
            </q-td>
        </template>
        <template v-slot:body-cell-status-accepted="props">
            <q-td :props="props">
                <q-icon name="check_circle" color="positive" />
            </q-td>
        </template>
        <template v-slot:no-data>
            <div class="full-width row text-info">
                <span>No wells to show.</span>
            </div>
        </template>
    </q-table>
</template>

<script>
    import { ref } from 'vue'
    
    import WellUtils from "@/lib/WellUtils.js"

    const columns = [
        { name: 'coordinate', align: 'left', label: 'Coordinate', field: 'coordinate', sortable: true },
        { name: 'wellType', align: 'left', label: 'Well Type', field: 'wellType', sortable: true },
        { name: 'status-accepted', align: 'left', label: 'Accepted', field: 'status-accepted', sortable: true },
    ]

    const filterMethod = function(rows, term) {
        return rows.filter(row => {
            return (row.id == term
                || row.nr == term
                || row.wellType.toLowerCase().includes(term)
            )
        })
    }

    export default {
        props: {
            plate: Object
        },
        setup() {
            return {
                columns,
                filter: ref(''),
                filterMethod,
                WellUtils
            }
        }
    }

</script>
