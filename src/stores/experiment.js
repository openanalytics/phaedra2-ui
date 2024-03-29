import { defineStore } from "pinia";
import projectsGraphQlAPI from "@/api/graphql/projects"
import experimentAPI from '@/api/experiments.js'
import plateAPI from "@/api/plates";
import metadataAPI from "@/api/metadata";

export const useExperimentStore = defineStore("experiment", {
    state: () => ({
        experiment: {}
    }),
    getters: {
        isOpen: (state) => {
            return state.experiment.status === 'OPEN'
        },
        isClosed: (state) => {
            return state.experiment.status === 'CLOSED'
        },
        getPlateByPlateId: (state, plateId) => {
            return state.experiment.plates.find(p => p.id === plateId) ?? {}
        },
        plates: state => state.experiment.plates ?? []
    },
    actions: {
        loadExperiment(experimentId) {
            const {onResult, onError} = projectsGraphQlAPI.experimentById(experimentId)
            onResult(({data}) => {
                this.experiment = data.experiment
                this.experiment["plates"] = data.plates
            })
        },
        isLoaded(experimentId) {
            return this.experiment.id === `${experimentId}`
        },
        async renameExperiment(newName) {
            await experimentAPI.editExperiment({ id: this.experiment.id, name: newName })
            this.loadExperiment(this.experiment.id)
        },
        async editExperimentDescription(newDescription) {
            await experimentAPI.editExperiment({id: this.experiment.id, description: newDescription})
            this.loadExperiment(this.experiment.id)
        },
        async openExperiment() {
            await experimentAPI.editExperiment({ id: this.experiment.id, status: 'OPEN' })
            this.loadExperiment(this.experiment.id)
        },
        async closeExperiment() {
            await experimentAPI.editExperiment({ id: this.experiment.id, status: 'CLOSED' })
            this.loadExperiment(this.experiment.id)
        },
        async deleteExperiment() {
            await experimentAPI.deleteExperiment(this.experiment.id);
            this.reset()
        },
        async addPlate(plate) {
            plate['experimentId'] = this.experiment.id
            await plateAPI.addPlate(plate)
            this.loadExperiment(this.experiment.id)
        },
        async linkPlate(plate) {
            await plateAPI.linkPlate(plate.id, plate.linkTemplateId)
            this.loadExperiment(this.experiment.id)
        },
        async validatePlate(plateId) {
            await plateAPI.editPlate({
                id: plateId,
                validationStatus: 'VALIDATED',
            })
            this.loadExperiment(this.experiment.id)
        },
        async invalidatePlate(plateId, reason) {
            await plateAPI.editPlate({
                id: plateId,
                invalidatedReason: reason,
                validationStatus: 'INVALIDATED',
            })
            this.loadExperiment(this.experiment.id)
        },
        async approvePlate(plateId) {
            await plateAPI.editPlate({
                id: plateId,
                approvalStatus: 'APPROVED',
            })
            this.loadExperiment(this.experiment.id)
        },
        async disapprovePlate(plateId, reason) {
            await plateAPI.editPlate({
                id: plateId,
                disapprovedReason: reason,
                approvalStatus: 'DISAPPROVED',
            })
            this.loadExperiment(this.experiment.id)
        },
        async resetPlateValidation(plateId) {
            await plateAPI.editPlate({
                id: plateId,
                invalidatedReason: "",
                validationStatus: 'VALIDATION_NOT_SET',
            })
            this.loadExperiment(this.experiment.id)
        },
        async deletePlate(plateId) {
            await plateAPI.deletePlateById(plateId)
            this.loadExperiment(this.experiment.id)
        },
        async clonePlates(plates) {
            await plateAPI.clonePlates(plates)
            this.loadExperiment(this.experiment.id)
        },
        async movePlates(plates, experimentId) {
            await plateAPI.movePlates(plates, experimentId)
            this.loadExperiment(this.experiment.id)
        },
        async addTag(newTag) {
            await metadataAPI.addTag({'objectId': this.experiment.id, 'objectClass': 'EXPERIMENT', 'tag': newTag })
            this.loadExperiment(this.experiment.id)
        },
        async deleteTag(tag) {
            await metadataAPI.removeTag({'objectId': this.experiment.id, 'objectClass': 'EXPERIMENT', 'tag': tag})
            this.loadExperiment(this.experiment.id)
        },
        async addPropertty(newProperty) {
            await metadataAPI.addProperty({
                objectId: this.experiment.id,
                objectClass: 'EXPERIMENT',
                propertyName: newProperty.name,
                propertyValue: newProperty.value
            });
            this.loadExperiment(this.experiment.id)
        },
        async deleteProperty(property) {
            await metadataAPI.removeProperty({
                objectId: this.experiment.id,
                objectClass: 'EXPERIMENT',
                propertyName: property.propertyName
            })
            this.loadExperiment(this.experiment.id)
        },
        reset() {
            this.experiment = {}
        },
    }
})

