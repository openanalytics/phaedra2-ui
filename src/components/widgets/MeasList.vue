<template>
    <q-table
        table-header-class="text-grey"
        dense flat
        :rows="measurements"
        :columns="columns"
        row-key="id"
        hide-bottom
        :loading="loading"
    >
        <template v-slot:body-cell="props">
            <q-td :props="props" :class="isActiveMeas(props.row.id) ? 'text-black' : 'text-grey'">
                {{props.value}}
            </q-td>
        </template>
        <template v-slot:body-cell-active="props">
            <q-td :props="props">
                <q-icon name="link" v-show="isActiveMeas(props.row.id)"/>
            </q-td>
        </template>
        <template v-slot:body-cell-dimensions="props">
            <q-td :props="props" :class="isActiveMeas(props.row.id) ? 'text-black' : 'text-grey'">
                {{props.row.rows}} x {{props.row.columns}}
            </q-td>
        </template>
        <template v-slot:no-data>
            <div class="full-width row text-info">
                <span>No measurements to show.</span>
            </div>
        </template>
    </q-table>
</template>

<script>
    import { ref, computed, onUnmounted } from 'vue'
    import { useStore } from 'vuex'

    const columns = [
        { name: 'active', align: 'left', label: 'Active?', field: 'active', sortable: true },
        { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
        { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
        { name: 'dimensions', align: 'left', label: 'Dimensions', field: 'dimensions', sortable: true },
        { name: 'wellColumns', align: 'left', label: 'Well Columns', field: 'wellColumns', sortable: true },
        { name: 'subWellColumns', align: 'left', label: 'SubWell Columns', field: 'subWellColumns', sortable: true },
        { name: 'imageChannels', align: 'left', label: 'Image Channels', field: 'imageChannels', sortable: true },
        { name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: val => `${val.toLocaleString()}` },
        { name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true }
    ]

    export default {
        props: {
            plate: Object
        },
        setup(props) {
            const store = useStore()
            const loading = ref(true)
            
            const measurements = computed(() => store.getters['measurements/getByIds'](props.plate.measurementIds))
            store.dispatch('measurements/loadByIds', props.plate.measurementIds)

            const unsubscribe = store.subscribe((mutation) => {
                if (mutation.type == "measurements/cacheMeasurements") {
                    loading.value = false
                }
            })
            onUnmounted(() => {
                unsubscribe()
            })

            const isActiveMeas = function(measId) {
                return props.plate.measurementIds && props.plate.measurementIds[0] == measId;
            }

            return {
                columns,
                measurements,
                loading,
                isActiveMeas
            }
        }
    }

</script>
