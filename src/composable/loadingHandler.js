import { useQuasar } from 'quasar'

export function useLoadingHandler(){
  const $q = useQuasar()

  const handleLoadingDuring = async (promise) => {
    $q.loading.show()
    try {
      await promise
    } catch (error) {
      //TODO: Improve error handling
      console.error("Error during promise resolution: ", error)
    } finally {
      $q.loading.hide()
    }
  };

  return {
    handleLoadingDuring
  }
}

