<template>
    <div class="q-pa-xs">
        <div class="oa-section-title2" v-if="!minimal">
            <div class="row items-center">
                <div class="col-8"><q-icon name="view_module" size="24px" class="q-mr-sm" />Well Inspector</div>
                <div class="on-right">Selected: {{wells.length}}</div>
            </div>
        </div>
        <div class="oa-section-body" v-if="wells.length == 0">
            <div v-if="wells.length == 0" class="text-info q-pa-sm">
                No well selected
            </div>
        </div>
        <div v-else class="q-pa-none oa-section-body">
            <div style="overflow: auto;" :style="minimal ? '':'max-height: 200px'">
                <div v-for="well in wells" :key="well.id" class="text-black">
                    <div class="q-pa-sm">
                        <div class="row">
                            <div class="col-4 text-weight-bold">Well:</div>
                            <div class="col-8">{{WellUtils.getWellCoordinate(well.row, well.column)}}</div>
                        </div>
                        <div class="row">
                            <div class="col-4 text-weight-bold">Well Type:</div>
                            <div class="col-8">{{well?.wellType}}</div>
                        </div>
                        <div class="row" v-show="well.substance?.type">
                            <div class="col-4 text-weight-bold">Substance:</div>
                            <div class="col-8">
                                <div class="row">{{well.substance?.type}} {{well.substance?.name}}</div>
                                <div class="row">{{well.substance?.concentration ? well.substance?.concentration.toExponential(3) : ""}}</div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4 text-weight-bold">Status:</div>
                            <div class="col-8">
                                <div v-if="well.status === 'ACCEPTED_DEFAULT'">
                                    <q-icon name="check_circle" color="positive" :size=statusIconSize />Accepted
                                </div>
                                <div v-else>
                                    <q-icon name="cancel" color="negative" :size=statusIconSize />Rejected
                                </div>
                            </div>
                        </div>
                    </div>
                    <q-separator v-if="wells.length > 1"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import WellUtils from "@/lib/WellUtils.js"

    export default {
        props: {
            wells: Array,
            minimal: Boolean
        },
        setup (props) {
            return {
                WellUtils,
                statusIconSize: props.minimal ? "xs" : "sm"
            }
        }
    }
</script>
