<template>
    <q-drawer show-if-above side="left" bordered v-model="drawerVisible" :mini="!drawerOpen" :mini-width="60" >
        <q-toolbar class="bg-grey-3">
            <q-toolbar-title v-show="drawerOpen">
                Navigator
            </q-toolbar-title>
            <q-btn dense flat round icon="settings" v-show="drawerOpen" />
            <q-btn dense flat round :icon="drawerIcon" @click="toggleDrawer" />
        </q-toolbar>
        <q-tree :nodes="demoTree" node-key="label" v-model:selected="selected" selected-color="primary">
            <template v-slot:header-link="prop">
                <div class="row items-center">
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

export default {
    methods: {
        toggleDrawer() {
            this.drawerOpen = !this.drawerOpen;
            this.drawerIcon = this.drawerIcons[this.drawerOpen];
            this.$emit("onDrawerToggled");
        }
    },
    setup() {
        return {
            drawerIcons: {
                true: "chevron_left",
                false: "chevron_right"
            },
            selected: ref(null),
            drawerVisible: ref(true),
            drawerOpen: ref(true),
            drawerIcon: ref("chevron_left"),
            demoTree: [
                {
                    label: "Dashboard",
                    header: "link",
                },
                {
                    label: "Projects",
                    header: "category",
                    children: [
                        { label: "Project A", id: 1, header: "project", owner: "Team X" },
                        { label: "Project B", id: 2, header: "project" },
                        { label: "Project C", id: 3, header: "project", owner: "Team X" }
                    ]
                },
                {
                    label: "Protocols",
                    header: "category",
                    children: [
                        { label: "Protocol X" },
                        { label: "Protocol Y" },
                        { label: "Protocol Z" }
                    ]
                },
                {
                    label: "Pipelines",
                    header: "category",
                    children: [
                        { label: "Pipeline 1" },
                        { label: "Pipeline 2" },
                        { label: "Pipeline 3" }
                    ]
                }
            ]
        }
    }
}
</script>
