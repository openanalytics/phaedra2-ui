<template>
    <div>
        <div class="row">
            <div>
                <q-badge class="q-mr-xs" v-for="pa in projectAccess" :key="pa.id">
                    {{ pa.teamName }} ({{ pa.accessLevel }}) <q-btn size="xs" flat dense icon-right="close" v-show="!readOnly" @click="askRemoveAccess(pa)"/>
                </q-badge>
                <q-btn class="q-mb-xs" icon="add" size="xs" v-show="!readOnly" @click="showAddAccessDialog = true" round dense>
                    <q-tooltip :delay="500" class="text-black bg-secondary">Add Team Access</q-tooltip>
                </q-btn>
            </div>
        </div>

        <q-dialog v-model="showAddAccessDialog">
            <q-card style="min-width: 30vw">
                <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
                    <q-icon name="group" class="q-pr-sm"/>Add Team Access
                </q-card-section>
                <q-card-section>
                    <q-select v-model="newAccess.teamName" :options="teamNames" label="Team" />
                    <q-select v-model="newAccess.accessLevel" :options="accessLevels" label="Access Level" />
                </q-card-section>
                <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn label="Add" v-close-popup color="primary" @click="addAccess" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="confirmRemoveAccess">
            <q-card>
                <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
                    <q-icon name="group" class="q-pr-sm"/>Remove Team Access
                </q-card-section>
                <q-card-section class="row items-center">
                    <span>Are you sure you want to remove <b>{{accessToRemove.accessLevel}}</b> access for team <b>{{accessToRemove.teamName}}</b> from this project?</span>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn label="Remove" color="primary" v-close-popup @click="removeAccess" />
                    <q-btn flat label="Cancel" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup>
import {ref, computed} from "vue";
import {useUserInfoStore} from "@/stores/userinfo";

const props = defineProps(['projectAccess', 'readOnly'])
const emits = defineEmits(['addAccess', 'removeAccess'])
const userInfoStore = useUserInfoStore()

const projectAccess = computed(() => props.projectAccess)

const userInfo = computed(() => userInfoStore.userInfo);
const teamNames = computed(() => userInfo.value.teams);
const accessLevels = ref(["Read", "Write", "Admin"]);

const showAddAccessDialog = ref(false);
const newAccess = ref({});
const addAccess = () => {
  console.log(JSON.stringify(newAccess.value))
  emits('addAccess', newAccess.value)
}

const confirmRemoveAccess = ref(false);
const accessToRemove = ref(null);
const askRemoveAccess = (projectAccess) => {
  accessToRemove.value = projectAccess;
  confirmRemoveAccess.value = true;
}

const removeAccess = () => {
  emits('removeAccess', accessToRemove.value)
}
</script>
