<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar class="oa-header">
        <q-icon name="img:/OALogo.png" type="image/png" size="40px"/>
        <q-toolbar-title>
          Phaedra 2.0
        </q-toolbar-title>
        <q-btn dense flat round icon="menu"/>
        <q-btn flat round dense icon="person"/>
        <span>TestUser</span>
      </q-toolbar>
    </q-header>

    <Navigator></Navigator>

    <q-page-container>
      <router-view style="background-color: #E6E6E6" :key="$route.fullPath"></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import Navigator from "@/components/navigator/Navigator.vue"
import {useStore} from "vuex";

export default {
  components: {
    Navigator
  },
  setup() {
    const store = useStore()
    store.dispatch('calculations/getAllFormulas')
  }
}
</script>

<style lang="scss">
@import 'src/css/oa.global';


</style>
