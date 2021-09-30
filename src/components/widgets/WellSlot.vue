<template>
    <div class="column well" :class="{ blink: isSelected }" v-ripple
        :style="{ color: fgColorFunction(wellColorFunction(well)), backgroundColor: wellColorFunction(well) }"
        @click="$emit('wellSelection', well)"
        >
        <div v-if="well.status === 'REJECTED'" class="absolute-center">
            <div class="absolute-center">
                <q-icon name="highlight_off" color="black" style="left: -1px; top: -1px;" />
            </div>
            <q-icon name="highlight_off" color="yellow" />
        </div>
        <div v-for="wellLabelFunction in wellLabelFunctions" :key="wellLabelFunction" class="wellLabel">
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
    .wellLabel {
        z-index: 1;
    }
</style>

<script>
    import { computed } from 'vue'
    import ColorUtils from "@/lib/ColorUtils.js"

    export default {
        props: {
            well: Object,
            selectedWells: Array,
            wellColorFunction: Function,
            wellLabelFunctions: Array
        },
        emits: [ 'wellSelection' ],
        setup(props) {
            const fgColorFunction = (bgColor) => {
                return ColorUtils.calculateTextColor(bgColor)
            }
            return {
                fgColorFunction,
                isSelected: computed(() => props.selectedWells.indexOf(props.well) >= 0)
            }
        }
    }
</script>