import { defineStore } from "pinia"
import platesAPI from "@/api/plates"
import calculationsAPI from "@/api/calculations"
import projectsGraphQlAPI from "@/api/graphql/projects"
import resultdataGraphQlAPI from "@/api/graphql/resultdata";
import measurementsGraphQlAPI from "@/api/graphql/measurements";
import plateAPI from "@/api/plates";
import {computed} from "vue";


export const usePlateStore = defineStore("plate", {
    state: () => ({
        plate: {},
        wells:[],
        measurements: [],
        resultSets: [],
        curves:[]
    }),
    actions: {
        loadPlate(plateId) {
            if (!this.isLoaded(plateId)) {
                const {plate, wells} = projectsGraphQlAPI.plateById(plateId)
                this.plate = plate;
                this.wells = wells;
            }
            this.loadPlateMeasurements(plateId)
            this.loadPlateCalculations(plateId)
        },
        loadPlateMeasurements(plateId) {
            plateAPI.getPlateMeasurementsByPlateId(plateId).then(results => {
                this.measurements = results
            })
        },
        loadPlateCalculations(plateId) {
            const resultSets = resultdataGraphQlAPI.resultSetsByPlateId(plateId)
            this.resultSets = resultSets
        },
        isLoaded(plateId) {
            return this.plate && this.plate.id === plateId
        },
        getActiveMeasurement() {
          return this.measurements
        },
        getActiveResultSet() {
            const activeMeasId = this.getActiveMeasurement().id ?? null
            return this.resultSets.filter(rs => rs.measId === activeMeasId && rs.outcome === 'SUCCESS')[0] ?? null
        },
        async fitDoseResponseCurves(plate) {
            await calculationsAPI.fitDoseResponseCurves()
        }
    }
})
