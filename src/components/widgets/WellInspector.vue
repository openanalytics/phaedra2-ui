<template>
  <div>
    <q-card>
        <q-card-section class="bg-primary text-white q-pa-sm" v-if="!minimal">
            <div class="row items-center"><q-icon name="view_module" size="24px" class="q-mr-sm" />Well Inspector</div>
        </q-card-section>
        <q-separator />
        <q-card-section :class=cardClass v-if="wells.length == 0">
            <div v-if="wells.length == 0" class="text-info">
                No well selected
            </div>
        </q-card-section>
        <q-card-section :class=cardClass v-else class="q-pa-none">
            <q-scroll-area style="height: 200px;">
                <div v-for="well in wells" :key="well.nr">
                    <div class="q-pa-sm">
                        <div class="row">
                            <div class="col-4 text-weight-bold">Well Nr:</div>
                            <div class="col-8">{{well.nr}} ({{WellUtils.getWellCoordinate(well.row, well.column)}})</div>
                        </div>
                        <div class="row">
                            <div class="col-4 text-weight-bold">Well Type:</div>
                            <div class="col-8">{{well.wellType}}</div>
                        </div>
                        <div class="row" v-show="well.substance.type">
                            <div class="col-4 text-weight-bold">Substance:</div>
                            <div class="col-8">
                                <div class="row">{{well.substance.type}}</div>
                                <div class="row">{{well.substance.name}}</div>
                                <div class="row">{{well.substance.concentration ? well.substance.concentration.toExponential(3) : ""}}</div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-4 text-weight-bold">Status:</div>
                            <div class="col-8">
                                <div v-if="well.status === 'ACCEPTED'">
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
            </q-scroll-area>
        </q-card-section>
    </q-card>
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
                cardClass: props.minimal ? "text-black" : "",
                statusIconSize: props.minimal ? "xs" : "sm"
            }
        }
    }
</script>