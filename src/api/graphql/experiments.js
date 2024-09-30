import {provideApolloClient, useQuery} from '@vue/apollo-composable'
import gql from 'graphql-tag'
import {apolloPlatesClient} from "@/graphql/apollo.clients";

const defaultOptions = { fetchPolicy: 'no-cache', errorPolicy: 'ignore'}

const executeQuery = (query, variables) => {
  return provideApolloClient(apolloPlatesClient)(
      () => useQuery(gql`${query}`, variables, defaultOptions));
}

export default {
  experiments(experimentIds) {
    const query = `
            query getExperiments($experimentIds: [ID]) {
                experiments:getExperiments(experimentIds: $experimentIds) {
                    id
                    name
                    description
                    status
                    projectId
                    multiploMethod
                    multiploParameter
                    createdOn
                    createdBy
                    updatedOn
                    updatedBy
                    tags
                }
            }
        `
    return executeQuery(query, {experimentIds});
  },
  nMostRecentExperiments(n) {
    const query = `
            query nMostRecentExperiments($n: Int) {
                experiments:getNMostRecentExperiments(n: $n) {
                    id
                    name
                    description
                    status
                    projectId
                    createdOn
                    createdBy
                    updatedOn
                    updatedBy
                    tags
                }
            }
        `
    return executeQuery(query, {n});
  },
  experimentById(experimentId) {
    const query = `
            query experimentById($experimentId: ID) {
                experiment:getExperimentById(experimentId: $experimentId) {
                    id
                    name
                    description
                    status
                    projectId
                    multiploMethod
                    multiploParameter
                    createdOn
                    createdBy
                    updatedOn
                    updatedBy
                    tags
                }
            }
        `
    return executeQuery(query, {experimentId});
  },
  experimentsByProjectId(projectId) {
    const query = `
            query experimentsByProjectId($projectId: ID) {
                experiment:getExperimentsByProjectId(projectId: $projectId) {
                    id
                    name
                    description
                    status
                    projectId
                    createdOn
                    createdBy
                    updatedOn
                    updatedBy
                    tags
                }
            }
        `
    return executeQuery(query, {projectId});
  },
  experimentsByProjectIds(projectIds) {
    const query = `
            query experimentsByProjectIds($projectIds: [ID]) {
                experiments:getExperimentsByProjectIds(projectIds: $projectIds) {
                    id
                    name
                    description
                    status
                    projectId
                    multiploMethod
                    multiploParameter
                    createdOn
                    createdBy
                    updatedOn
                    updatedBy
                    tags
                    summary {
                      nrPlates
                      nrPlatesLinkedLayout
                      nrPlatesApproved
                      nrPlatesCalculated
                      nrPlatesValidated
                    }
                }
            }
        `
    return executeQuery(query, {projectIds});
    },
    experimentSummaries() {
    const query = `
            query getExperiments {
                experimentSummaries:getExperimentSummaries {
                    experimentId
                    nrPlates
                    nrPlatesCalculated
                    nrPlatesValidated
                    nrPlatesApproved
                }
            }
        `
    return executeQuery(query, {});
  }
}

