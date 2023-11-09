<template>
    <q-breadcrumbs class="oa-breadcrumb">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}"/>
        <q-breadcrumbs-el label="Capture Configurations" icon="settings"/>
    </q-breadcrumbs>
    
    <q-page class="oa-root-div">
        <oa-section title="Capture Configurations" icon="settings" class="q-pa-md">
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
                    <q-btn color="primary" icon="add" size="sm" label="New Config..." @click="router.push('/datacapture/config/new')"/>
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
                        <router-link :to="'/datacapture/config/' + props.row.id" class="nav-link">
                        <div class="row items-center cursor-pointer">
                            {{ props.row.name }}
                        </div>
                        </router-link>
                    </q-td>
                </template>
                <template v-slot:body-cell-createdBy="props">
                    <q-td :props="props">
                        <UserChip :id="props.row.createdBy" />
                    </q-td>
                </template>
                <template v-slot:body-cell-updatedBy="props">
                    <q-td :props="props">
                        <UserChip :id="props.row.updatedBy" />
                    </q-td>
                </template>
                <template v-slot:no-data>
                    <div class="full-width row text-info">
                        <span>No Capture Configurations to show.</span>
                    </div>
                </template>
            </q-table>
        </oa-section>
    </q-page>
</template>
  
<script setup>
    import {ref, computed} from 'vue'
    import {useStore} from 'vuex'
    import {useRouter} from 'vue-router';
    import FilterUtils from "@/lib/FilterUtils.js"
    import FormatUtils from "@/lib/FormatUtils.js"
    import OaSection from "@/components/widgets/OaSection";
    import UserChip from "@/components/widgets/UserChip";

    const store = useStore();
    const router = useRouter();
    const loading = ref(true);

    const configs = computed(() => store.getters['datacapture/getAllCaptureConfigs']());
    store.dispatch('datacapture/loadAllCaptureConfigs').then(() => { loading.value = false });

    const columns = ref([
        {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
        {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
        {name: 'version', align: 'left', label: 'Version', field: 'version', sortable: true},
        {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
        {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate },
        {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
        {name: 'updatedOn', align: 'left', label: 'Updated On', field: 'updatedOn', sortable: true, format: FormatUtils.formatDate},
        {name: 'updatedBy', align: 'left', label: 'Updated By', field: 'updatedBy', sortable: true},
    ]);

    const filter = ref('');
    const filterMethod = FilterUtils.defaultTableFilter();
</script>