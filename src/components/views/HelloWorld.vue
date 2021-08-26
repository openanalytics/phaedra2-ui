<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-treeview></v-treeview>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      Application
    </v-app-bar>

    <v-main>
        <v-container>
          <v-row class="text-center">
            <v-col cols="12">
              Hi
            </v-col>
          </v-row>
        </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      drawer: null
    }
  }
}
</script>
