import { defineStore } from "pinia";
import projectsGraphQlAPI from "@/api/graphql/projects"
import experimentAPI from '@/api/experiments.js'
import plateAPI from "@/api/plates";

export const useExperimentStore = defineStore("experiment", {
    state: () => ({
        experiment: {},
        plates: []
    }),
    getters: {
        isOpen: (state) => {
            return state.experiment.status === 'OPEN'
        }
    },
    actions: {
        async loadExperiment(experimentId) {
            if (!this.isLoaded(experimentId)) {
                const {onResult, onError} = projectsGraphQlAPI.experimentById(experimentId)

                onResult(({data}) => {
                    this.experiment = data.experiment
                    this.plates = data.plates
                })
            }
        },
        isLoaded(experimentId) {
            return this.experiment.id === `${experimentId}`
        },
        async renameExperiment(newName) {
            await experimentAPI.editExperiment({ id: this.experiment.id, name: newName })
            this.experiment.name = newName
        },
        async editExperimentDescription(newDescription) {
            await experimentAPI.editExperiment({id: this.experiment.id, description: newDescription})
            this.experiment.description = newDescription
        },
        async openExperiment() {
            await experimentAPI.editExperiment({ id: this.experiment.id, status: 'OPEN' })
            this.experiment.status = 'OPEN'
        },
        async closeExperiment() {
            await experimentAPI.editExperiment({ id: this.experiment.id, status: 'CLOSED' })
            this.experiment.status = 'CLOSED'
        },
        async deleteExperiment() {
            await experimentAPI.deleteExperiment(this.experiment.id);
        },
        async addPlate(plate) {
            plate['experimentId'] = this.experiment.id
            const createdPlate = await plateAPI.addPlate(plate)
            this.plates.push(createdPlate)
        },
        async linkPlate(plate) {
            await plateAPI.linkPlate(plate.id, plate.linkTemplateId)
            const index = this.plates.findIndex((p) => {
                return p.id === plate.id
            })
            this.plates[index] = {...this.plates[index],...plate}
        },
        async validatePlate(plateId) {
            const validated = await plateAPI.editPlate({
                id: plateId,
                validationStatus: 'VALIDATED',
            })
            const index = this.plates.findIndex((p) => {
                return p.id === plateId
            })
            this.plates[index] = { ...this.plates[index], ...validated }
        },
        async invalidatePlate(plateId, reason) {
            const invalidated = await plateAPI.editPlate({
                id: plateId,
                invalidatedReason: reason,
                validationStatus: 'INVALIDATED',
            })
            const index = this.plates.findIndex((p) => {
                return p.id === plateId
            })
            this.plates[index] = { ...this.plates[index], ...invalidated }
        },
        async approvePlate(plateId) {
            const approved = await plateAPI.editPlate({
                id: plateId,
                approvalStatus: 'APPROVED',
            })
            const index = this.plates.findIndex((p) => {
                return p.id === plateId
            })
            this.plates[index] = { ...this.plates[index], ...approved }
        },
        async disapprovePlate(plateId, reason) {
            const disapproved = await plateAPI.editPlate({
                id: plateId,
                disapprovedReason: reason,
                approvalStatus: 'DISAPPROVED',
            })
            const index = this.plates.findIndex((p) => {
                return p.id === plateId
            })
            this.plates[index] = { ...this.plates[index], ...disapproved }
        },
        async resetPlateValidation(plateId) {
            const invalidated = await plateAPI.editPlate({
                id: plateId,
                invalidatedReason: "",
                validationStatus: 'VALIDATION_NOT_SET',
            })
            const index = this.plates.findIndex((p) => {
                return p.id === plateId
            })
            this.plates[index] = { ...this.plates[index], ...invalidated }
        },
        async deletePlate(plateId) {
            await plateAPI.deletePlateById(plateId)
            const index = this.plates.findIndex((p) => {
                return p.id === plateId
            })
            this.plates.splice(index, 1)
        }
    }
})

