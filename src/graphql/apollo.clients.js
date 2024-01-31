import {ApolloClient, createHttpLink, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";

// middleware for setting auth headers
const authLink = setContext((_, { headers }) => {
    const token = process.env.VUE_APP_API_BEARER_TOKEN;
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});


const apolloResultDataClient = new ApolloClient({
    link: authLink.concat(createHttpLink({
        uri: 'https://phaedra.poc.openanalytics.io/phaedra/api/v1/resultdata-service/graphql',
    })),
    cache: new InMemoryCache(),
})

const apolloPlatesClient = new ApolloClient({
    link: authLink.concat(createHttpLink({
        uri: 'https://phaedra.poc.openanalytics.io/phaedra/api/v1/plate-service/graphql',
    })),
    cache: new InMemoryCache()
})

const apolloChartsClient = new ApolloClient({
    link: authLink.concat(createHttpLink({
        uri: 'https://phaedra.poc.openanalytics.io/phaedra/api/v1/charting-service/graphql',
    })),
    cache: new InMemoryCache()
})

const apolloCurvesClient = new ApolloClient({
    link: authLink.concat(createHttpLink({
        uri: 'https://phaedra.poc.openanalytics.io/phaedra/api/v1/curvedata-service/graphql',
    })),
    cache: new InMemoryCache()
})

const apolloProtocolsClient = new ApolloClient({
    link: authLink.concat(createHttpLink({
        uri: 'https://phaedra.poc.openanalytics.io/phaedra/api/v1/protocol-service/graphql',
    })),
    cache: new InMemoryCache()
})

const apolloMeasurementsClient = new ApolloClient({
    link: authLink.concat(createHttpLink({
        uri: 'https://phaedra.poc.openanalytics.io/phaedra/api/v1/measurement-service/graphql',
    })),
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
