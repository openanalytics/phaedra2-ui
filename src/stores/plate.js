 import { defineStore } from "pinia"
import platesAPI from "@/api/plates"
import calculationsAPI from "@/api/calculations"
import projectsGraphQlAPI from "@/api/graphql/projects"
import resultdataGraphQlAPI from "@/api/graphql/resultdata";
import measurementsGraphQlAPI from "@/api/graphql/measurements";
import plateAPI from "@/api/plates";
import {computed} from "vue";
 import resultDataGraphQlAPI from "@/api/graphql/resultdata";


export const usePlateStore = defineStore("plate", {
    state: () => ({
        plate: {},
        wells:[],
        measurements: [],
        resultSets: [],
        protocols: [],
        curves:[]
    }),
    getters: {
        activeMeasurement: (state) => {
            return state.measurements?.filter(m => m.active === true)[0]
        },
        activeResultSet: (state) => {
            const activeMeasId = state.measurements?.filter(m => m.active === true)[0]?.measurementId ?? null
            return state.resultSets?.filter(rs => rs.measId === activeMeasId && rs.outcome === 'SUCCESS')[0]
        },
        featuresByProtocolId: (state) => {
            return (protocolId) => state.protocols.find(p => p.id === protocolId)?.features
        }
    },
    actions: {
        async loadPlate(plateId) {
            if (!this.isLoaded(plateId)) {
                const {onResult, onError} = projectsGraphQlAPI.plateById(plateId)

                onResult(({data}) => {
                    this.plate = data.plate;
                    this.wells = data.wells;

                    this.loadPlateMeasurements(plateId)
                    this.loadPlateCalculations(plateId)
                    this.loadPlateProtocols(plateId)
                })
            }

        },
        async loadPlateMeasurements(plateId) {
            const {onResult, onError} = projectsGraphQlAPI.measurementsByPlateId(plateId)
            onResult(({data}) => this.measurements = data.plateMeasurements)
        },
        async loadPlateCalculations(plateId) {
            const {onResult, onError} = resultdataGraphQlAPI.resultSetsByPlateId(plateId)
            onResult(({data}) => this.resultSets = data.resultSets)
        },
        async loadPlateProtocols(plateId) {
            const {onResult, onError} = resultDataGraphQlAPI.protocolsByPlateId(plateId)
            onResult(({data}) => this.protocols = data.protocols)
        },
        async renamePlate(newBarcode) {
            const plate = await plateAPI.editPlate({ id: this.plate.id, barcode: newBarcode })
            this.plate = plate
        },
        async editPlateDescription(newDescription) {
            const plate = await plateAPI.editPlate({id: this.plate.id, description: newDescription})
            this.plate = plate
        },
        async deletePlate() {
            await plateAPI.deletePlateById(this.plate.id)
            this.reset()
        },
        isLoaded(plateId) {
            return this.plate.id === `${plateId}`
        },
        reset() {
            this.plate = {}
            this.wells = []
            this.measurements = []
            this.resultSets = []
            this.protocols = []
            this.curves = []
        },
        async fitDoseResponseCurves(plate) {
            await calculationsAPI.fitDoseResponseCurves()
        }
    }
})
