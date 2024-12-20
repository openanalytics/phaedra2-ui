import axios from "axios";

const apiURL =
  (config.VUE_APP_API_BASE_URL || process.env.VUE_APP_API_BASE_URL) +
  "/plate-service";

export default {
  async getPlateById(id) {
    try {
      const response = await axios.get(apiURL + "/plates/" + id);
      if (response.status === 200) return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  async getPlatesByExperimentId(id) {
    try {
      const response = await axios.get(
        apiURL + "/experiments/" + id + "/plates"
      );
      if (response.status === 200) return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  async getPlateMeasurementsByPlateId(plateId) {
    try {
      const response = await axios.get(
        apiURL + "/plates/" + plateId + "/measurements"
      );
      if (response.status === 200) return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  async addPlate(plate) {
    const response = await axios.post(apiURL + "/plates", plate);
    return response.data;
  },
  async deletePlateById(plateId) {
    try {
      const response = await axios.delete(apiURL + "/plates/" + plateId);
      if (response.status === 200) return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  async deletePlates(ids) {
    try {
      const response = await axios.delete(apiURL + "/plates", { data: ids });
      if (response.status === 200) return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  async editPlate(plate) {
    try {
      const response = await axios.put(apiURL + "/plates/" + plate.id, plate);
      if (response.status === 200) return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  async clonePlates(plates) {
    try {
      const plateIds = plates?.map((p) => p.id) ?? [];
      if (plateIds.length > 0) {
        const response = await axios.post(apiURL + "/plates/clone", plateIds);
        if (response.status === 200) return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  },
  async movePlates(plates, experimentId) {
    try {
      const plateIds = plates?.map((p) => p.id) ?? [];
      if (plateIds.length > 0) {
        const response = await axios.post(apiURL + "/plates/move", {
          plateIds: plateIds,
          experimentId: experimentId,
        });
        if (response.status === 200) return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  },
  async linkMeasurement(plateIds, measurementId) {
    try {
      const response = await axios.post(apiURL + "/plates/link-measurement", {
        plateIds: plateIds,
        measurementId: measurementId,
      });
      if (response.status === 200) return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  async setActivePlateMeasurement(plateMeasurement) {
    const endpoint =
      apiURL +
      "/plates/" +
      plateMeasurement.plateId +
      "/measurements/" +
      plateMeasurement.measurementId;
    const response = await axios.put(endpoint, plateMeasurement);
    return response.data;
  },
  async setPlateLayout(plates, plateTemplateId) {
    try {
      const plateIds = plates?.map((p) => p.id) ?? [];
      if (plateIds.length > 0) {
        const response = await axios.post(apiURL + "/plates/link-template", {
          plateIds: plateIds,
          plateTemplateId: plateTemplateId,
        });
        if (response.status === 200) return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  },
  async acceptWells(plateId, wells) {
    try {
      if (wells.length > 0) {
        const wellIds = wells.map((well) => well.id);
        await axios.put(`${apiURL}/plates/${plateId}/wells/accept`, {
          wellIds: wellIds,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  async rejectWells(plateId, wells, rejectionType, description) {
    try {
      if (wells.length > 0) {
        const wellIds = wells.map((well) => well.id);
        await axios.put(`${apiURL}/plates/${plateId}/wells/reject`, {
          wellIds: wellIds,
          wellStatusDTO: {
            status: rejectionType,
            description: description,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  async validatePlates(plateIds) {
    try {
      await axios.put(`${apiURL}/plates/validate`, plateIds);
    } catch (error) {
      console.log(error);
    }
  },
  async invalidatePlates(plateIds, reason) {
    try {
      const data = {
        plateIds: plateIds,
        reason: reason,
      };
      await axios.put(`${apiURL}/plates/invalidate`, data);
    } catch (error) {
      console.log(error);
    }
  },
  async resetPlateValidations(plateIds) {
    try {
      await axios.put(`${apiURL}/plates/reset-validations`, plateIds);
    } catch (error) {
      console.log(error);
    }
  },
  async approvePlates(plateIds) {
    try {
      await axios.put(`${apiURL}/plates/approve`, plateIds);
    } catch (error) {
      console.log(error);
    }
  },
  async disapprovePlates(plateIds, reason) {
    try {
      const data = {
        plateIds: plateIds,
        reason: reason,
      };
      await axios.put(`${apiURL}/plates/disapprove`, data);
    } catch (error) {
      console.log(error);
    }
  },
};
