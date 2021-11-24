<template>
  <div class="q-pa-md" v-if="props.show">
    <div class="row text-h6 items-center q-px-sm oa-section-title">
      <q-icon name="edit" class="q-mr-sm"/>
      Edit Protocol
    </div>
    <div class="row col-12 q-pa-md oa-section-body">
      <q-card-section class="row" style="min-width: 95vw">
        <div class="col col-5">
          <q-input v-model="editedProtocol.name" square autofocus label="Name"></q-input><br>
          <q-btn flat label="Cancel" color="primary" @click="$emit('update:show',false)"/>
        </div>
        <div class="col col-1">

        </div>
        <div class="col col-4">
          <q-input v-model="editedProtocol.description" square label="Description"></q-input><br>
          <router-link :to="'/protocol/' + protocol.id" class="nav-link">
            <q-btn label="Edit protocol" v-close-popup color="primary" @click="editProtocol" />
          </router-link>
        </div>
      </q-card-section>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProtocolEdit',
  methods: {
    editProtocol() {
      //Should pass full protocol for put request
      this.editedProtocol.id = this.protocol.id
      this.editedProtocol.editable = this.protocol.editable
      this.editedProtocol.inDevelopment = this.protocol.inDevelopment
      this.editedProtocol.lowWelltype = this.protocol.lowWelltype
      this.editedProtocol.highWelltype = this.protocol.highWelltype
      this.$store.dispatch('protocols/editProtocol', this.editedProtocol)
      this.$emit('update:show',false)
    }
  },
  setup(props) {
    return {
      props
    }
  },
  data() {
    return {
      editedProtocol: {
        name: null,
        description: null
      },
      editdialog: this.props.show
    }
  },
  props: ['show', 'protocol'],
  emits: ['update:show']
}
</script>