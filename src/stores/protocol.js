import { defineStore } from "pinia"
import protocolAPI from "@/api/protocols.js"

export const useProtocolStore = defineStore("protocol",  {
    state: () => ({
        protocol: {}
    }),
    actions: {
        async loadProtocol(protocolId) {
            this.protocol = await protocolAPI.getProtocolById(protocolId)
        },
        async saveProtocol() {
            this.protocol = await protocolAPI.editProtocol(this.protocol)
            await this.loadProtocol(this.protocol.id)
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
        }
    }

})
