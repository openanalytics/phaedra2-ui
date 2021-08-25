<template>
  <div class="title">
    <h1>Plate {{plate.barcode}}</h1>
  </div>
  <div class="section">
    <p>
      <ul>
        <li>ID: {{plate.id}}</li>
        <li>Barcode: {{plate.barcode}}</li>
        <li>Dimensions: {{plate.rows}} x {{plate.columns}}</li>
        <li>Sequence: {{plate.sequence}}</li>
      </ul>
      <button type="button" class="btn btn-primary">Primary</button>
    </p>
  </div>
  <div class="section">
    <WellGrid :plate="plate"></WellGrid>
  </div>
</template>

<style>
  .title {
    margin: 5px;
  }
  .section {
    margin: 5px;
    padding: 5px;
    border: 1px solid black;
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