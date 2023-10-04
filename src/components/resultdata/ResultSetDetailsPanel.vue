<template>
    <q-card style="width: 1000px; max-width: 80vw;">
        <q-card-section class="bg-primary text-white">
            <div class="text-h6">
                Result Set Details
            </div>
        </q-card-section>

        <q-card-section class="q-pa-md q-gutter-sm">
            <div class="row">
                <div class="col-6">
                    <div class="row">
                        <q-field label="ID" stack-label borderless dense>
                            <template v-slot:control>
                                {{ resultSet.id }}
                            </template>
                        </q-field>
                    </div>
                    <div class="row">
                        <q-field label="Calculated On" stack-label borderless dense>
                            <template v-slot:control>
                                {{ FormatUtils.formatDate(resultSet.executionStartTimeStamp) }}
                            </template>
                        </q-field>
                    </div>
                    <div class="row">
                        <q-field label="Outcome" stack-label borderless dense>
                            <template v-slot:control>
                                <StatusLabel :status="resultSet.outcome" />
                            </template>
                        </q-field>
                    </div>
                </div>
                <div class="col-6">
                    <div class="row">
                        <q-field label="Measurement" stack-label borderless dense>
                            <template v-slot:control>
                                {{ (store.getters['measurements/getById'](resultSet.measId) || {}).name }}
                            </template>
                        </q-field>
                    </div>
                    <div class="row">
                        <q-field label="Protocol" stack-label borderless dense>
                            <template v-slot:control>
                                {{ (protocol || {}).name }}
                            </template>
                        </q-field>
                    </div>
                </div>
            </div>
        </q-card-section>
        <q-card-section class="bg-primary text-white q-py-sm">
            <q-icon name="functions" class="on-left"/>
            Features
        </q-card-section>
        <q-card-section class="q-pa-md q-gutter-sm">
            <q-table
                table-header-class="text-grey"
                flat dense
                :rows="featureRows"
                :columns="featureColumns"
            >
<!--                <template v-slot:body-cell-statusCode="props">-->
<!--                    <q-td :props="props">-->
<!--                        <StatusLabel :status="props.row.statusCode" />-->
<!--                    </q-td>-->
<!--                </template>-->
            </q-table>
        </q-card-section>
        <q-card-section class="bg-primary text-white q-py-sm">
            <q-icon name="error_outline" class="on-left"/>
            Errors
        </q-card-section>
        <q-card-section class="q-pa-md q-gutter-sm">
            <q-table
                table-header-class="text-grey"
                flat dense
                :rows="resultSet.errors || []"
                :columns="errorColumns"
            >
            </q-table>
        </q-card-section>
    </q-card>
</template>

<script setup>
    import {computed, ref} from "vue";
    import {useStore} from "vuex";
    import FormatUtils from "@/lib/FormatUtils.js";
    import StatusLabel from "@/components/widgets/StatusLabel"
    import protocolsGraphQlAPI from "@/api/graphql/protocols";
    import resultdataGraphQlAPI from "@/api/graphql/resultdata"

    const props = defineProps({ resultSet: Object });
    const store = useStore();

    const protocol = ref(null)
    protocolsGraphQlAPI.protocolById(props.resultSet.protocolId).then(result => {
      protocol.value = result
    })
    const resultSetFeatureStats = resultdataGraphQlAPI.resultSetFeatureStats(props.resultSet.id)

    const featureRows = computed(() => (protocol.value?.features || []).map(f => {
      const featureStats = resultSetFeatureStats.value.filter(rd => rd.featureId == f.id) || {};
      const result = { 'name': f.name, 'stats': featureStats }
      return result
    }));

    const featureColumns = ref([
        {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
        // {name: 'statusCode', align: 'left', label: 'Status', field: 'statusCode', sortable: true },
        {name: 'zprime', align: 'left', label: 'Z-Prime', sortable: true, field: row => (row.stats.find(s => s.statisticName == 'zprime' && s.welltype == null) || {}).value },
        {name: 'mean', align: 'left', label: 'Mean', sortable: true, field: row => (row.stats.find(s => s.statisticName == 'mean' && s.welltype == null) || {}).value },
        {name: 'stdev', align: 'left', label: 'St.Dev', sortable: true, field: row => (row.stats.find(s => s.statisticName == 'stdev' && s.welltype == null) || {}).value },
    ]);

    const errorColumns = ref([
        {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
        {name: 'feature', align: 'left', label: 'Feature', field: 'featureName', sortable: true },
        {name: 'formula', align: 'left', label: 'Formula', field: 'formulaName', sortable: true },
        {name: 'civSource', align: 'left', label: 'Column', field: 'civSource', sortable: true },
    ]);

</script>
