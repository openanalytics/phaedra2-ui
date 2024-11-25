import { ref } from 'vue';

export const useGraphQL = (client) => {
  const loading = ref(false);
  const error = ref(null);
  const data = ref(null);

  const executeQuery = async ( query, variables) => {
    loading.value = true;
    error.value = null;
    data.value = null;

    let cancel = () => {
      /* abort the request if it is in-flight */
    };

    try {
      const result = await new Promise((resolve, reject) => {
        let result;
        cancel = client.subscribe(
            {
              query: query,
              variables: variables
            },
            {
              next: (data) => (result = data),
              error: reject,
              complete: () => resolve(result),
            },
        );
      });
      data.value = result.data
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }

    return { data: data.value, error: error.value };
  };

  return { executeQuery };
};
