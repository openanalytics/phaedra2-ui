<template>
    <q-page class="oa-root-div">
        <div class="q-pa-md">
            <div class="row text-h6 items-center q-px-md oa-section-title">
                <q-icon name="functions" class="on-left"/>
                Calculation Formulae
            </div>
            <div class="row q-pa-lg oa-section-body">
                <q-table
                    table-header-class="text-grey"
                    class="full-width"
                    flat
                    :rows="formulae"
                    :columns="columns"
                    row-key="id"
                    :pagination="{ rowsPerPage: 20, sortBy: 'id' }"
                    :filter="filter"
                    :filter-method="filterMethod"
                >
                    <template v-slot:top-left>
                        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </template>
                    <template v-slot:top-right>
                        <q-btn size="sm" color="primary" icon="add" label="New Formula..." @click="createNewFormula"/>
                    </template>
                    <template v-slot:body-cell-name="props">
                        <q-td :props="props" class="cursor-pointer" @click="selectFormula(props.row)">
                            <q-chip square dense>
                            {{props.row.name}}
                            </q-chip>
                        </q-td>
                    </template>
                    <template v-slot:body-cell-menu="props">
                        <q-td :props="props">
                            <div class="row items-center cursor-pointer">
                                <q-btn flat round icon="more_horiz" size="sm" style="border-radius: 50%;">
                                    <q-menu fit>
                                        <q-list dense style="min-width: 100px">
                                            <q-item clickable :to="'/calc/formula/' + props.row.id">
                                                <q-item-section><q-icon name="info"/></q-item-section>
                                                <q-item-section>Details</q-item-section>
                                            </q-item>
                                            <q-item clickable @click="deleteFormula(props.row)">
                                                <q-item-section><q-icon name="delete"/></q-item-section>
                                                <q-item-section>Delete</q-item-section>
                                            </q-item>
                                        </q-list>
                                    </q-menu>
                                </q-btn>
                            </div>
                        </q-td>
                    </template>
                </q-table>
            </div>
        </div>
    </q-page>
    <DeleteFormulaDialog :ref="el => deleteDialog = el"/>
</template>

<script>
    import {computed, ref} from 'vue'
    import {useStore} from 'vuex'
    import {useRouter} from 'vue-router'
    import FormatUtils from "@/lib/FormatUtils.js"
    import DeleteFormulaDialog from "@/pages/calculation/formulae/DeleteFormulaDialog.vue"

    export default {
        components: {
            DeleteFormulaDialog
        },
        setup() {
            const exported = {};

            const store = useStore()
            store.dispatch('calculations/getAllFormulas');
            exported.formulae = computed(() => store.getters['calculations/getFormulas']());

            exported.columns = [
                {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
                {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
                {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
                {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},

                {name: 'category', align: 'left', label: 'Category', field: 'category', sortable: true},
                {name: 'scope', align: 'left', label: 'Scope', field: 'scope', sortable: true},
                {name: 'language', align: 'left', label: 'Language', field: 'language', sortable: true},
                {name: 'formula', align: 'left', label: 'Formula', field: 'formula', sortable: true,
                    format: val => val ? FormatUtils.formatTextMaxLength(val, 50) : ''},

                {name: 'menu', align: 'left', field: 'menu', sortable: false}
            ];

            exported.filter = ref('')
            exported.filterMethod = function(rows, term) {
                return rows.filter(row => {
                    for (const field in row) {
                        const stringValue = String(row[field]);
                        if (stringValue && stringValue.toLowerCase().includes(term.toLowerCase())) return true;
                    }
                    return false;
                })
            }

            const router = useRouter();
            exported.selectFormula = (row) => {
                router.push("/calc/formula/" + row.id);
            }

            exported.createNewFormula = () => {
                router.push("/calc/formula/0");
            }

            exported.deleteDialog = ref(null)
            exported.deleteFormula = (row) => {
                exported.deleteDialog.value.openDialog(row);
            }

            return exported;
        }
    }
</script>