<template>
  <div class="viewer-panel relative-position">
      <q-select v-model="x" :options="getKeys(selectedWells[0])" label="X-axis"/>
      <q-select v-model="y" :options="getKeys(selectedWells[0])" label="Y-axis"/>
    <ScatterPlot :data="data" />
  </div>
</template>

<script setup>
 import PlotLy from 'plotly.js-dist'
 import {useStore} from 'vuex'
 import {computed, reactive, ref, watchEffect} from "vue";
 import ScatterPlot from "./ScatterPlot.vue";

 const store = useStore();

 const selectedWells = computed(() => {
   let wells = store.getters['ui/getSelectedWells']();
   if (wells) return wells;
   return null;
 });

 //Make a method to return the property keys of an object
  const getKeys = (obj) => {
    if (null) return null;
    return Object.keys(obj);
  };
 //first property of selectedWells
 const x = ref(getKeys(selectedWells.value[0])[0]);
  //second property of selectedWells
  const y = ref(getKeys(selectedWells.value[0])[1]);

 let data = reactive({
   x: selectedWells.value.map(well => well[x.value]),
   y: selectedWells.value.map(well => well[y.value]),
   mode: 'markers',
   type: 'scatter',
   marker: {color: 'red'}
 });

 watchEffect(() => {
   data.x = selectedWells.value.map(well => well[x.value]);
   data.y = selectedWells.value.map(well => well[y.value]);
 });
</script>