<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="showDialog" position="top">
      <q-card style="min-width: 30vw">
        <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
          <q-avatar icon="logout" color="primary" text-color="secondary"/>
          Confirm!
        </q-card-section>
        <q-card-section>
          <span class="q-ml-sm text-h8">Are you sure you want to logout?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Yes" color="primary" v-close-popup @click="handleConfirm"/>
          <q-btn flat label="No" color="primary" v-close-popup @click="$emit('update:show',false)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

</template>

<script setup>

import {computed} from 'vue';
import userinfo from "@/api/userinfo";
// import axios from "axios";

const logoutUrl = userinfo.apiURL + "/logout"
console.log("Logout URL: " + logoutUrl)

const props = defineProps(['show',])
const emit = defineEmits(['onConfirm', 'update:show'])


const showDialog = computed({
  get: () => props.show,
  set: (v) => emit('update:show', v)
})

// const handleLogout = () => {
//   axios.get('https://keycloak.phaedra.poc.openanalytics.io/auth/realms/phaedra2/protocol/openid-connect/logout', {
//     params: {
//       redirect_uri: 'http://localhost:8080/phaedra/ui' // The URL to where you want the user to be redirected after logout
//     }
//   })
//       .then(() => {
//         this.$router.push('/'); // Redirect the user to the login page or wherever you want
//       })
//       .catch(error => console.error(error));
// }

const handleConfirm = () => {
  emit('update:show', false)
  emit('onConfirm');
}
</script>

<style scoped>

</style>
