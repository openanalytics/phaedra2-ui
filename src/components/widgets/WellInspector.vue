<template>
  <div>
    <q-card>
        <q-card-section class="bg-primary text-white q-pa-sm">
            <div class="row items-center"><q-icon name="view_module" size="24px" class="q-mr-sm" />Well Inspector</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
            <div v-if="wells.length == 0" class="text-info">
                No well selected
            </div>
            <div v-for="well in wells" :key="well.nr">
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
                            <q-icon name="check_circle" color="positive" />Accepted
                        </div>
                        <div v-else>
                            <q-icon name="cancel" color="negative" />Rejected
                        </div>
                    </div>
                </div>
            </div>
        </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>
</style>

<script>
    import WellUtils from "@/lib/WellUtils.js"

    export default {
        props: {
            wells: Array
        },
        setup () {
            return {
                WellUtils
            }
        }
    }
</script>