<template>
    <div>
        <q-card>
            <q-card-section class="bg-secondary text-white q-pa-xs">
                <div class="row items-center">
                    <q-icon name="view_module" size="24px" class="q-mr-sm" />
                    <router-link :to="'/plate/' + plate.id" class="nav-link">{{plate.barcode}}</router-link>
                </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-xs">
                <canvas ref="canvas"></canvas>
            </q-card-section>
        </q-card>
    </div>
</template>

<style scoped>
    .nav-link {
        color: white;
        text-decoration: none;
    }
</style>

<script>
    import {ref, onMounted, onUpdated} from 'vue'

    import WellUtils from "@/lib/WellUtils.js"
    import ColorUtils from "@/lib/ColorUtils.js"

    export default {
        props: {
            plate: Object,
            plateResult: Object,
            feature: Object
        },
        setup(props) {
            const wellColorFunction = (well) => {
                if (!props.plateResult || !props.feature) return WellUtils.getWellTypeColor("EMPTY")
                const selectedProtocol = props.plateResult.protocols[props.feature.protocolId];
                if (!selectedProtocol) return WellUtils.getWellTypeColor("EMPTY")
                const selectedMeasurement = Object.values(selectedProtocol.measurements)[0].resultData // pick the resultData of first measurement
                const rsData = selectedMeasurement.find(it => it.featureId === props.feature.id)
                const wellNr = WellUtils.getWellNr(well.row, well.column, 8) // TODO
                let value = rsData.values[wellNr - 1]
                let index = ColorUtils.findGradientIndex(value, rsData.values, ColorUtils.defaultHeatmapGradients)
                if (index === -1) return WellUtils.getWellTypeColor("EMPTY")
                return ColorUtils.defaultHeatmapGradients[index]
            }

            const canvas = ref(null)
            function draw() {
                console.log("MiniHeatmap Draw")
                if (canvas.value === null) {
                    return;
                }
                
                let ctx = canvas.value.getContext('2d')

                let parent = canvas.value.parentElement
                let parentStyle = getComputedStyle(parent)
                let parentPaddingH = parseInt(parentStyle.paddingLeft) + parseInt(parentStyle.paddingRight)
                let availableWidth = parent.clientWidth - parentPaddingH

                let wellWidth = Math.floor(availableWidth / props.plate.columns) - 2
                let wellSize = [ wellWidth, wellWidth ]

                canvas.value.width = (wellWidth + 2) * props.plate.columns
                canvas.value.height = (wellWidth + 2) * props.plate.rows
                
                for (var r=0; r<props.plate.rows; r++) {
                    for (var c=0; c<props.plate.columns; c++) {
                        let well = WellUtils.getWell(props.plate, r+1, c+1)

                        let x = c * (wellSize[0] + 2)
                        let y = r * (wellSize[1] + 2)

                        ctx.fillStyle = wellColorFunction(well)
                        ctx.fillRect(x, y, wellSize[0], wellSize[1])

                        if (well.status == "REJECTED") {
                            ctx.strokeStyle = "yellow"
                            ctx.moveTo(x, y);
                            ctx.lineTo(x + wellWidth, y + wellWidth);
                            ctx.stroke();
                            ctx.moveTo(x + wellWidth, y);
                            ctx.lineTo(x, y + wellWidth);
                            ctx.stroke();
                        }
                    }
                }
            }

            onMounted(() => {
                draw();
            });
            onUpdated(() => {
                draw();
            });

            return {
                canvas
            }
        }
    }
</script>
