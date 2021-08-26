<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <!--<q-img src="phaedra128.png" style="height: 32px; max-width: 32px" />-->
        <q-btn dense flat round icon="menu" />
        <q-toolbar-title>
          Phaedra 2.0
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above side="left" bordered v-model="drawerVisible" :mini="!drawerOpen" :mini-width="60" >
        <Navigator @onDrawerToggled="toggleDrawer"></Navigator>
    </q-drawer>

    <q-page-container>
        <q-page padding>
            <div>Main panel</div>
        </q-page>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>Footer</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
import { ref } from 'vue'
import Navigator from "@/components/navigator/Navigator.vue"

export default {
  components: {
    Navigator
  },
  setup () {
    const drawerVisible = ref(true);
    const drawerOpen = ref(true);
    return {
      drawerVisible,
      drawerOpen,
      toggleDrawer () {
        drawerOpen.value = !drawerOpen.value
      }
    }
  }
}
</script>