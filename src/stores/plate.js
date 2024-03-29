 import { defineStore } from "pinia"
import calculationsAPI from "@/api/calculations"
import projectsGraphQlAPI from "@/api/graphql/projects"
import resultdataGraphQlAPI from "@/api/graphql/resultdata";
import plateAPI from "@/api/plates";
 import resultDataGraphQlAPI from "@/api/graphql/resultdata";
 import curvesGraphQlAPI from "@/api/graphql/curvedata";
 import ColorUtils from "@/lib/ColorUtils";
 import metadataAPI from "@/api/metadata";

export const usePlateStore = defineStore("plate", {
    state: () => ({
        plate: null,
    }),
    getters: {
        wells: (state) => {
            return state.plate?.wells ?? []
        },
        measurements: (state) => {
            return state.plate?.measurements ?? []
        },
        resultSets: (state) => {
            return state.plate?.resultSets ?? []
        },
        protocols: (state) => {
            return state.plate?.protocols ?? []
        },
        curves: (state) => {
            return state.plate?.curves ?? []
        },
        activeMeasurement: (state) => {
            return state.plate?.measurements?.filter(m => m.active === true)[0]
        },
        activeResultSet: (state) => {
            const activeMeasId = state.plate?.measurements?.filter(m => m.active === true)[0]?.measurementId ?? null
            return state.plate?.resultSets?.filter(rs => rs.measId === activeMeasId && rs.outcome === 'SUCCESS')[0]
        },
        protocolById: (state) => {
          return (protocolId) => state.plate?.protocols.find(p => p.id === protocolId) ?? null
        },
        featuresByProtocolId: (state) => {
            return (protocolId) => state.plate?.protocols.find(p => p.id === protocolId)?.features
        },
        featureById: (state) => {
            return state.plate?.protocols.map(p => p.features)
        },
        isApproved: (state) => {
            return state.plate !== null && state.plate.approvalStatus === 'APPROVED'
        }
    },
    actions: {
        async loadPlate(plateId) {
            const {onResult, onError} = projectsGraphQlAPI.plateById(plateId)
            onResult(({data}) => {
                this.plate = data.plate;
                this.plate["wells"] = data.wells;

                this.loadPlateMeasurements(plateId)
                this.loadPlateCalculations(plateId)
                this.loadPlateProtocols(plateId)
                this.loadPlateCurves(plateId)
            })
        },
        async reloadPlate() {
            this.loadPlate(this.plate.id)
        },
        async loadPlateMeasurements(plateId) {
            const {onResult, onError} = projectsGraphQlAPI.measurementsByPlateId(plateId)
            onResult(({data}) => {
                this.plate["measurements"] = data.plateMeasurements;
            })
        },
        async loadPlateCalculations(plateId) {
            const {onResult, onError} = resultdataGraphQlAPI.resultSetsByPlateId(plateId)
            onResult(({data}) => {
                this.plate["resultSets"] = data.resultSets;
            })
        },
        async loadPlateProtocols(plateId) {
            const {onResult, onError} = resultDataGraphQlAPI.protocolsByPlateId(plateId)
            onResult(({data}) => {
                this.plate["protocols"] = data.protocols;
            })
        },
        async loadPlateCurves(plateId) {
          const {onResult, onError} = curvesGraphQlAPI.curvesByPlateId(plateId)
            onResult(({data}) => {
                const colorList = ColorUtils.getColorList(data.curves?.length)
                const curves = data.curves?.map((curve, index) => {
                    curve['color'] = colorList[index]
                    return curve
                })
                this.plate["curves"] = curves;
            })
        },
        async renamePlate(newBarcode) {
            await plateAPI.editPlate({ id: this.plate.id, barcode: newBarcode })
            await this.reloadPlate()
        },
        async editPlateDescription(newDescription) {
            await plateAPI.editPlate({id: this.plate.id, description: newDescription})
            await this.reloadPlate()
        },
        async deletePlate() {
            await plateAPI.deletePlateById(this.plate.id)
            this.reset()
        },
        isLoaded(plateId) {
            return this.plate?.id === `${plateId}`
        },
        reset() {
            this.plate = null
        },
        async fitDoseResponseCurves(plate) {
            await calculationsAPI.fitDoseResponseCurves()
        },
        async addTag(newTag) {
            await metadataAPI.addTag({'objectId': this.plate.id, 'objectClass': 'PLATE', 'tag': newTag})
            await this.reloadPlate()
        },
        async deleteTag(tag) {
            await metadataAPI.removeTag({'objectId': Number.parseInt(this.plate.id), 'objectClass': 'PLATE', 'tag': tag })
            await this.reloadPlate()
        },
        async addPropertty(newProperty) {
            await metadataAPI.addProperty({
                objectId: this.plate.id,
                objectClass: 'PLATE',
                propertyName: newProperty.name,
                propertyValue: newProperty.value
            })
            await this.reloadPlate()
        },
        async deleteProperty(property) {
            await metadataAPI.removeProperty({
                objectId: this.plate.id,
                objectClass: 'PLATE',
                propertyName: property.propertyName
            })
            await this.reloadPlate()
        }
    }
})
