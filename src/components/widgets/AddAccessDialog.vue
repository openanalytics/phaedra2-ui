<template>
  <q-dialog v-model="showDialog">
    <q-card style="min-width: 30vw">
      <q-card-section
        class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary"
      >
        <q-icon name="group" class="q-pr-sm" />Add Team Access
      </q-card-section>
      <q-card-section>
        <q-select
          v-model="newAccess.teamName"
          :options="teamNames"
          label="Team"
        />
        <q-select
          v-model="newAccess.accessLevel"
          :options="accessLevels"
          label="Access Level"
        />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn label="Add" v-close-popup color="primary" @click="addAccess" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref } from "vue";
import { useUserInfoStore } from "@/stores/userinfo";

const props = defineProps(["show", "projects"]);
const emits = defineEmits(["addAccess", "update:show"]);

const showDialog = computed({
  get: () => props.show,
  set: (v) => {
    emits("update:show", v);
    newAccess.value = { teamName: null, accessLevel: null };
  },
});

const newAccess = ref({ teamName: null, accessLevel: null });

const userInfoStore = useUserInfoStore();
const userInfo = computed(() => userInfoStore.userInfo);

const teamNames = computed(() => userInfo.value.teams);
const accessLevels = ref(["Read", "Write", "Admin"]);

const addAccess = () => {
  emits("addAccess", newAccess.value);
};
</script>
