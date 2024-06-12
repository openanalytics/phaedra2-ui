<template>
  <div class="col justify-start q-pa-sm">
    <div class="oa-project-card">
      <router-link :to="{ name: 'project', params: { id: project.id } }" class="nav-link">
        <div class="q-px-md oa-section-title">
          <div class="text-h8">{{ project.name }}</div>
        </div>
        <div class="row justify-center q-pa-md">
          <div class="project-stat-total">
            <div>TOTAL</div>
            <div>{{ total }}</div>
          </div>
          <q-space/>
          <div class="project-stat-open">
            <div>OPEN</div>
            <div>{{ open }}</div>
          </div>
          <q-space/>
          <div class="project-stat-closed">
            <div>CLOSED</div>
            <div>{{ closed }}</div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import projectsGraphQlAPI from "@/api/graphql/projects"
import {onMounted, ref} from "vue";

const props = defineProps({ project: Object })

const total = ref(0)
const open = ref(0)
const closed = ref(0)

onMounted(() => {
  fetchProjectExperiments()
})

const fetchProjectExperiments = () => {
  const {onResult, onError} = projectsGraphQlAPI.experimentsByProjectId(props.project.id)
  onResult(({data}) => {
    total.value = data.experiments?.length ?? 0
    open.value = data.experiments?.filter(exp => exp.status === 'OPEN').length ?? 0
    closed.value = data.experiments?.filter(exp => exp.status === 'CLOSED').length ?? 0
  })

  // onError((error) => {
  //   displayErrorNotification("Error while updating plates: " + error.message)
  // })
}

</script>

<style lang="scss">
@import "src/css/oa.global";

.oa-project-card {
  border-radius: 0;
  //border: 1px solid #32A6D3;
  box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%);
}

@mixin project-stat {
  display: grid;
  align-items: center;
  text-align: center;
  //font-size: 1vw;
  width: 30%;
  height: fit-content;
}

.project-stat-total {
  @include project-stat;
  background-color: darkgrey;
}

.project-stat-open {
  @include project-stat;
  background-color: #E6E6E6;
}

.project-stat-closed {
  @include project-stat;
  background-color: lightgray;
}
</style>
