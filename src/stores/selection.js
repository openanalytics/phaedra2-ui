import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import projectsGraphQlAPI from "@/api/graphql/projects";
import experimentsGraphQlAPI from "@/api/graphql/experiments";
import resultDataGraphQlAPI from "@/api/graphql/resultdata";

export const useSelectionStore = defineStore("selection", () => {
  const localProjects = ref([]);
  const localExperiments = ref([]);
  const localPlates = ref([]);
  const localWells = ref([]);

  const selectedProjects = ref([]);
  const selectedExperiments = ref([]);
  const selectedPlates = ref([]);
  const selectedWells = ref([]);

  const activeMeasurement = ref(null);
  const measurements = ref([]);
  const heatmapWells = ref([]);

  const chart = ref({
    id: undefined,
    experiment: undefined,
    label: undefined,
  });

  const plateChart = ref({
    id: undefined,
    protocols: [],
    plate: undefined,
  });

  function addChartView(updatedChart) {
    chart.value = {
      id: new Date().getTime(),
      ...updatedChart,
    };
  }

  const selectedProjectsIds = computed(() =>
    selectedProjects.value.map((item) => item.id)
  );
  const selectedExperimentsIds = computed(() =>
    selectedExperiments.value.map((item) => item.id)
  );
  const selectedPlatesIds = computed(() =>
    selectedPlates.value.map((item) => item.id)
  );

  const projectsIds = computed(() => projects.value.map((item) => item.id));
  const experimentsIds = computed(() =>
    experiments.value.map((item) => item.id)
  );
  const platesIds = computed(() => plates.value.map((item) => item.id));

  const projects = computed({
    get: () => localProjects.value,
    set: (newVal) => {
      localProjects.value = newVal;
    },
  });

  const experiments = computed({
    get: () => localExperiments.value,
    set: async (newVal) => {
      const changes = detectChanges(
        localExperiments.value,
        newVal,
        "projectId"
      );
      if (changes.added.length || changes.removed.length) {
        let projectsToAdd = changes.added.filter(
          (id) => !projectsIds.value.includes(id)
        );

        let reducedProjects = localProjects.value.filter(
          (item) => !changes.removed.includes(item.id)
        );

        // let fetchedProjects = fetchProjectsRequest(projectsToAdd)
        // projects.value = [...reducedProjects, ...newProjects];
      }
      localExperiments.value = newVal;
    },
  });

  const plates = computed({
    get: () => localPlates.value,
    set: (newVal) => {
      const changes = detectChanges(localPlates.value, newVal, "experimentId");

      if (changes.added.length || changes.removed.length) {
        let experimentsToAdd = changes.added.filter(
          (id) => !experimentsIds.value.includes(id)
        );

        let reducedExperiments = localExperiments.value.filter(
          (project) => !changes.removed.includes(project.id)
        );

        // let fetchedExperiments = fetchExperimentsRequest(experimentsToAdd)
        // experiments.value = [...reducedExperiments, ...fetchedExperiments];
      }
      localPlates.value = newVal;
    },
  });

  const wells = computed({
    get: () => localWells.value,
    set: (newVal) => {
      const changes = detectChanges(localWells.value, newVal, "plateId");
      if (changes.added.length || changes.removed.length) {
        let wellsToAdd = changes.added.filter(
          (id) => !platesIds.value.includes(id)
        );

        let reducedWells = localPlates.value.filter(
          (item) => !changes.removed.includes(item.id)
        );

        // if (wellsToAdd.length) {
        //   let fetchedWells = loadPlate(wellsToAdd[0]);
        //   wells.value = [...reducedPlates, ...fetchedWells];
        // }
      }
      localWells.value = newVal;
    },
  });

  function detectChanges(oldArray, newArray, nestedObjectIdName, id = "id") {
    let added = [];
    let removed = [];

    const oldMap = new Map((oldArray || []).map((item) => [item[id], item]));
    const newMap = new Map((newArray || []).map((item) => [item[id], item]));

    for (let [id, newItem] of newMap) {
      if (!oldMap.has(id)) {
        added.push(newItem[nestedObjectIdName]);
      }
    }

    for (let [id, oldItem] of oldMap) {
      if (!newMap.has(id)) {
        removed.push(oldItem[nestedObjectIdName]);
      }
    }

    added = added.filter(getUnique);
    removed = removed.filter(getUnique);

    return { added, removed };
  }

  function getUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

  function loadProjects(projectIds, replace = true) {
    if (!projectIds) {
      projectIds = selectedProjectsIds.value;
    }
    const { onResult, onError } =
      experimentsGraphQlAPI.experimentsByProjectIds(projectIds);
    onResult(({ data }) => {
      // let fetchedExperiments = data
      // .map((item) => item.experiments)
      // .reduce((item1, item2) => item1.concat(item2));
      if (replace) {
        experiments.value = data.experiments;
      } else {
        experiments.value = [...experiments.value, ...data.experiments];
      }
      // projects.value = [data.project];
    });
  }

  function loadExperiment(experimentsId, replace = true) {
    if (!experimentsId) {
      experimentsId = selectedExperimentsIds.value;
    }
    const { onResult, onError } =
      projectsGraphQlAPI.platesByExperimentIds(experimentsId);
    onResult(({ data }) => {
      if (replace) {
        plates.value = data.plate;
      } else {
        plates.value = [...plates.value, ...data.plate];
      }
    });
  }

  function loadPlate(platesIds, replace = true) {
    if (platesIds) {
      const { onResult, onError } =
        projectsGraphQlAPI.wellsByPlateIds(platesIds);
      onResult(({ data }) => {
        if (replace) {
          wells.value = data.wells;
        } else {
          wells.value = [...wells.value, ...data.wells];
        }
      });
    }
  }

  function loadWells(platesId) {
    if (platesId) {
      const { onResult, onError } = projectsGraphQlAPI.wellsByPlateId(platesId);
      onResult(({ data }) => {
        heatmapWells.value = data.wells;
      });
    }
  }

  function loadPlateMeasurements(plateId) {
    const { onResult, onError } =
      projectsGraphQlAPI.measurementsByPlateId(plateId);
    onResult(({ data }) => {
      measurements.value = data.plateMeasurements;
      activeMeasurement.value = measurements.value.filter(
        (m) => m.active === true
      )[0];
    });
  }

  function loadPlateProtocols(plate) {
    const { onResult, onError } = resultDataGraphQlAPI.protocolsByPlateId(
      plate.id
    );
    onResult(({ data }) => {
      plateChart.value = {
        plate: plate,
        id: new Date().getTime(),
        protocols: data.protocols,
      };
    });
  }

  watch(selectedPlates, (newVal, oldVal) => {
    if (newVal.length > 0) {
      let flag = false;
      newVal.forEach((element) => {
        if (!oldVal.find((el) => element == el)) {
          flag = true;
          if (plateChart.value.plate?.id != element.id) {
            loadPlateProtocols(element);
            loadPlateMeasurements(element.id);
            loadWells(element.id);
          }
        }
      });
      if (
        !flag &&
        newVal.length > 0 &&
        !newVal.find((el) => el.id == plateChart.value.plate?.id)
      ) {
        loadPlateProtocols(newVal[0]);
        loadPlateMeasurements(newVal[0].id);
        loadWells(newVal[0].id);
      }
    } else {
      plateChart.value.plate = undefined;
    }
  });

  watch(selectedExperiments, (newVal, oldVal) => {
    if (newVal.length > 0) {
      let flag = false;
      newVal.forEach((element) => {
        if (!oldVal.find((el) => element == el)) {
          flag = true;
          if (chart.value.experiment?.id != element.id) {
            chart.value = {
              experiment: element,
              label: "Experiment Trend Chart",
              type: "trend",
              id: new Date().getTime(),
            };
          }
        }
      });
      if (
        !flag &&
        newVal.length > 0 &&
        !newVal.find((el) => el.id == chart.value.experiment?.id)
      ) {
        chart.value = {
          experiment: newVal[0],
          label: "Experiment Trend Chart",
          type: "trend",
          id: new Date().getTime(),
        };
      }
    } else {
      chart.value.experiment = undefined;
    }
    loadExperiment(selectedExperimentsIds.value);
  });

  watch(selectedPlates, () => {
    loadPlate(selectedPlatesIds.value);
  });

  watch(selectedProjects, () => {
    loadProjects(selectedProjectsIds.value);
  });

  function fetchProjects() {
    const { onResult, onError } = projectsGraphQlAPI.projects();
    onResult(({ data }) => {
      projects.value = data.projects;
    });
  }

  return {
    projects,
    experiments,
    plates,
    wells,
    loadPlate,
    loadProjects,
    loadExperiment,
    detectChanges,
    selectedExperiments,
    selectedPlates,
    selectedProjects,
    selectedWells,
    activeMeasurement,
    addChartView,
    plateChart,
    chart,
    heatmapWells,
    fetchProjects,
  };
});
