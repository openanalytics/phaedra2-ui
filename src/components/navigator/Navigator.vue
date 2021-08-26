<template>
    <q-toolbar class="bg-grey-3">
        <q-toolbar-title v-show="drawerOpen">
            Navigator
        </q-toolbar-title>
        <q-btn dense flat round icon="more_vert" v-show="drawerOpen" />
        <q-btn dense flat round :icon="drawerIcon" @click="toggleDrawer" />
    </q-toolbar>
    <q-tree :nodes="demoTree" node-key="label" v-model:selected="selected" selected-color="primary">
        <template v-slot:header-category="prop">
            <div class="row items-center">
                <q-icon name="folder" color="primary" size="28px" class="q-mr-sm" />
                <div class="text-weight-bold">{{ prop.node.label }}</div>
            </div>
        </template>
        <template v-slot:header-project="prop">
            {{ prop.node.label }} <span v-if="prop.node.owner" class="text-green">&nbsp; [{{prop.node.owner}}]</span>
        </template>
    </q-tree>
</template>

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
            drawerOpen: ref(true),
            drawerIcon: ref("chevron_left"),
            demoTree: [
                {
                    label: "Projects",
                    header: "category",
                    children: [
                        { label: "Project A", header: "project", owner: "Team X" },
                        { label: "Project B", header: "project" },
                        { label: "Project C", header: "project", owner: "Team X" }
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
