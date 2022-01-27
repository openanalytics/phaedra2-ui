<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar class="oa-header">
        <q-img :src="publicPath + 'OALogo.png'" width="40px"/>
        <q-toolbar-title>
          Phaedra 2.0
        </q-toolbar-title>
        <q-btn dense flat round icon="menu"/>
        <q-btn flat round dense icon="person"/>
        <span>{{userinfo.fullName}}</span>
      </q-toolbar>
    </q-header>

    <Navigator></Navigator>

    <q-page-container>
      <router-view :key="$route.fullPath"></router-view>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss">
  @import 'src/css/oa.global';
</style>

<script>
  import {computed} from 'vue'
  import {useStore} from 'vuex'
  import { publicPath } from '../vue.config'
  
  import Navigator from "@/components/navigator/Navigator.vue"

  export default {
    components: {
      Navigator
    },
    setup() {
      const store = useStore();

      store.dispatch('userinfo/loadUserInfo').then();
      const userinfo = computed(() => store.getters['userinfo/getUserInfo']());

      return { publicPath, userinfo }
    }
  }
</script>