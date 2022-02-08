<template>
  <div class="q-pa-md" v-if="props.show">
    <oa-section-header :title="'Edit Protocol'" :icon="'edit'"/>
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
          <router-link :to="'/protocol/' + protocol.id" class="nav-link">
            <q-btn label="Edit protocol" v-close-popup color="primary" @click="editProtocol" />
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
  name: 'EditProtocol',
  components: {OaSectionHeader},
  setup(props) {
    const store = useStore();

    const protocol = computed(() => store.getters['protocols/getCurrentProtocol']());

    const name = ref(protocol.value.name);
    const description = ref(protocol.value.description);
    return {
      props,
      protocol,
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
    editProtocol() {
      this.$store.dispatch('protocols/editProtocol', { name: this.name, description: this.description});
      this.$emit('update:show',false);
    }
  },
  props: ['show'],
  emits: ['update:show']
}
</script>
