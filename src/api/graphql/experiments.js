import { platesGraphQLClient } from "@/graphql/apollo.clients";

const executeQuery = async (query, variables) => {
  let cancel = () => {
    /* abort the request if it is in-flight */
  };

  const result = await new Promise((resolve, reject) => {
    let result;
    cancel = platesGraphQLClient.subscribe(
        {
          query: query,
          variables: variables
        },
        {
          next: (data) => (result = data),
          error: reject,
          complete: () => resolve(result),
        },
    );
  });

  return result;
};

export default {
  async experiments(experimentIds) {
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
    const result = await executeQuery(query, { experimentIds })
    return result.data
  },
  async nMostRecentExperiments(n) {
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
    const result = await executeQuery(query, { n })
    return result.data
  },
  async experimentById(experimentId) {
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
    const result = await executeQuery(query, { experimentId })
    return result.data
  },
  async experimentsByProjectId(projectId) {
    const query = `
            query experimentsByProjectId($projectId: ID) {
                experiment:getExperimentsByProjectId(projectId: $projectId) {
                    id
                    name
                    description
                    status
                    projectId,
                    createdOn
                    createdBy
                    updatedOn
                    updatedBy
                    tags
                }
            }
        `
    const result = await executeQuery(query, { projectId })
    return result
  },
  async experimentsByProjectIds(projectIds) {
    const query = `
            query experimentsByProjectIds($projectIds: [ID]) {
                experiments:getExperimentsByProjectIds(projectIds: $projectIds) {
                    id
                    name
                    description
                    status
                    projectId
                    project {
                        id
                        name
                    }
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
    const result = await executeQuery(query, { projectIds })
    return result
  },
  async experimentSummaries() {
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
    const result = await executeQuery(query, {})
    return result.data
  },
};
