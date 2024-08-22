<template>
  <q-btn
    flat
    round
    icon="add"
    class="q-mr-sm text-primary"
    @click="activateMenu"
  />

  <q-menu v-model="showMenu">
    <q-list style="min-width: 100px">
      <q-item clickable>
        <q-item-section>Projects</q-item-section>
        <q-item-section side>
          <q-icon name="keyboard_arrow_right" />
        </q-item-section>

        <q-menu anchor="top end" self="top start">
          <q-list>
            <WorkbenchMenuItem
              v-for="(item, i) in items"
              :key="i"
              :name="item.name"
              :id="item.id"
            />
          </q-list>
        </q-menu>
      </q-item>

      <q-separator />
    </q-list>
  </q-menu>
</template>

<style lang="scss">
.nav-link {
  text-decoration: none;
  color: black;
}
</style>

<script setup>
import { ref } from "vue";
import WorkbenchMenuItem from "./WorkbenchMenuItem.vue";

const items = [
  {
    name: "Browser",
    id: "browse-projects-pane",
  },
  {
    name: "Details",
    id: "project-details-pane",
  },
  {
    name: "New Project",
    id: "create-project-form-pane",
  },
];

const showMenu = ref(false);
function activateMenu() {
  showMenu.value = !showMenu.value;
}
</script>
