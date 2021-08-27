<template>
  <q-card class="plate-header">
    <q-card-section>
      <div class="text-h6 text-primary">Plate {{plate.barcode}}</div>
      <div class="row">
        <div class="col-5">
          <div class="row">
            <div class="col-2 text-weight-bold">ID:</div><div class="col">{{plate.id}}</div>
          </div>
          <div class="row">
            <div class="col-2 text-weight-bold">Barcode:</div><div class="col">{{plate.barcode}}</div>
          </div>
          <div class="row">
            <div class="col-2 text-weight-bold">Dimensions:</div><div class="col">{{plate.rows}} x {{plate.columns}} ({{plate.rows * plate.columns}} wells)</div>
          </div>
          <div class="row">
            <div class="col-2 text-weight-bold">Sequence:</div><div class="col">{{plate.sequence}}</div>
          </div>
          <div class="row">
            <div class="col-2 text-weight-bold">Tags:</div>
            <div class="col">
              <q-chip color="green" text-color="white" label="Ref Plate" />
              <q-chip color="orange" text-color="white" label="Experimental" />
            </div>
          </div>
        </div>
        <div class="col-5">
          <div class="row">
            <div class="col-2 text-weight-bold">Properties:</div>
            <div class="col">

            </div>
          </div>
        </div>
        <div class="col-2">
          <div class="row plate-button"><q-btn size="sm" rounded color="primary" label="Edit" /></div>
          <div class="row plate-button"><q-btn size="sm" rounded color="primary" label="Move" /></div>
          <div class="row plate-button"><q-btn size="sm" rounded color="primary" label="Delete" /></div>
          <div class="row plate-button"><q-btn size="sm" rounded color="primary" icon="more_horiz" /></div>
        </div>
      </div>
    </q-card-section>
  </q-card>

  <q-card class="plate-body">
    <q-card-section>
      <WellGrid :plate="plate"></WellGrid>
    </q-card-section>
  </q-card>
</template>

<style>
  .plate-header {
    margin: 10px;
  }
  .plate-body {
    margin: 10px;
  }
  .plate-button {
    margin: 3px;
  }
</style>

<script>
import WellGrid from "@/components/widgets/WellGrid.vue"
import WellUtils from "@/lib/WellUtils.js"

export default {
  name: 'Plate',
  data() {
    return {
      plate: {}
    }
  },
  components: {
    WellGrid
  },
  created() {
    // Demo data
    this.plate = {
      id: 1,
      barcode: "123456",
      rows: 16,
      columns: 24,
      sequence: 1,
      wells: []
    };
    for (var r = 1; r <= this.plate.rows; r++) {
      for (var c = 1; c <= this.plate.columns; c++) {
        this.plate.wells.push({
          nr: WellUtils.getWellNr(r, c, this.plate.columns),
          row: r,
          column: c,
          wellType: ((c < 3) ? "NC": (c > 22 ? "PC" : "SAMPLE")),
          substance: {}
        });
      }
    }
  }
}
</script>