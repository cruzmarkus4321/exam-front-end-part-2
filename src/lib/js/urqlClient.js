import { createClient, fetchExchange, cacheExchange } from '@urql/svelte';

const client = createClient({
  url: 'http://localhost:8080/graphql', // Replace with your GraphQL endpoint
  exchanges: [cacheExchange, fetchExchange],
  maskTypename: true
});

export default client;
