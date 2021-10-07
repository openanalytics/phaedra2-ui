<template>
  <div class="col justify-start q-pa-md">
    <div class="q-px-sm oa-section-title">
      <div class="text-h8">{{ project.name }}</div>
    </div>
    <q-card class="oa-project-card row justify-center q-pa-md">
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
    </q-card>
  </div>
</template>

<script>
import {useStore} from "vuex";
import {computed} from "vue";

export default {
  props: {
    project: Object
  },
  setup(props) {
    const store = useStore()
    store.dispatch('experiments/loadByProjectId', props.project.id)

    const total = computed(() => store.getters['experiments/getNrOfExperiments'](props.project.id));
    const open = computed(() => store.getters['experiments/getNrOfOpenExperiments'](props.project.id));
    const closed = computed(() => store.getters['experiments/getNrOfClosedExperiments'](props.project.id));

    return {
      total,
      open,
      closed
    }
  }
}
</script>

<style lang="scss">

.oa-project-card {
  border-radius: 0px;
  border: 1px solid #32A6D3;
}

@mixin project-stat {
  display: grid;
  align-items: center;
  text-align: center;
  width: 80px;
  height: 60px;
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
