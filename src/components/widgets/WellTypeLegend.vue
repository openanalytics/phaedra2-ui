<template>
  <div>
    <q-card>
        <q-card-section class="bg-primary text-white q-pa-sm">
            <div class="row items-center"><q-icon name="view_module" size="24px" class="q-mr-sm" />Well Types</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
            <div v-for="wellType in wellTypes" :key="wellType" class="row legendRow q-mb-sm">
                <div class="col-1" :style="{ width: '20px', background: wellType.color}"></div>
                <div class="col q-pl-sm">{{wellType.code}}</div>
                <div class="col-2">{{wellType.count}}</div>
            </div>
        </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>
    .legendRow {
        width: 200px;
    }
</style>

<script>
    import WellUtils from "@/lib/WellUtils.js"

    export default {
        props: {
            plate: Object
        },
        setup (props) {
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
            var wellTypes = props.plate.wells.map(w => w.wellType).filter(onlyUnique).map(wt => ({
                code: wt,
                color: WellUtils.getWellTypeColor(wt),
                count: props.plate.wells.filter(w => w.wellType === wt).length
            }));
            
            return {
                wellTypes
            }
        }
    }
</script>