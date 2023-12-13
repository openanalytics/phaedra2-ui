import { defineStore } from "pinia"
import protocolAPI from "@/api/protocols.js"
import protocolGraphQLAPI from "@/api/graphql/protocols"
import metadataAPI from "@/api/metadata";

export const useProtocolStore = defineStore("protocol",  {
    state: () => ({
        protocol: {}
    }),
    actions: {
        async loadProtocol(protocolId) {
            const {onResult, onError} = protocolGraphQLAPI.protocolById(protocolId)
            onResult(({data}) => {
                this.protocol = data.protocol
            })
        },
        async reloadProtocol() {
            await this.loadProtocol(this.protocol.id)
        },
        async saveProtocol() {
            protocolAPI.editProtocol(this.protocol).then(() => this.reloadProtocol())
        },
        addFeature(feature) {
            if (this.protocol.features)
                this.protocol.features.push(feature)
        },
        deleteFeature(feature) {
            if (this.protocol.features) {
                this.protocol.features.map((f) => {
                    return f.id === feature.id && f.name === feature.name && !f.deleted ? f["deleted"] = true : f["deleted"] = false
                })
            }
        },
        getFeatureById(featureId) {
            return this.protocol.features ? this.protocol.features.find((f) => {return f.id === featureId}) : {}
        },
        getFeatures() {
            return this.protocol.features ? this.protocol.features.filter((f) => { return f.deleted !== true }) : []
        },
        async addTag(newTag) {
            if (this.protocol.tags.indexOf(newTag) < 0) this.protocol.tags.push(newTag)
        },
        async deleteTag(tag) {
            const index = this.protocol.tags.indexOf(tag)
            if (index > -1)
                this.protocol.tags.splice(index, 1)
        },
        async addProperty(newProperty) {
            const index = this.protocol.properties.findIndex(prop => prop.propertyName === newProperty.propertyName)
            if (index < 0)
                this.protocol.properties.push(newProperty)
            else
                this.protocol.properties[index].propertyValue = newProperty.propertyValue
        },
        async deleteProperty(property) {
            const index = this.protocol.properties.findIndex(prop => prop.propertyName === property.propertyName)
            if (index > -1)
                this.protocol.properties.splice(index, 1)
        }
    }

})
