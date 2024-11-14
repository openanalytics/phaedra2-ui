import gql from 'graphql-tag'
import {platesGraphQLClient} from "@/graphql/graphql.clients";
import {projectsQueries} from "@/graphql/graphql.queries";
import {useGraphQL} from "@/composable/useGraphQL";

export default {
  async projects(projectIds) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(projectsQueries.projects,
        {projectIds});
    return result.data;
  },
  async projectById(projectId) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(projectsQueries.projectById,
        {projectId});
    return result.data;
  },
  async nMostRecentlyUpdatedProjects(n) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(
        projectsQueries.nMostRecentlyUpdatedProjects, {n});
    return result.data
  },
  async experiments(experimentIds) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(projectsQueries.experiments,
        {experimentIds})
    return result.data
  },
  async experimentById(experimentId) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(
        projectsQueries.experimentById, {experimentId})
    return result.data
  },
  async experimentsByProjectId(projectId) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(
        projectsQueries.experimentsByProjectId, {projectId});
    return result.data
  },
  async plates(plateIds) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(projectsQueries.plates,
        {plateIds})
    return result.data
  },
  async plateById(plateId) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(projectsQueries.plateById,
        {plateId});
    return result.data
  },
  async platesByExperimentIds(experimentIds) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(projectsQueries.platesByExperimentIds,
        {experimentIds});
    return result.data
  },
  async wells(wellIds) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(projectsQueries.wells,
        {wellIds})
    return result.data
  },
  async wellById(wellId) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(projectsQueries.wellById,
        {wellId});
    return result.data
  },
  async wellsByPlateId(plateId) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(
        projectsQueries.wellsByPlateId, {plateId});
    return result.data
  },
  async wellsByPlateIds(plateIds) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(
        projectsQueries.wellsByPlateIds, {plateIds})
    return result.data
  },
  async measurementsByPlateId(plateId) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(
        projectsQueries.measurementsByPlateId, {plateId})
    return result.data
  },
  async activeMeasurementByPlateIds(plateIds) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(
        projectsQueries.activeMeasurementByPlateIds, {plateIds})
    return result.data
  },
  async activeMeasurementsByExperimentId(experimentId) {
    const platesClient = useGraphQL(platesGraphQLClient)
    const result = await platesClient.executeQuery(
        projectsQueries.activeMeasurementsByExperimentId, {experimentId})
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
