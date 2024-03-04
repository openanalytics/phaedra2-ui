<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="oa-header">
        <q-btn flat round dense icon="menu" @click="drawer = !drawer"/>
        <q-toolbar-title>
          <q-img :src="publicPath + 'OALogo.png'" width="30px"/>
          Phaedra 2.0
        </q-toolbar-title>
<!--        <q-btn dense flat round icon="menu"/>-->
        <UserInfoButton />
      </q-toolbar>
    </q-header>

    <q-drawer
        v-model="drawer"
        show-if-above

        :width="250"
        :breakpoint="500"
        bordered>
      <Navigator></Navigator>
    </q-drawer>
    <q-page-container>
      <Splitpanes class="default-theme" @resize="updatePanelSizes">
        <Pane :size="100 - (navigatorSize + sidePanelSize)" style="background-color: #ffffff;">
          <div style="max-height: calc(100vh - 50px); overflow: auto;">
            <router-view :key="$route.fullPath"></router-view>
          </div>
        </Pane>
        <Pane :size="sidePanelSize" style="background-color: #ffffff;">
          <SidePanel/>
        </Pane>
      </Splitpanes>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss">
  @import 'src/css/oa.global';
</style>

<script setup>
  import {computed, ref, watch} from 'vue'
  import {useStore} from 'vuex'
  import { publicPath } from '../vue.config'
  import { Splitpanes, Pane } from 'splitpanes'

  import SidePanel from "@/components/widgets/SidePanel.vue"
  import Navigator from "@/components/navigator/Navigator.vue"
  import UserInfoButton from "@/components/widgets/UserInfoButton.vue"

  const store = useStore();
  const drawer = ref(false)
  const miniState = ref( true)
  const navigatorSize = ref(0);
  const sidePanelSize = ref(0);
  const showSidePanel = computed(() => store.getters['ui/isShowSidePanel']());
  watch(showSidePanel, (show) => {
      sidePanelSize.value = show ? 15 : 0;
  });
  const updatePanelSizes = (events) => {
    navigatorSize.value = events[0].size;
    sidePanelSize.value = events[2].size;
  }
</script>
