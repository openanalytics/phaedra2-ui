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
                this.experiment = {...data.experiment, plates: data.plates}
            })

            onError((error) => {
                console.error(error)
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
        async setPlateLayout(plates, templateId) {
            await plateAPI.setPlateLayout(plates, templateId)
            this.loadExperiment(this.experiment.id)
        },
        async validatePlates(plates) {
            const plateIds = plates.map(plate => plate.id)
            await plateAPI.validatePlates(plateIds)
            this.loadExperiment(this.experiment.id)
        },
        async invalidatePlates(plates, reason) {
            const plateIds = plates.map(plate => plate.id)
            await plateAPI.invalidatePlates(plateIds, reason)
            this.loadExperiment(this.experiment.id)
        },
        async approvePlates(plates) {
            const plateIds = plates.map(plate => plate.id)
            await plateAPI.approvePlates(plateIds)
            this.loadExperiment(this.experiment.id)
        },
        async disapprovePlates(plates, reason){
            const plateIds = plates.map(plate => plate.id)
            await plateAPI.disapprovePlates(plateIds, reason)
            this.loadExperiment(this.experiment.id)
        },
        async resetPlateValidations(plates) {
            const plateIds = plates.map(plate => plate.id)
            await plateAPI.resetPlateValidations(plateIds)
            this.loadExperiment(this.experiment.id)
        },
        async deletePlate(plateId) {
            await plateAPI.deletePlateById(plateId)
            this.loadExperiment(this.experiment.id)
        },
        async deletePlates(plates) {
            const plateIds = plates.map(plate => plate.id)
            await plateAPI.deletePlates(plateIds)
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
        async linkMeasurement(plates, measurementId) {
            const plateIds = plates.map(plate => plate.id)
            await plateAPI.linkMeasurement(plateIds, measurementId)
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
        async addPropertty({name, value}) {
            const newProperty = {
                objectId: this.experiment.id,
                objectClass: 'EXPERIMENT',
                propertyName: name,
                propertyValue: value
            }
            await metadataAPI.addProperty(newProperty);
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

