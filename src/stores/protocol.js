import { defineStore } from "pinia"
import protocolAPI from "@/api/protocols.js"
import protocolGraphQLAPI from "@/api/graphql/protocols"
import metadataAPI from "@/api/metadata";

export const useProtocolStore = defineStore("protocol",  {
    state: () => ({
        protocol: {},
        protocols: [],
        updated: false
    }),
    getters: {
      isUpdated: (state) => {
          return state.updated
      }
    },
    actions: {
        async loadProtocol(protocolId) {
            const data = await protocolGraphQLAPI.protocolById(protocolId)
            this.protocol = data.protocol
            // const {onResult, onError} = protocolGraphQLAPI.protocolById(protocolId)
            // onResult(({data}) => {
            //     this.protocol = data.protocol
            // })
        },
        async reloadProtocol() {
            await this.loadProtocol(this.protocol.id)
            this.updated = false
        },
        async createProtocol(protocol){
            const newProtocol = await protocolAPI.createNewProtocol(protocol)
            return newProtocol
        },
        async saveProtocol() {
            await protocolAPI.editProtocol(this.protocol)
            await this.reloadProtocol()
            this.updated = false
        },
        async renameProtocol(newProtocolName) {
            await protocolAPI.editProtocol({ id: this.protocol.id, name: newProtocolName })
            await this.reloadProtocol()
        },
        async editProtocolDescription(newDescription) {
            await protocolAPI.editProtocol({ id: this.protocol.id, description: newDescription})
            await this.reloadProtocol()
        },
        async deleteProtocol() {
            await protocolAPI.deleteProtocol(this.protocol.id)
            this.reset()
        },
        async loadAllProtocols() {
            const data = await protocolGraphQLAPI.protocols()
            this.protocols = data.protocols
            // const {onResult, onError} = protocolGraphQLAPI.protocols()
            // onResult(({data}) => {
            //     this.protocols = data.protocols
            // })
            //TODO: implement onError event!
        },
        addFeature(feature) {
            if (this.protocol.features) {
                feature.protocolId = this.protocolId
                this.protocol.features.push(feature)
            }
            this.updated = true
        },
        editFeature(feature) {
            const index = this.protocol.features.findIndex(f => f.id === feature.id)
            if (index > -1) {
                this.protocol.features[index] = feature
                this.updated = true
            }
        },
        deleteFeature(feature) {
            if (this.protocol.features) {
                this.protocol.features.map((f) => {
                    return f.id === feature.id && f.name === feature.name && !f.deleted ? f["deleted"] = true : f["deleted"] = false
                })
            }
            this.updated = true
        },
        getFeatureById(featureId) {
            return this.protocol.features ? this.protocol.features.find((f) => {return f.id === featureId}) : {}
        },
        getFeatures() {
            return this.protocol.features ? this.protocol.features.filter((f) => { return f.deleted !== true }) : []
        },
        async addTag(newTag) {
            await metadataAPI.addTag({'objectId': this.protocol.id, 'objectClass': 'PROTOCOL', 'tag': newTag })
            await this.reloadProtocol()
        },
        async deleteTag(tag) {
            await metadataAPI.removeTag({'objectId': this.protocol.id, 'objectClass': 'PROTOCOL', 'tag': tag})
            await this.reloadProtocol()
        },
        async addProperty(newProperty) {
            await metadataAPI.addProperty({
                objectId: this.protocol.id,
                objectClass: 'PROTOCOL',
                propertyName: newProperty.name,
                propertyValue: newProperty.value
            });
            await this.reloadProtocol()
        },
        async deleteProperty(property) {
            await metadataAPI.removeProperty({
                objectId: this.protocol.id,
                objectClass: 'PROTOCOL',
                propertyName: property.propertyName
            })
            await this.reloadProtocol()
        },
        reset() {
            this.protocol = {}
            this.updated = false
        },
        async importFromJson(json) {
            const features = json.features
            delete json.features
            //Add new protocol without features
            const protocol = await this.createProtocol(json)
            //Add new features without formulaName, with new protocolId
            if (features?.length > 0) {
                protocol["features"] = []
                features.forEach(feature => {
                    feature["protocolId"] = protocol.id
                    protocol.features.push(feature)
                })
                await protocolAPI.editProtocol(protocol)
            }
            return protocol
        }
    }

})
