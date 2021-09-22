<template>
    <div class="row justify-center">
        <q-card class="legendBar"></q-card>
        <div class="legendLabels column q-ml-sm">
            <div class="text-secondary col-2">Max: {{maxValue}}</div>
            <div class="col-3"></div>
            <div class="text-secondary col-2">Mean: {{meanValue}}</div>
            <div class="col-3"></div>
            <div class="text-secondary col-2">Min: {{minValue}}</div>
        </div>
    </div>
</template>

<style scoped>
    .legendBar {
        width: 80px;
        height: 150px;
        background: linear-gradient(0deg, rgba(50,50,150,1) 0%, rgba(255,255,255,1) 50%, rgba(150,50,50,1) 100%);
    }
</style>

<script>
    export default {
        setup () {
            return {
                minValue: 0,
                meanValue: 50,
                maxValue: 100
            }
        }
    }
</script>