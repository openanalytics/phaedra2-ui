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
                >
                    <template v-slot:top-left>
                        <div class="action-button">
                            <q-btn size="sm" color="primary" icon="add" label="New..." @click="showNewConfigDialog = true"/>
                        </div>
                    </template>
                    <template v-slot:top-right>
                        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
                            <template v-slot:append>
                            <q-icon name="search"/>
                            </template>
                        </q-input>
                    </template>
                    <template v-slot:body-cell-menu="props">
                        <q-td :props="props">
                            <q-btn flat round icon="info" size="sm" @click="router.push(`/datacapture/render-config/${props.row.id}`)" />
                            <q-btn flat round icon="delete" size="sm" @click="deleteConfig(props.row.id)" />
                        </q-td>
                    </template>
                </q-table>
            </div>
        </div>
    </q-page>

    <CreateRenderConfigDialog v-model="showNewConfigDialog"/>
    <DeleteRenderConfigDialog v-model="showDeleteConfigDialog" :id="configIdToDelete"/>
</template>
  
<script setup>
    import {ref, computed} from 'vue'
    import {useStore} from 'vuex'
    import {useRouter} from "vue-router"
    import FilterUtils from "@/lib/FilterUtils.js"
    import OaSectionHeader from "@/components/widgets/OaSectionHeader";
    import CreateRenderConfigDialog from "@/components/image/CreateRenderConfigDialog";
    import DeleteRenderConfigDialog from "@/components/image/DeleteRenderConfigDialog";

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
        {name: 'channels', align: 'left', label: 'Channels', field: row => row.config?.channelConfigs?.length, sortable: true},
        {name: 'menu', align: 'left', field: 'menu', sortable: false}
    ]);

    const filter = ref('');
    const filterMethod = FilterUtils.defaultTableFilter();

    const showNewConfigDialog = ref(false);
    const showDeleteConfigDialog = ref(false);
    const configIdToDelete = ref(0);
    const deleteConfig = (id) => {
        configIdToDelete.value = id;
        showDeleteConfigDialog.value = true;
    }
</script>