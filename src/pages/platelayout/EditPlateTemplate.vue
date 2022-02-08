<template>
  <div class="q-pa-md" v-if="props.show">
    <oa-section-header :title="'Edit Template'" :icon="'edit'"/>
    <div class="row col-12 q-pa-md oa-section-body">
      <q-card-section class="row" style="min-width: 95vw">
        <div class="col col-5">
          <q-input v-model="name" square autofocus label="Name"></q-input><br>
          <q-btn flat label="Cancel" color="primary" @click="$emit('update:show',false)"/>
        </div>
        <div class="col col-1">

        </div>
        <div class="col col-4">
          <q-input v-model="description" square label="Description"></q-input><br>
          <router-link :to="'/template/' + plateTemplate.id" class="nav-link">
            <q-btn label="Edit template" v-close-popup color="primary" @click="editPlateTemplate" />
          </router-link>
        </div>
      </q-card-section>
    </div>
  </div>
</template>

<script>

import {useStore} from "vuex";
import {computed, ref} from "vue";
import OaSectionHeader from "../../components/widgets/OaSectionHeader";

export default {
  name: 'EditPlateTemplate',
  components: {OaSectionHeader},
  setup(props) {
    const store = useStore();

    const plateTemplate = computed(() => store.getters['templates/getCurrentPlateTemplate']());

    const name = ref(plateTemplate.value.name);
    const description = ref(plateTemplate.value.description);
    return {
      props,
      plateTemplate,
      name,
      description
    }
  },
  data() {
    return {
      editdialog: this.props.show
    }
  },
  methods: {
    editPlateTemplate() {
      this.$store.dispatch('templates/updatePlateTemplate', {id: this.plateTemplate.id, name: this.name, description: this.description});
      this.$emit('update:show',false);
    }
  },
  props: ['show'],
  emits: ['update:show']
}
</script>