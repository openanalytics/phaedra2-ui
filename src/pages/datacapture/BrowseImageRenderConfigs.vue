<template>
    <q-page class="oa-root-div">
        <div class="q-pa-md">
            <oa-section-header title="Image Render Configurations" icon="palette"/>
            <div class="row q-pa-md oa-section-body">
                <q-table
                    class="full-width"
                    table-header-class="text-grey"
                    flat
                    :rows="configs"
                    :columns="columns"
                    row-key="id"
                    :loading="loading"
                    :pagination="{ rowsPerPage: 20, sortBy: 'name' }"
                    :filter="filter"
                    :filter-method="filterMethod"
                    @row-click="(e, row) => router.push('/datacapture/render-config/' + row.id)"
                >
                    <template v-slot:top-right>
                        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
                            <template v-slot:append>
                            <q-icon name="search"/>
                            </template>
                        </q-input>
                    </template>
                </q-table>
            </div>
        </div>
    </q-page>
</template>
  
<script setup>
    import {ref, computed} from 'vue'
    import {useStore} from 'vuex'
    import {useRouter} from "vue-router"
    import FilterUtils from "@/lib/FilterUtils.js"

    import OaSectionHeader from "../../components/widgets/OaSectionHeader";

    const store = useStore();
    const router = useRouter();
    const loading = ref(true);

    const configs = computed(() => store.getters['measurements/getRenderConfigs']());
    store.dispatch('measurements/loadAllRenderConfigs').then(() => { loading.value = false });

    const columns = ref([
        {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
        {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
        {name: 'gamma', align: 'left', label: 'Gamma', field: row => row.config.gamma, sortable: true},
        {name: 'scale', align: 'left', label: 'Scale', field: row => row.config.scale, sortable: true},
        {name: 'channels', align: 'left', label: 'Channels', field: row => row.config.channelConfigs.length, sortable: true},
    ]);

    const filter = ref('');
    const filterMethod = FilterUtils.defaultTableFilter();
</script>