<template>
    <q-breadcrumbs class="oa-breadcrumb">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
        <q-breadcrumbs-el label="Image Render Configurations" icon="list"/>
    </q-breadcrumbs>
    
    <q-page class="oa-root-div">
        <oa-section title="Image Render Configurations" icon="palette" class="q-pa-md">
            <q-table
                class="full-width"
                table-header-class="text-grey"
                flat dense
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
                <template v-slot:body-cell-name="props">
                    <q-td :props="props">
                        <router-link :to="`/datacapture/render-config/${props.row.id}`" class="nav-link">
                            {{ props.row.name }}
                        </router-link>
                    </q-td>
                </template>
                <template v-slot:body-cell-channels="props">
                    <q-td :props="props">
                        <div class="row">
                            <ColorButton class="q-mx-xs" v-for="ch in props.value" :key="ch" :rgb="ch.rgb" :tooltip="ch.name" :editable="false" />
                        </div>
                    </q-td>
                </template>
                <template v-slot:body-cell-createdBy="props">
                    <q-td :props="props">
                        <UserChip :id="props.row.createdBy" />
                    </q-td>
                </template>
                <template v-slot:body-cell-menu="props">
                    <q-td :props="props">
                        <q-btn flat round icon="delete" size="sm" @click="deleteConfig(props.row.id)" />
                    </q-td>
                </template>
            </q-table>
        </oa-section>
    </q-page>

    <CreateRenderConfigDialog v-model="showNewConfigDialog"/>
    <DeleteRenderConfigDialog v-model="showDeleteConfigDialog" :id="configIdToDelete"/>
</template>
  
<script setup>
    import {ref, computed} from 'vue'
    import {useStore} from 'vuex'
    import FilterUtils from "@/lib/FilterUtils.js"
    import FormatUtils from "@/lib/FormatUtils.js"
    import OaSection from "@/components/widgets/OaSection";
    import UserChip from "@/components/widgets/UserChip";
    import ColorButton from "@/components/image/ColorButton";
    import CreateRenderConfigDialog from "@/components/image/CreateRenderConfigDialog";
    import DeleteRenderConfigDialog from "@/components/image/DeleteRenderConfigDialog";

    const store = useStore();
    const loading = ref(true);

    const configs = computed(() => store.getters['measurements/getRenderConfigs']());
    store.dispatch('measurements/loadAllRenderConfigs').then(() => { loading.value = false });

    const columns = ref([
        {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
        {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
        {name: 'channels', align: 'left', label: 'Channels', field: row => row.config?.channelConfigs, sortable: true},
        {name: 'gamma', align: 'left', label: 'Gamma', field: row => row.config.gamma, sortable: true},
        {name: 'scale', align: 'left', label: 'Scale', field: row => row.config.scale, sortable: true},
        {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate },
        {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
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