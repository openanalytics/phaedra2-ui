import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";
import projectsGraphQlAPI from "@/api/graphql/projects";
import experimentsGraphQlAPI from "@/api/graphql/experiments";
import resultDataGraphQlAPI from "@/api/graphql/resultdata";
import platesApi from "@/api/plates";
import WellUtils from "@/lib/WellUtils.js";

export const useSelectionStore = defineStore("selection", () => {
  const localProjects = ref([]);
  const localExperiments = ref([]);
  const localPlates = ref([]);
  const localWells = ref([]);

  const selectedProjects = ref([]);
  const selectedExperiments = ref([]);
  const selectedPlates = ref([]);
  const selectedWells = ref([]);

  const selectedProjectDetails = ref({});
  const selectedExperimentDetails = ref({});
  const selectedPlateDetails = ref({});
  const selectedWellDetails = ref({});

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
    set: (newVal) => {
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

  async function loadProjects(projectIds, replace = true) {
    if (!projectIds) {
      projectIds = selectedProjectsIds.value;
    }
    const data = await experimentsGraphQlAPI.experimentsByProjectIds(
      projectIds
    );
    if (replace) {
      experiments.value = data.experiments;
    } else {
      experiments.value = [...experiments.value, ...data.experiments];
    }
  }

  async function loadExperiment(experimentsId, replace = true) {
    if (!experimentsId) {
      experimentsId = selectedExperimentsIds.value;
    }
    const data = await projectsGraphQlAPI.platesByExperimentIds(experimentsId);
    if (replace) {
      plates.value = data.plate;
    } else {
      plates.value = [...plates.value, ...data.plate];
    }
  }

  async function loadPlate(platesIds, replace = true) {
    if (platesIds) {
      const data = await projectsGraphQlAPI.wellsByPlateIds(platesIds);
      if (replace) {
        wells.value = data.wells;
      } else {
        wells.value = [...wells.value, ...data.wells];
      }
    }
  }

  async function loadWells(platesId) {
    if (platesId) {
      const data = await projectsGraphQlAPI.wellsByPlateId(platesId);
      heatmapWells.value = data.wells;
    }
  }

  async function loadPlateMeasurements(plate) {
    const data = await projectsGraphQlAPI.measurementsByPlateId(plate.id);
    measurements.value = data.plateMeasurements;
    activeMeasurement.value = measurements.value.filter(
      (m) => m.active === true
    )[0];
    await loadWells(plate.id);
  }

  async function loadPlateProtocols(plate) {
    const data = await resultDataGraphQlAPI.protocolsByPlateId(plate.id);
    plateChart.value = {
      plate: plate,
      id: new Date().getTime(),
      protocols: data.protocols,
    };
    await loadPlateMeasurements(plate);
  }

  watch(selectedWells, async (newVal, oldVal) => {
    if (newVal.length > 0) {
      let flag = false;
      for (const element of newVal) {
        if (!oldVal.find((el) => element == el)) {
          flag = true;
          if (selectedWellDetails.value.id != element.id) {
            await fetchWell(element.id);
          }
        }
      }
      if (
        !flag &&
        newVal.length > 0 &&
        !newVal.find((el) => el.id == selectedWellDetails.value.id)
      ) {
        await fetchWell(newVal[0].id);
      }
    } else {
      selectedWellDetails.value = {};
    }
  });

  watch(selectedPlates, async (newVal, oldVal) => {
    if (newVal.length > 0) {
      let flag = false;
      for (const element of newVal) {
        if (!oldVal.find((el) => element == el)) {
          flag = true;
          if (selectedPlateDetails.value.id != element.id) {
            await fetchPlate(element.id);
            await loadPlateProtocols(element);
          }
        }
      }
      if (
        !flag &&
        newVal.length > 0 &&
        !newVal.find((el) => el.id == selectedPlateDetails.value.id)
      ) {
        await fetchPlate(newVal[0].id);
        await loadPlateProtocols(newVal[0]);
      }
    } else {
      selectedPlateDetails.value = {};
      plateChart.value.plate = undefined;
    }
  });

  watch(selectedExperiments, async (newVal, oldVal) => {
    if (newVal.length > 0) {
      let flag = false;
      for (const element of newVal) {
        if (!oldVal.find((el) => element == el)) {
          flag = true;
          if (selectedExperimentDetails.value.id != element.id) {
            await fetchExperiment(element.id);
            chart.value = {
              experiment: element,
              label: "Experiment Trend Chart",
              type: "trend",
              id: new Date().getTime(),
            };
          }
        }
      }
      if (
        !flag &&
        newVal.length > 0 &&
        !newVal.find((el) => el.id == selectedExperimentDetails.value?.id)
      ) {
        selectedExperimentDetails.value = await fetchExperiment(newVal[0].id);
        chart.value = {
          experiment: newVal[0],
          label: "Experiment Trend Chart",
          type: "trend",
          id: new Date().getTime(),
        };
      }
    } else {
      selectedExperimentDetails.value = {};
      chart.value.experiment = undefined;
    }
    await loadExperiment(selectedExperimentsIds.value);
  });

  watch(selectedPlates, async () => {
    await loadPlate(selectedPlatesIds.value);
  });

  const fetchProject = async (id) => {
    const results = await projectsGraphQlAPI.projectById(id);
    selectedProjectDetails.value = results.project;
  };

  const fetchExperiment = async (id) => {
    const data = await projectsGraphQlAPI.experimentById(id);
    selectedExperimentDetails.value = data.experiment;
  };

  const fetchPlate = async (id) => {
    selectedPlateDetails.value = await platesApi.getPlateById(id);
  };

  const fetchWell = async (wellId) => {
    const data = await projectsGraphQlAPI.wellById(wellId);
    selectedWellDetails.value = data.well;
    selectedWellDetails.value["pos"] = WellUtils.getWellCoordinate(
      selectedWellDetails.value.row,
      selectedWellDetails.value.column
    );
  };

  watch(selectedProjects, async (newVal, oldVal) => {
    if (newVal.length > 0) {
      let flag = false;
      for (const element of newVal) {
        if (!oldVal.find((el) => element == el)) {
          flag = true;
          if (
            selectedProjectDetails.value &&
            selectedProjectDetails.value.id != element.id
          ) {
            await fetchProject(element.id);
          }
        }
      }
      if (
        !flag &&
        newVal.length > 0 &&
        !newVal.find(
          (el) =>
            selectedProjectDetails.value &&
            el.id == selectedProjectDetails.value.id
        )
      ) {
        await fetchProject(newVal[0]);
      }
    } else {
      selectedProjectDetails.value = {};
    }
    await loadProjects(selectedProjectsIds.value);
  });

  const fetchProjects = async () => {
    const data = await projectsGraphQlAPI.projects();
    projects.value = data.projects;
  };

  return {
    projects,
    experiments,
    plates,
    wells,
    loadPlate,
    fetchProject,
    fetchExperiment,
    fetchPlate,
    fetchWell,
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
    selectedProjectDetails,
    selectedExperimentDetails,
    selectedPlateDetails,
    selectedWellDetails,
    fetchProjects,
  };
});
