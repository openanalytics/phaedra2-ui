<template>
  <!-- <q-drawer show-if-above side="left" bordered v-model="drawerVisible" :mini="!drawerOpen" :mini-width="60"> -->
  <div>
    <q-toolbar class="bg-grey-3">
      <q-toolbar-title v-show="drawerOpen">
        Navigator
      </q-toolbar-title>
      <!-- <q-btn dense flat round icon="settings" v-show="drawerOpen"/> -->
      <!-- <q-btn dense flat round :icon="drawerIcon" @click="toggleDrawer"/> -->
    </q-toolbar>

    <q-tree
        :nodes="navTree"
        node-key="label"
        v-show="drawerOpen"
    >
      <!-- Default template -->
      <template v-slot:default-header="prop">
        <div class="row items-center">
          <q-icon :name="prop.node.icon" size="28px" class="q-mr-sm text-primary"/>
          <div>
            <router-link :to="{ name: prop.node.route }" class="nav-link">{{ prop.node.label }}</router-link>
          </div>
        </div>
      </template>

      <!-- Template for top-level links, e.g. Dashboard (header: "link") -->
      <template v-slot:header-link="prop">
        <div class="row items-center" style="padding-left: 8px;">
          <q-icon :name="prop.node.icon" size="28px" class="q-mr-sm text-primary"/>
          <div class="text-weight-bold">
            <router-link :to="{ name: prop.node.route }" class="nav-link">{{ prop.node.label }}</router-link>
          </div>
        </div>
      </template>

      <!-- Template for folders (header: "category") -->
      <template v-slot:header-category="prop">
        <div class="row items-center">
          <q-icon :name="prop.node.icon || 'folder'" size="28px" class="q-mr-sm text-primary"/>
          <div class="text-weight-bold">{{ prop.node.label }}</div>
        </div>
      </template>

      <!-- Template for templates (header: "template") -->
      <template v-slot:header-template="prop">
        <router-link v-if="prop.node.id === 'new'" :to="{ name: 'newPlateTemplate', params: { id: prop.node.id } }"
                     class="nav-link">
          <q-icon name="add" class="text-primary"/>
          {{ prop.node.label }}
        </router-link>
        <router-link v-else :to="{ name: 'template', params: { id: prop.node.id } }" class="nav-link">
          <q-icon name="border_outer" class="text-primary"/>
          {{ prop.node.label }}
        </router-link>
      </template>
    </q-tree>
    <!-- </q-drawer> -->
  </div>
</template>

<style lang="scss">
.nav-link {
  text-decoration: none;
  color: black;
}
</style>

<script setup>
import {ref, computed, onMounted, onUpdated} from 'vue'
import navigatorDef from '@/assets/navigator.json'
import {useUserInfoStore} from "@/stores/userinfo";

const userStore = useUserInfoStore()
userStore.loadUserInfo()

const drawerIcons = {
  true: "chevron_left",
  false: "chevron_right"
}
const drawerOpen = ref(true)
const drawerIcon = ref("chevron_left")

const toggleDrawer = () => {
  drawerOpen.value = !drawerOpen.value;
  drawerIcon.value = drawerIcons[drawerOpen];
  emit("onDrawerToggled");
}

const filterNavigatorByRole = () => {
  if (userStore.isAdmin)
    return navigatorDef
  else
    return navigatorDef.filter(node => node.role === 'user')
}

const navTree = computed(() => filterNavigatorByRole())
</script>
