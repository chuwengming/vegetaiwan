import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const WORDPRESS_GRAPHQL_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  "http://vege-taiwan.local/graphql";

const httpLink = new HttpLink({
  uri: WORDPRESS_GRAPHQL_URL,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export default client;
