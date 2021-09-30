<template>
    <div class="gridContainer">
        <div v-for="plate in plates" :key="plate.id" class="q-pa-sm">
            <MiniHeatmap :plate=plate></MiniHeatmap>
        </div>
    </div>
</template>

<style scoped>
    .gridContainer {
        display: grid;
        grid-template-columns: v-bind(gridColumnStyle);
    }
</style>

<script>
    import { computed } from 'vue'
    import { useStore } from 'vuex'

    import MiniHeatmap from "@/components/widgets/MiniHeatmap.vue"

    export default {
        props: {
            experiment: Object
        },
        components: {
            MiniHeatmap
        },
        setup(props) {
            const store = useStore()
            
            const plates = computed(() => store.getters['plates/getByExperimentId'](props.experiment.id))
            store.dispatch('plates/loadByExperimentId', props.experiment.id)

            return {
                plates,
                gridColumnStyle: "repeat(3, 1fr)"
            }
        }
    }
</script>
