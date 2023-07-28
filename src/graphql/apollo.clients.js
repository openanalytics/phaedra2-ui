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

export { apolloResultDataClient, apolloPlatesClient, apolloChartsClient }
