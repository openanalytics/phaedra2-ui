<template>
    <div class="row relative-position canvas-container" ref="canvasContainer">
        <canvas ref="canvas"
            @mousedown="canvasDragStart"
            @mousemove="canvasDragMove"
            @mouseup="canvasDragEnd"
            @mouseenter="mouseEnter"
            @mouseleave="mouseLeave"
        ></canvas>
        <div class="absolute-center" v-if="loading">
            <q-spinner-pie color="info" size="7em"/>
        </div>
    </div>
</template>

<style scoped>
    .canvas-container {
        overflow: scroll;
    }
</style>

<script setup>
    import {ref, onMounted, onUnmounted } from 'vue'

    const loading = ref(true);

    let scale = 0.25;
    const scaleLimits = [ 0.125, 8];
    const testURL = 'https://phaedra.poc.openanalytics.io/phaedra/api/v2/measurement-service/image/179/14/Marker2?renderConfigId=4&scale=';

    const image = new Image();
    image.addEventListener('load', function() {
        loading.value = false;
        setTimeout(draw());
    }, false);
    image.src = testURL + scale;

    const canvas = ref(null);
    const canvasContainer = ref(null);

    function draw() {
        console.log("WellImageViewer Draw")
        if (canvas.value === null) return;
        
        canvas.value.width = image.width;
        canvas.value.height = image.height;

        let ctx = canvas.value.getContext('2d');
        ctx.drawImage(image, 0, 0);
    }

    // Mouse scroll behaviour
    // ----------------------

    let isMouseOnCanvas = false;
    const mouseEnter = (event) => {
        isMouseOnCanvas = true;
    }
    const mouseLeave = (event) => {
        isMouseOnCanvas = false;
        canvasDragEnd(event);
    }
    const canvasMouseScroll = (event) => {
        if (event.deltaY == 0 || !isMouseOnCanvas) return;
        event.preventDefault();

        let isZoomIn = event.deltaY < 0;
        if (isZoomIn && scale <= scaleLimits[1]) scale *= 2;
        else if (scale >= scaleLimits[0]) scale /= 2;
        else return;
        loading.value = true;
        image.src = testURL + scale;
    }
    onMounted(() => {
        window.addEventListener('wheel', canvasMouseScroll, { passive: false });
    });
    onUnmounted(() => {
        window.removeEventListener('wheel', canvasMouseScroll);
    });

    // Mouse drag behaviour
    // --------------------

    let dragInProgress = false;
    let dragPrevPosition = null;
    let canvasBounds = null;

    const canvasDragStart = (event) => {
        if (dragInProgress) return;
        event.preventDefault();
        dragInProgress = true;
        canvasBounds = canvas.value.parentNode.getBoundingClientRect();
    };
    const canvasDragMove = (event) => {
        if (!dragInProgress) return;
        canvasBounds = canvas.value.parentNode.getBoundingClientRect();
        let currentPosition = { x: event.x - canvasBounds.left, y: event.y - canvasBounds.top};
        if (dragPrevPosition != null) {
            let diff = { x: currentPosition.x - dragPrevPosition.x, y: currentPosition.y - dragPrevPosition.y };
            canvasContainer.value.scrollTop = canvasContainer.value.scrollTop - diff.y;
            canvasContainer.value.scrollLeft = canvasContainer.value.scrollLeft - diff.x;
        }
        dragPrevPosition = currentPosition;
    };
    const canvasDragEnd = (event) => {
        if (!dragInProgress) return;
        event.preventDefault();
        dragInProgress = false;
        dragPrevPosition = null;
    };

</script>