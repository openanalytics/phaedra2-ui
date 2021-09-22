<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" />
        <q-toolbar-title>
          Phaedra 2.0
        </q-toolbar-title>
        <q-btn flat round dense icon="person" />
        <span>TestUser</span>
      </q-toolbar>
    </q-header>

    <Navigator></Navigator>

    <q-page-container>
        <router-view :key="$route.fullPath"></router-view>
    </q-page-container>

    <!-- <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>Footer</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer> -->

  </q-layout>
</template>

<script>
import Navigator from "@/components/navigator/Navigator.vue"

export default {
  components: {
    Navigator
  }
}
</script>