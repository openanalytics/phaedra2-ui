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
        async reloadMetaData() {
            const {onResult, onError} = protocolGraphQLAPI.protocolById(this.protocol.id)
            onResult(({data}) => {
                this.protocol.tags = data.protocol.tags
                this.protocol.properties = data.protocol.properties
            })
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
            await metadataAPI.addTag({'objectId': this.protocol.id, 'objectClass': 'PROTOCOL', 'tag': newTag })
            await this.reloadMetaData()
        },
        async deleteTag(tag) {
            await metadataAPI.removeTag({'objectId': this.protocol.id, 'objectClass': 'PROTOCOL', 'tag': tag})
            await this.reloadMetaData()
        },
        async addProperty(newProperty) {
            await metadataAPI.addProperty({
                objectId: this.protocol.id,
                objectClass: 'PROTOCOL',
                propertyName: newProperty.name,
                propertyValue: newProperty.value
            });
            await this.reloadMetaData()
        },
        async deleteProperty(property) {
            await metadataAPI.removeProperty({
                objectId: this.protocol.id,
                objectClass: 'PROTOCOL',
                propertyName: property.propertyName
            })
            await this.reloadMetaData()
        }
    }

})
