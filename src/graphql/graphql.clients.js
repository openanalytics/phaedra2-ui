import { createClient } from 'graphql-http';

const apiURL = (config.VUE_APP_API_BASE_URL || process.env.VUE_APP_API_BASE_URL);
const token = process.env.VUE_APP_API_BEARER_TOKEN;

const resultDataGraphQLClient = createClient({
    headers: {
        Authorization: `Bearer ${token}`
    },
    url: `${apiURL}/resultdata-service/graphql`
})

const platesGraphQLClient = createClient({
    headers: {
        Authorization: `Bearer ${token}`
    },
    url: `${apiURL}/plate-service/graphql`
})

const chartsGraphQLClient = createClient({
    headers: {
        Authorization: `Bearer ${token}`
    },
    url: `${apiURL}/charting-service/graphql`
})

const curvesGraphQLClient = createClient({
    headers: {
        Authorization: `Bearer ${token}`
    },
    url: `${apiURL}/curvedata-service/graphql`
})

const protocolsGraphQLClient = createClient({
    headers: {
        Authorization: `Bearer ${token}`
    },
    url: `${apiURL}/protocol-service/graphql`
})

const measurementsGraphQLClient = createClient({
    headers: {
        Authorization: `Bearer ${token}`
    },
    url: `${apiURL}/measurement-service/graphql`
})

const queriesGraphQLClient = createClient({
    headers: {
        Authorization: `Bearer ${token}`
    },
    url: `${apiURL}/query-service/graphql`
})

export {
    resultDataGraphQLClient,
    platesGraphQLClient,
    chartsGraphQLClient,
    curvesGraphQLClient,
    protocolsGraphQLClient,
    measurementsGraphQLClient,
    queriesGraphQLClient
}
