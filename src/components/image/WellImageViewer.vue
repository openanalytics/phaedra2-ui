<template>
    <div class="viewer-panel">
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
        <div class="absolute-top-right q-pr-xl q-pt-sm">
            <q-badge color="blue">{{ selectedWell ? WellUtils.getWellCoordinate(selectedWell.row, selectedWell.column) : "No Well Selected" }}, Zoom: {{scale*100}}%</q-badge>
        </div>
        <div ref="configPanel" class="q-pt-sm">
            <q-list bordered class="rounded-borders">
                <q-expansion-item dense expand-separator icon="settings" label="Render Settings">
                    <div class="q-pb-sm">
                        <q-select dense outlined v-model="renderConfig.name" label="Channel Configuration" class="q-pa-sm" />
                    </div>
                    <q-table
                        dense flat hide-bottom
                        selection="multiple" v-model:selected="selectedChannels"
                        table-header-class="text-grey"
                        :rows="renderConfig?.config?.channelConfigs"
                        :columns="channelColumns"
                        :pagination="{ rowsPerPage: 20 }"
                        row-key="name"
                    >
                        <template v-slot:body-cell-rgb="props">
                            <q-td :props="props">
                                <div :style="{ width: '25px', backgroundColor: getColor(props.row.rgb) }">&nbsp;</div>
                            </q-td>
                        </template>
                        <template v-slot:body-cell-contrast="props">
                            <q-td :props="props">
                                <q-range dense thumb-size="12px" label :model-value="{ min: (props.row.contrastMin * 100), max: (props.row.contrastMax * 100) }" :min="0" :max="100" />
                            </q-td>
                        </template>
                    </q-table>
                </q-expansion-item>
            </q-list>
        </div>
    </div>
</template>

<style scoped>
    .canvas-container {
        overflow: scroll;
        max-height: v-bind(maxCanvasHeight);
    }
</style>

<script setup>
    import {computed, ref, watch, onMounted, onUnmounted } from 'vue'
    import {useStore} from 'vuex'
    import WellUtils from "@/lib/WellUtils.js";

    const configPanel = ref(null);
    const maxCanvasHeight = ref(100);
    const calculateCanvasHeight = () => {
        //TODO Calculate the actual available height. These magic numbers are title bar, paddings, etc.
        let maxPanelHeight = document.documentElement.clientHeight - (50 + 8 + 36 + 1 + 16);
        maxCanvasHeight.value = (maxPanelHeight - 17 - (configPanel.value ? configPanel.value.clientHeight : 0)) + 'px';
    };
    
    const store = useStore();
    const loading = ref(false);

    let renderConfigId = 4;
    const renderConfig = computed(() => store.getters['measurements/getRenderConfig'](renderConfigId) || {});
    store.dispatch('measurements/loadRenderConfig', renderConfigId).then(() => {
        if (selectedChannels.value.length == 0) {
            let channels = renderConfig.value.config.channelConfigs;
            if (channels.length > 0) selectedChannels.value = [ channels[0] ];
        }
    });

    const channelColumns = [
        { name: 'name', label: 'Channel', align: 'left', field: 'name' },
        { name: 'rgb', label: 'Color', align: 'left', field: 'rgb' },
        { name: 'contrast', label: 'Contrast Range', align: 'left' },
        { name: 'alpha', label: 'Alpha', align: 'left', field: 'alpha', format: val => (val * 100) + '%' },
    ];

    const getColor = (rgb) => {
        let r = (rgb & 0xFF0000) >> 16;
        let g = (rgb & 0xFF00) >> 8;
        let b = (rgb & 0xFF);
        return `rgb(${r},${g},${b})`;

    }

    const scale = ref(0.25);
    const scaleLimits = [ 0.125, 8];

    // Canvas loading and drawing
    // --------------------------

    const selectedChannels = ref([]);
    const selectedWell = computed(() => {
        let wells = store.getters['ui/getSelectedWells']();
        if (wells && wells.length > 0) return wells[0];
        return null;
    });

    const getImageURL = () => {
        if (selectedChannels.value.length == 0) return;
        let channelNames = selectedChannels.value.map(c => c.name).join(',');
        
        let well = selectedWell.value;
        if (!well) return;

        //TODO Assuming here that meas is already stored.
        let measLink = store.getters['measurements/getActivePlateMeasurement'](well.plateId);
        if (measLink == null) return;
        
        let measId = measLink.measurementId;
        let wellNr = WellUtils.getWellNr(well.row, well.column, measLink.columns);

        let baseURL = process.env.VUE_APP_API_BASE_URL;
        return baseURL + `/measurement-service/image/${measId}/${wellNr}/${channelNames}?renderConfigId=${renderConfigId}&scale=${scale.value}`;
    }
    const reloadImage = () => {
        console.log('reloadImage')
        let url = getImageURL();
        if (url) {
            loading.value = true;
            image.src = url;
        } else {
            image.src = null;
            setTimeout(draw());
        }
    }
    watch(selectedChannels, reloadImage);
    watch(selectedWell, reloadImage);

    const image = new Image();
    image.addEventListener('load', function() {
        loading.value = false;
        calculateCanvasHeight();
        setTimeout(draw());
    }, false);

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
        if (isZoomIn && scale.value <= scaleLimits[1]) scale.value *= 2;
        else if (scale.value >= scaleLimits[0]) scale.value /= 2;
        else return;
        reloadImage();
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

    reloadImage();
</script>