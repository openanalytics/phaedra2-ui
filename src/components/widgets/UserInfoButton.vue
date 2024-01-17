<template>
    <div>
      <q-btn flat round dense icon="person" @click="showDialog = true">
        <q-tooltip>
          {{userInfoStore.userInfo.fullName}}
        </q-tooltip>
      </q-btn>
      <q-btn flat round dense icon="logout" @click="logout">
        <q-tooltip>
          Logout
        </q-tooltip>
      </q-btn>
<!--        <span>{{userInfoStore.userInfo.fullName}}</span>-->
    </div>

    <q-dialog v-model="showDialog">
        <q-card style="min-width: 30vw">
            <q-card-section class="text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
                <q-icon name="person" class="q-pr-sm"/>
                {{userInfoStore.userInfo.fullName}}
            </q-card-section>

            <q-card-section>
                <span class="text-h6 row">Team Memberships</span>
                <q-list>
                    <q-item v-for="team in userInfoStore.userInfo.teams" :key="team">
                        <q-icon color="primary" name="group" class="on-left" />
                        {{team}}
                    </q-item>
                </q-list>
                <span v-show="userInfoStore.userInfo.teams.length === 0" class="text-info">You have no team memberships</span>

                <span class="text-h6 row">Additional Roles</span>
                <div v-show="userInfoStore.userInfo.admin">
                    <q-list>
                        <q-item>
                            <q-icon color="primary" name="manage_accounts" class="on-left" />
                            Administrator
                        </q-item>
                    </q-list>
                </div>
                <span v-show="!userInfoStore.userInfo.admin" class="text-info">You have no additional roles</span>
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
                <q-btn label="Close" v-close-popup flat/>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import {ref} from "vue";
import {useUserInfoStore} from "@/stores/userinfo";

const userInfoStore = useUserInfoStore()
userInfoStore.loadUserInfo()
const showDialog = ref(false);

const logout = () => {
  userInfoStore.logout()
}
</script>
