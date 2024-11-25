<template>
  <q-dialog v-model="showDialog" persistent @hide="clearData">
    <q-card style="min-width: 30vw">
      <q-card-section
        class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary"
      >
        <q-avatar icon="delete" color="primary" text-color="white" />
        Delete {{ objectClass }}
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-10">
            <span
              >Are you sure you want to delete the {{ objectClass }}(s)
              <b v-for="(item, i) in items" :key="i"
                ><br />
                - {{ item.name || item.barcode }}</b
              >?</span
            ><br />
            <span
              >Type <span style="font-weight: bold">delete </span> and press the
              button to confirm:</span
            ><br />
            <q-input dense v-model="confirmationValue" autofocus />
            <br />
            <span class="text-accent"
              >WARNING: The {{ objectClass }} and associated data will be
              deleted!</span
            >
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" @click="clearData" v-close-popup />
        <q-btn
          :label="'Delete ' + objectClass"
          color="accent"
          v-if="'delete' === confirmationValue"
          v-close-popup
          @click="confirmDelete"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

const props = defineProps(["objectClass", "show", "items"]);
const emit = defineEmits(["onDeleted", "update:show"]);

onMounted(() => {
  confirmationValue.value = null;
});

const showDialog = computed({
  get: () => props.show,
  set: (v) => emit("update:show", v),
});
const confirmationValue = ref(null);

const confirmDelete = () => {
  switch (props.objectClass) {
    case "project":
      break;
    case "experiment":
      break;
    case "plate":
      break;
    case "protocol":
      break;
    case "template":
      break;
    case "feature":
      break;
    case "formula":
      store.dispatch("calculations/deleteFormula", props.items[0].id);
      break;
  }
  emit("onDeleted");
};

const clearData = () => {
  confirmationValue.value = null;
};
</script>