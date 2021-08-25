<template>
  <div>
    <h1>Dashboard</h1>
  </div>
  <div>
    <h2>Projects ({{projects.length}})</h2>
    <p>
      <ul>
        <li v-for="project in projects" :key="project.id">
          <a :href="'/project/' + project.id">{{ project.name }}</a>
        </li>
      </ul>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      projects: []
    }
  },
  mounted() {
    // Demo data
    this.projects.push({
      id: 1,
      name: "TestProject A"
    });
    this.projects.push({
      id: 2,
      name: "TestProject B"
    });
  }
}
</script>