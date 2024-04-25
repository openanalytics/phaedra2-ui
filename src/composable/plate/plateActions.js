import {useExperimentStore} from "@/stores/experiment";


const linkMeasurement = async (plates, measurement) => {
    const experimentStore = useExperimentStore();
    await experimentStore.linkMeasurement(plates, measurement.id);
}

export default {
    linkMeasurement
}
