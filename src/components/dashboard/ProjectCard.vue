<template>
  <div class="col justify-start q-pa-md">
    <router-link :to="{ name: 'project', params: { id: project.id } }" class="nav-link">
      <div class="q-px-sm oa-section-title">
        <div class="text-h8">{{ project.name }}</div>
      </div>
      <div class="row oa-project-card justify-center q-pa-md">
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
</template>

<script setup>

import {useStore} from "vuex";
import {computed} from "vue";

const props = defineProps({
  project: Object
})
const store = useStore()
store.dispatch('experiments/loadByProjectId', props.project.id)

const total = computed(() => store.getters['experiments/getNrOfExperiments'](props.project.id));
const open = computed(() => store.getters['experiments/getNrOfOpenExperiments'](props.project.id));
const closed = computed(() => store.getters['experiments/getNrOfClosedExperiments'](props.project.id));

</script>

<style lang="scss">
@import "src/css/oa.global";

.oa-project-card {
  border-radius: 0px;
  border: 1px solid #32A6D3;
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
