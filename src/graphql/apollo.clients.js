import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";

const token = process.env.VUE_APP_API_BEARER_TOKEN;

const apolloResultDataClient = new ApolloClient({
    link: createHttpLink({
        uri: 'https://phaedra.poc.openanalytics.io/phaedra/api/v1/resultdata-service/graphql',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }),
    cache: new InMemoryCache(),
})

const apolloPlatesClient = new ApolloClient({
    link: createHttpLink({
        uri: 'https://phaedra.poc.openanalytics.io/phaedra/api/v1/plate-service/graphql',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }),
    cache: new InMemoryCache()
})

const apolloChartsClient = new ApolloClient({
    link: createHttpLink({
        uri: 'https://phaedra.poc.openanalytics.io/phaedra/api/v1/charting-service/graphql',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }),
    cache: new InMemoryCache()
})

const apolloCurvesClient = new ApolloClient({
    link: createHttpLink({
        uri: 'https://phaedra.poc.openanalytics.io/phaedra/api/v1/curvedata-service/graphql',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }),
    cache: new InMemoryCache()
})

const apolloProtocolsClient = new ApolloClient({
    link: createHttpLink({
        uri: 'https://phaedra.poc.openanalytics.io/phaedra/api/v1/protocol-service/graphql',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }),
    cache: new InMemoryCache()
})

const apolloMeasurementsClient = new ApolloClient({
    link: createHttpLink({
        uri: 'https://phaedra.poc.openanalytics.io/phaedra/api/v1/measurement-service/graphql',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }),
    cache: new InMemoryCache()
})

export {
    apolloResultDataClient,
    apolloPlatesClient,
    apolloChartsClient,
    apolloCurvesClient,
    apolloProtocolsClient,
    apolloMeasurementsClient
}
