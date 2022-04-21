<template>
  <q-breadcrumbs class="oa-breadcrumb">
    <q-breadcrumbs-el icon="home" :to="{ name: 'dashboard'}" />
    <q-breadcrumbs-el :label="'Protocols'" icon="list"/>
  </q-breadcrumbs>

  <q-page class="oa-root-div">
    <div class="q-pa-md">
      <oa-section-header :title="'Protocols'" :icon="'ballot'"/>
      <div class="row q-pa-md oa-section-body">
        <q-table
            table-header-class="text-grey"
            flat
            :rows="protocols"
            :columns="columns"
            row-key="id"
            class="full-width"
            :pagination="{ rowsPerPage: 20, sortBy: 'name' }"
            :filter="filter"
            :filter-method="filterMethod"
            @row-click="selectProtocol"
        >
          <template v-slot:top-left>
            <router-link :to="{ name: 'newProtocol' }" class="nav-link">
              <q-btn size="sm" icon="add" color="primary" label="New Protocol..."/>
            </router-link>
          </template>
          <template v-slot:top-right>
            <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>
          <template v-slot:body-cell-tags="props">
            <q-td :props="props">
              <TagList :objectInfo="props.row" :objectClass="'PROTOCOL'" :readOnly="true"/>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import {ref, computed} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import FilterUtils from "@/lib/FilterUtils.js"
import FormatUtils from "@/lib/FormatUtils.js"

import TagList from "@/components/tag/TagList";
import OaSectionHeader from "../../components/widgets/OaSectionHeader";

export default {
  components: {
    TagList,
    OaSectionHeader
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const loading = ref(true);

    const protocols = computed(() => store.getters['protocols/getAll']());
    store.dispatch('protocols/loadAll').then(() => {
      loading.value = false
    });

    const columns = ref([
      {name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true},
      {name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true},
      {name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true},
      {name: 'tags', align: 'left', label: 'Tags', field: 'tags', sortable: true},
      {
        name: 'createdOn',
        align: 'left',
        label: 'Created On',
        field: 'createdOn',
        sortable: true,
        format: FormatUtils.formatDate
      },
      {name: 'createdBy', align: 'left', label: 'Created By', field: 'createdBy', sortable: true},
      {name: 'menu', align: 'left', field: 'menu', sortable: false}
    ]);

    const selectProtocol = (event, row) => {
      router.push("/protocol/" + row.id);
    };

    return {
      protocols,
      columns,
      filter: ref(''),
      filterMethod: FilterUtils.defaultTableFilter(),
      selectProtocol
    }
  }
}
</script>
