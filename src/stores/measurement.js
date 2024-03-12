import {defineStore} from "pinia";
import measurementsAPI from "@/api/measurements.js"
import measAPI from "@/api/measurements";

export const useMeasurementStore = defineStore("measurement", {
    state: () => ({
        measurement: null,
        measurements: [],
        renderConfig: null,
        renderConfigs: [],
        wellData: {},
        subWellData: [],
        measImages: {}
    }),
    getters: {
        getMeasurementById: state => {
            return (measurementId) => state.measurements?.find(measuement => measuement.id === measurementId)
        },
        getRenderConfigById: state => {
            return (renderConfigId) => state.renderConfigs?.find(renderConfig => renderConfig.id === renderConfigId)
        }
    },
    actions: {
        async loadAllMeasurements(range) {
            this.measurements = await measurementsAPI.getAllMeasurements(range)
        },
        async loadMeasurementById(measurementId){
            this.measurement = await measurementsAPI.getMeasurementById(measurementId)
        },
        async loadWellData(measurementId) {
            this.wellData = await measurementsAPI.getWellData(measurementId)
        },
        async loadSubWellData({wellNr, subWellColumns: subWellColumns}) {
            const subWellData = await measurementsAPI.getSubWellData(this.measurement.id, wellNr, subWellColumns)
            this.subWellData = Array.from({length: subWellData[subWellColumns[0]]?.length ?? 0}, (_, i) => {
                return subWellColumns.reduce((result, subWellColumn) => {
                    result[subWellColumn] = subWellData[subWellColumn][i];
                    return result;
                }, {});
            });
        },
        async loadMeasImage({wellNr, scale}) {
            this.measImages[this.measurement.id + '#' + wellNr] = await measAPI.getMeasImage(this.measurement.id, wellNr, scale);
        },
        async loadAllRenderConfigs() {
            this.renderConfigs = await measurementsAPI.getRenderConfigs()
        },
        async loadRenderConfig(renderConfigId){
            this.renderConfig = await measurementsAPI.getRenderConfig(renderConfigId)
        },
        async updateRenderConfig(config){
            this.renderConfig = await measAPI.updateRenderConfig(config)
        },
        async deleteRenderConfig(renderConfigId){
            await measAPI.deleteRenderConfig(renderConfigId)
            await this.loadAllRenderConfigs()
        }
    }
})
