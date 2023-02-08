<template>
    <q-breadcrumbs class="oa-breadcrumb">
        <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
        <q-breadcrumbs-el :label="'Pipelines'" icon="route"/>
    </q-breadcrumbs>

    <q-page class="oa-root-div">
        <div class="q-pa-md">
            <oa-section-header title="Pipelines" icon="route"/>
            <div class="row q-pa-md oa-section-body">
                <q-table
                    table-header-class="text-grey"
                    flat dense
                    :rows="pipelines"
                    :columns="columns"
                    row-key="id"
                    class="full-width"
                    :pagination="{ rowsPerPage: 20, sortBy: 'name' }"
                    :filter="filter"
                    :filter-method="filterMethod"
                    :loading="loading"
                    @row-click="(e, row) => router.push('/pipeline/' + row.id)"
                    >
                    <template v-slot:top-right>
                        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
                            <template v-slot:append>
                                <q-icon name="search"/>
                            </template>
                        </q-input>
                    </template>
                    <template v-slot:body-cell-name="props">
                        <q-td :props="props">
                            <router-link :to="'/pipeline/' + props.row.id" class="nav-link">
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
                    <template v-slot:body-cell-status="props">
                        <q-td :props="props">
                            <StatusLabel :status="props.row.status" />
                        </q-td>
                    </template>
                </q-table>
            </div>
        </div>
    </q-page>
</template>

<script setup>
    import {ref, computed} from 'vue';
    import {useStore} from 'vuex';
    import {useRouter} from "vue-router";
    import FilterUtils from "@/lib/FilterUtils.js"
    import FormatUtils from "@/lib/FormatUtils.js"
    import UserChip from "@/components/widgets/UserChip";
    import StatusLabel from "@/components/widgets/StatusLabel";
    import OaSectionHeader from "@/components/widgets/OaSectionHeader";

    const store = useStore();
    const router = useRouter();
    const loading = ref(true);
    const filter = ref('');
    const filterMethod = FilterUtils.defaultTableFilter();

    const pipelines = computed(() => store.getters['pipelines/getAllPipelines']());
    store.dispatch('pipelines/loadAllPipelines').then(() => { loading.value = false });

    const columns = ref([
        {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
        {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
        {name: 'version', align: 'left', label: 'Version', field: 'versionNumber', sortable: true},
        {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
        {name: 'createdOn', align: 'left', label: 'Created On', field: 'createdOn', sortable: true, format: FormatUtils.formatDate},
        {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
        {name: 'status', align: 'center', label: 'Status', field: 'status'},
    ]);
</script>