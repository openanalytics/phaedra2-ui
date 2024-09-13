import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {apolloProtocolsClient} from "@/graphql/apollo.clients";

const defaultOptions = {fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

const executeQuery = (query, variables) => {
  return provideApolloClient(apolloProtocolsClient)(
      () => useQuery(gql`${query}`, variables, defaultOptions));
}

export default {
  protocols() {
    const query = `
            query getProtocols {
                protocols:getProtocols {
                    id
                    name
                    description
                    createdOn
                    createdBy
                    tags
                }
            }
        `
    return executeQuery(query, {});
  },
  protocolById(protocolId) {
    const query = `
            query getProtocolById {
                protocol:getProtocolById(protocolId: ${protocolId}) {
                    id
                    name
                    description
                    lowWelltype
                    highWelltype
                    versionNumber
                    createdOn
                    createdBy
                    updatedOn
                    updatedBy
                    tags
                    properties {
                        propertyName
                        propertyValue
                    }
                    features {
                        id
                        name
                        description
                        formulaId
                        format
                        sequence
                        alias
                        drcModel {
                            featureId
                            name
                            description
                            inputParameters {
                                name
                                value
                            }
                        }
                        civs {
                            id
                            featureId
                            formulaId
                            variableName
                            sourceMeasColName
                            sourceFeatureId
                            inputSource
                        }
                    }
                }
            }
        `
    return executeQuery(query, {protocolId});
  },
  featureById(featureId) {
    const query = `
            query getProtocolById($featureId: ID) {
                feature:getFeatureById(featureId: $featureId) {
                    id
                    name
                    alias
                    description
                    format
                    type
                    sequence
                    protocolId
                    formulaId
                    civs {
                        id
                        featureId
                        formulaId
                        variableName
                        sourceMeasColName
                        sourceFeatureId
                        inputSource
                    }
                    drcModel {
                        featureId
                        name
                        description
                        method
                        slope
                        script
                    }
                    trigger
                    status
                    deleted
                }
            }
        `
    return executeQuery(query, {featureId});
  },
  featuresByProtocolId(protocolId) {
    const query = `
            query getFeaturesByProtocolId($protocolId: ID) {
                features:getFeaturesByProtocolId(protocolId: $protocolId) {
                    id
                    name
                    status
                    sequence
                    alias
                    description
                }
            }
        `
    return executeQuery(query, {protocolId});
  }
}
