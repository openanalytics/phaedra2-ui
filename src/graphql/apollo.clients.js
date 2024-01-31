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

const apiURL = (config.VUE_APP_API_BASE_URL || process.env.VUE_APP_API_BASE_URL);

const apolloResultDataClient = new ApolloClient({
    link: authLink.concat(createHttpLink({
        uri: `${apiURL}/resultdata-service/graphql`,
    })),
    cache: new InMemoryCache(),
})

const apolloPlatesClient = new ApolloClient({
    link: authLink.concat(createHttpLink({
        uri: `${apiURL}/plate-service/graphql`,
    })),
    cache: new InMemoryCache()
})

const apolloChartsClient = new ApolloClient({
    link: authLink.concat(createHttpLink({
        uri: `${apiURL}/charting-service/graphql`,
    })),
    cache: new InMemoryCache()
})

const apolloCurvesClient = new ApolloClient({
    link: authLink.concat(createHttpLink({
        uri: `${apiURL}/curvedata-service/graphql`,
    })),
    cache: new InMemoryCache()
})

const apolloProtocolsClient = new ApolloClient({
    link: authLink.concat(createHttpLink({
        uri: `${apiURL}/protocol-service/graphql`,
    })),
    cache: new InMemoryCache()
})

const apolloMeasurementsClient = new ApolloClient({
    link: authLink.concat(createHttpLink({
        uri: `${apiURL}/measurement-service/graphql`,
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
