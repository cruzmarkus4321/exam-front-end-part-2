<script>
	import { Client, setContextClient, cacheExchange, fetchExchange } from '@urql/svelte';
	import { client } from "$lib/js/urqlClient";

	// const client = new Client({
	// 	url: 'http://localhost:8080/graphql', // Replace with your GraphQL endpoint
	// 	exchanges: [cacheExchange, fetchExchange],
	// 	//   fetchOptions: {
	// 	//     mode: 'no-cors'
	// 	//   }
	// });

	setContextClient(client);
</script>