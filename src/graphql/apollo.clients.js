import { createClient } from 'graphql-http';

const apiURL = (config.VUE_APP_API_BASE_URL || process.env.VUE_APP_API_BASE_URL);
const token = process.env.VUE_APP_API_BEARER_TOKEN;

const apolloResultDataClient = createClient({
    headers: {
        Authorization: `Bearer ${token}`
    },
    url: `${apiURL}/resultdata-service/graphql`
})

const apolloPlatesClient = createClient({
    headers: {
        Authorization: `Bearer ${token}`
    },
    url: `${apiURL}/plate-service/graphql`
})

const apolloChartsClient = createClient({
    headers: {
        Authorization: `Bearer ${token}`
    },
    url: `${apiURL}/charting-service/graphql`
})

const apolloCurvesClient = createClient({
    headers: {
        Authorization: `Bearer ${token}`
    },
    url: `${apiURL}/curvedata-service/graphql`
})

const apolloProtocolsClient = createClient({
    headers: {
        Authorization: `Bearer ${token}`
    },
    url: `${apiURL}/protocol-service/graphql`
})

const apolloMeasurementsClient = createClient({
    headers: {
        Authorization: `Bearer ${token}`
    },
    url: `${apiURL}/measurement-service/graphql`
})

const apolloQueriesClient = createClient({
    headers: {
        Authorization: `Bearer ${token}`
    },
    url: `${apiURL}/query-service/graphql`
})

export {
    apolloResultDataClient,
    apolloPlatesClient,
    apolloChartsClient,
    apolloCurvesClient,
    apolloProtocolsClient,
    apolloMeasurementsClient,
    apolloQueriesClient
}
