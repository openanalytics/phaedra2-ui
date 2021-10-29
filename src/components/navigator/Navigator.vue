<template>
  <q-drawer show-if-above side="left" bordered v-model="drawerVisible" :mini="!drawerOpen" :mini-width="60">
    
    <q-toolbar class="bg-grey-3">
      <q-toolbar-title v-show="drawerOpen">
        Navigator
      </q-toolbar-title>
      <q-btn dense flat round icon="settings" v-show="drawerOpen"/>
      <q-btn dense flat round :icon="drawerIcon" @click="toggleDrawer"/>
    </q-toolbar>

    <q-tree
        :nodes="navTree"
        node-key="label"
        v-show="drawerOpen"
    >
      <!-- Template for links (header: "link") -->
      <template v-slot:header-link="prop">
        <div class="row items-center" style="padding-left: 8px;">
          <q-icon :name="prop.node.icon" size="28px" class="q-mr-sm text-primary" />
          <div class="text-weight-bold">
            <router-link :to="{ name: prop.node.route }" class="nav-link">{{ prop.node.label }}</router-link>
          </div>
        </div>
      </template>

      <!-- Template for folders (header: "category") -->
      <template v-slot:header-category="prop">
        <div class="row items-center">
          <q-icon :name="prop.node.icon || 'folder'" size="28px" class="q-mr-sm text-primary" />
          <div class="text-weight-bold">{{ prop.node.label }}</div>
        </div>
      </template>

      <!-- Template for projects (header: "project") -->
      <template v-slot:header-project="prop">
        <router-link v-if="prop.node.id === 'new'" :to="{ name: 'newProject', params: { id: prop.node.id } }" class="nav-link">
          <q-icon name="add" class="text-primary" />
          {{ prop.node.label }}
        </router-link>
        <router-link v-else :to="{ name: 'project', params: { id: prop.node.id } }" class="nav-link">
          <q-icon name="folder" class="text-primary" />
          {{ prop.node.label }}
        </router-link>
      </template>

      <!-- Template for protocols (header: "protocols") -->
      <template v-slot:header-protocol="prop">
        <router-link v-if="prop.node.id === 'new'" :to="{ name: 'newProtocol', params: { id: prop.node.id } }" class="nav-link">
          <q-icon name="add" class="text-primary" />
          {{ prop.node.label }}
        </router-link>
        <router-link v-else :to="{ name: 'protocol', params: { id: prop.node.id } }" class="nav-link">
          <q-icon name="ballot" class="text-primary" />
          {{ prop.node.label }}
        </router-link>
      </template>
    </q-tree>
  </q-drawer>
</template>

<style lang="scss">
  .nav-link {
    text-decoration: none;
    color: black;
  }
</style>

<script>
  import {ref, computed} from 'vue'
  import {useStore} from 'vuex'

  export default {
    methods: {
      toggleDrawer() {
        this.drawerOpen = !this.drawerOpen;
        this.drawerIcon = this.drawerIcons[this.drawerOpen];
        this.$emit("onDrawerToggled");
      }
    },
    setup() {
      const store = useStore()

      const navTree = computed(() => {

        // Projects
        let projects = [{
          header: "project",
          label: "New Project...",
          id: "new",
        }];
        const allProjects = store.getters['projects/getAll']().map(project => {
          return {
            header: "project",
            label: project.name,
            id: project.id,
            owner: project.team
          }
        })
        allProjects.forEach(prj => {
          projects.push(prj);
        })

        // Protocols
        let protocols = [{
          header: "protocol",
          label: "New Protocol...",
          id: "new",
        }];
        const allProtocols = store.getters['protocols/getAll']().map(protocol => {
          return {
            header: "protocol",
            label: protocol.name,
            id: protocol.id,
            version: protocol.version
          }
        })
        allProtocols.forEach(prot => {
          protocols.push(prot);
        })

        return [
          {
            label: "Dashboard",
            header: "link",
            route: 'dashboard',
            icon: 'home'
          },
          {
            label: "Projects",
            header: "category",
            children: projects
          },
          {
            label: "Protocols",
            header: "category",
            icon: 'ballot',
            children: protocols
          },
          {
            label: "Data Capture",
            header: "category",
            icon: 'scanner',
            children: [
              {
                label: "Capture Jobs",
                header: "link",
                icon: 'list_alt',
                route: 'dataCaptureJobs',
              }
            ]
          },
        ]
      })

      store.dispatch('projects/loadAll')
      store.dispatch('protocols/loadAll')

      return {
        drawerIcons: {
          true: "chevron_left",
          false: "chevron_right"
        },
        selected: ref(null),
        drawerVisible: ref(true),
        drawerOpen: ref(true),
        drawerIcon: ref("chevron_left"),
        navTree
      }
    }
  }
</script>
