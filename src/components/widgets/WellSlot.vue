<template>
    <div class="column well" :class="{ blink: isSelected }" v-ripple
        :style="{ backgroundColor: wellColorFunction(well) }"
        @click="$emit('wellSelection', well)"
        >
        <div v-for="wellLabelFunction in wellLabelFunctions" :key="wellLabelFunction">
            {{wellLabelFunction(well)}}
        </div>
    </div>
</template>

<style scoped>
    .well {
        border: 1px solid black;
        margin: 1px;
        font-size: 65%;
        text-align: center;
        background-color: v-bind(wellTypeColor);
        position: relative;
        cursor: pointer;
    }
    .blink {
        animation: blink-animation 1s linear infinite;
    }
    @keyframes blink-animation {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
</style>

<script>
    import { computed } from 'vue'

    export default {
        props: {
            well: Object,
            selectedWells: Array,
            wellColorFunction: Function,
            wellLabelFunctions: Array
        },
        emits: [ 'wellSelection' ],
        setup(props) {
            return {
                isSelected: computed(() => props.selectedWells.indexOf(props.well) >= 0)
            }
        }
    }
</script>