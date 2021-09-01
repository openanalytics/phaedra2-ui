<template>
    <q-drawer show-if-above side="left" bordered v-model="drawerVisible" :mini="!drawerOpen" :mini-width="60" >
        <q-toolbar class="bg-grey-3">
            <q-toolbar-title v-show="drawerOpen">
                Navigator
            </q-toolbar-title>
            <q-btn dense flat round icon="settings" v-show="drawerOpen" />
            <q-btn dense flat round :icon="drawerIcon" @click="toggleDrawer" />
        </q-toolbar>
        <q-tree :nodes="navTree" node-key="label" v-model:selected="selected" selected-color="primary">
            <template v-slot:header-link="prop">
                <div class="row items-center" style="padding-left: 8px;">
                    <q-icon name="home" color="primary" size="28px" class="q-mr-sm" />
                    <div class="text-weight-bold">
                        <router-link :to="{ name: 'dashboard'}" class="nav-link">{{ prop.node.label }}</router-link>
                    </div>
                </div>
            </template>
            <template v-slot:header-category="prop">
                <div class="row items-center">
                    <q-icon name="folder" color="primary" size="28px" class="q-mr-sm" />
                    <div class="text-weight-bold">{{ prop.node.label }}</div>
                </div>
            </template>
            <template v-slot:header-project="prop">
                <router-link :to="{ name: 'project', params: { id: prop.node.id } }" class="nav-link">{{ prop.node.label }}</router-link>
                <span v-if="prop.node.owner" class="text-green">&nbsp; [{{prop.node.owner}}]</span>
            </template>
        </q-tree>
    </q-drawer>
</template>

<style scoped>
    .nav-link {
        text-decoration: none;
    }
</style>

<script>
import { ref } from 'vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

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
            const projects = store.getters['projects/getAll']().map(project => { return {
                header: "project",
                label: project.name,
                id: project.id,
                owner: project.team
            }})
            return [
                {
                    label: "Dashboard",
                    header: "link",
                },
                {
                    label: "Projects",
                    header: "category",
                    children: projects
                }
            ]
        })
        store.dispatch('projects/loadAll')

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
