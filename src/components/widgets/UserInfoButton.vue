<template>
    <div>
        <q-btn flat round dense icon="person" @click="showDialog = true" />
        <span>{{userInfo.fullName}}</span>
    </div>

    <q-dialog v-model="showDialog">
        <q-card style="min-width: 30vw">
            <q-card-section class="text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
                <q-icon name="person" class="q-pr-sm"/>
                {{userInfo.fullName}}
            </q-card-section>
        
            <q-card-section>
                <span class="text-h6 row">Team Memberships</span>
                <q-list>
                    <q-item v-for="team in userInfo.teams" :key="team">
                        <q-icon color="primary" name="group" class="on-left" />
                        {{team}}
                    </q-item>
                </q-list>
                <span v-show="userInfo.teams.length == 0" class="text-info">You have no team memberships</span>

                <span class="text-h6 row">Additional Roles</span>
                <div v-show="userInfo.admin">
                    <q-list>
                        <q-item>
                            <q-icon color="primary" name="manage_accounts" class="on-left" />
                            Administrator
                        </q-item>
                    </q-list>
                </div>
                <span v-show="!userInfo.admin" class="text-info">You have no additional roles</span>
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
                <q-btn label="Close" v-close-popup flat/>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
    import {ref, computed} from "vue";
    import {useStore} from 'vuex'

    export default {
        setup() {
            const exported = {};
            const store = useStore();

            store.dispatch('userinfo/loadUserInfo');
            exported.userInfo = computed(() => store.getters['userinfo/getUserInfo']());
            exported.showDialog = ref(false);
            return exported;
        }
    }
</script>
