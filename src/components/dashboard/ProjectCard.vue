<template>
  <div class="col projects-recent">
    <div>
      <div class="q-px-sm projects-recent-title">{{ project.name }}</div>
    </div>
    <div class="row q-gutter-sm q-pa-md project-stats">
      <div class="project-stat">
        <div>TOTAL</div>
        <div>{{ total }}</div>
      </div>
      <q-space/>
      <div class="project-stat">
        <div>OPEN</div>
        <div>{{ open }}</div>
      </div>
      <q-space/>
      <div class="project-stat">
        <div>CLOSED</div>
        <div>{{ closed }}</div>
      </div>
    </div>
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
    const experiments = computed(() => store.getters['experiments/getByProjectId'](props.project.id))
    store.dispatch('experiments/loadByProjectId', props.project.id)

    const total = experiments.value.length;
    const open = experiments.value.filter(e => e.closed === false).length;
    const closed = total - open;

    return {
      total,
      open,
      closed
    }
  }
}
</script>

<style scoped>

</style>
