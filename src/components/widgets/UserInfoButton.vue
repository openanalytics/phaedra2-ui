<template>
    <div style="min-height: 20px;" @mouseover="toggleEditBtn(true)" @mouseleave="toggleEditBtn(false)">
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
                <span class="text-h6">Teams</span>
                <q-list>
                    <q-item v-for="role in roles" :key="role">
                        <q-icon color="primary" name="group" class="on-left" />
                        {{role}}
                    </q-item>
                </q-list>
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

            store.dispatch('userinfo/loadUserInfo').then();
            exported.userInfo = computed(() => store.getters['userinfo/getUserInfo']());
            
            // Example
            // exported.userInfo = computed(() => {
            //     return {
            //         fullName: "Tester McTest",
            //         claims: { realm_access: {"roles":["default-roles-phaedra2","offline_access","uma_authorization","phaedra2-user","phaedra2-admin"]} }
            //     }
            // });

            exported.roles = computed(() => {
                return exported.userInfo.value.claims.realm_access.roles.filter(role => role.startsWith("phaedra2-")).sort();
            });

            exported.showDialog = ref(false);
            return exported;
        }
    }
</script>
