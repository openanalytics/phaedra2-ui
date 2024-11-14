import gql from 'graphql-tag'
import {platesGraphQLClient} from "@/graphql/apollo.clients";
import {projectsQueries} from "@/graphql/graphql.queries";

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
  async projects(projectIds) {
    const result = await executeQuery(projectsQueries.projects, {projectIds});
    return result.data;
  },
  async projectById(projectId) {
    const result = await executeQuery(projectsQueries.projectById, {projectId});
    return result.data;
  },
  async nMostRecentlyUpdatedProjects(n) {
    const result = await executeQuery(projectsQueries.nMostRecentlyUpdatedProjects, {n});
    return result.data
  },
  async experiments(experimentIds) {
    const result = await executeQuery(projectsQueries.experiments, {experimentIds})
    return result.data
  },
  async experimentById(experimentId) {
    const result = await executeQuery(projectsQueries.experimentById, {experimentId})
    return result.data
  },
  async experimentsByProjectId(projectId) {
    const result = await executeQuery(projectsQueries.experimentsByProjectId, {projectId});
    return result.data
  },
  async plates(plateIds) {
    const result = await executeQuery(projectsQueries.plates, {plateIds})
    return result.data
  },
  async plateById(plateId) {
    const result = await executeQuery(projectsQueries.plateById, {plateId});
    return result.data
  },
  async platesByExperimentIds(experimentIds) {
    const result = await executeQuery(projectsQueries, {experimentIds});
    return result.data
  },
  async wells(wellIds) {
    const result = await executeQuery(projectsQueries.wells, {wellIds})
    return result.data
  },
  async wellById(wellId) {
    const result = await executeQuery(projectsQueries.wellById, {wellId});
    return result.data
  },
  async wellsByPlateId(plateId) {
    const result = await executeQuery(projectsQueries.wellsByPlateId, {plateId});
    return result.data
  },
  async wellsByPlateIds(plateIds) {
    const result = await executeQuery(projectsQueries.wellsByPlateIds, {plateIds})
    return result.data
  },
  async measurementsByPlateId(plateId) {
    const result = await executeQuery(projectsQueries.measurementsByPlateId, {plateId})
    return result.data
  },
  async activeMeasurementByPlateIds(plateIds) {
    const result = await executeQuery(projectsQueries.activeMeasurementByPlateIds, {plateIds})
    return result.data
  },
  async activeMeasurementsByExperimentId(experimentId) {
    const result = await executeQuery(projectsQueries.activeMeasurementsByExperimentId, {experimentId})
    return result.data
  },
  linkPlateMeasurement(plateId, measurementId) {
    const mutation = gql`
        mutation linkPlateMeasurement {
            linkMeasurement(plateId: ${plateId}, measurementId: ${measurementId}) {
                id
                plateId
                measurementId
                linkedOn
                linkedBy
                active
            }
        }
    `
    return provideApolloClient(platesGraphQLClient)(() => useMutation(mutation))
  }
}
