<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar class="oa-header">
        <q-img :src="publicPath + 'OALogo.png'" width="40px"/>
        <q-toolbar-title>
          Phaedra 2.0
        </q-toolbar-title>
        <q-btn dense flat round icon="menu"/>
        <UserInfoButton />
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
  import { publicPath } from '../vue.config'
  
  import Navigator from "@/components/navigator/Navigator.vue"
  import UserInfoButton from "@/components/widgets/UserInfoButton.vue"

  export default {
    components: {
      Navigator,
      UserInfoButton
    },
    setup() {
      return { publicPath }
    }
  }
</script>