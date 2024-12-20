import {defineStore} from "pinia"
import {ref} from "vue";
import ArrayUtils from "@/lib/ArrayUtils";
import datacaptureAPI from "@/api/datacapture";

export const useDataCaptureStore = defineStore('datacapture', () => {
  const jobs = ref([])
  const captureConfigs = ref([])
  const captureScripts = ref([])

  const getJobs = () => {
    return jobs.value
  }

  const getAllCaptureConfigs = () => {
    return captureConfigs.value
  }

  const getCaptureConfigById = (id) => {
    const captureConfig = captureConfigs.value.find(s => s.id == id)
    return captureConfig ?? null
  }

  const getAllCaptureScripts = () => {
    return captureScripts.value
  }

  const getCaptureScriptById = (id) => {
    const captureScript = captureScripts.value.find(s => s.id == id)
    return captureScript ?? null
  }

  const submitJob = async (job) => {
    if (job.files) {
      const fileGroups = ArrayUtils.groupItems(job.files, 5)
      for (let i = 0; i < fileGroups.length; i++) {
        await datacaptureAPI.uploadData(job.sourcePath, fileGroups[i])
      }
    }
    await datacaptureAPI.postJob(job);
  }

  const loadJobs = async (args) => {
    const jobs = await datacaptureAPI.getJobs(args)
  }

  const cancelJob = async (id) => {
    await datacaptureAPI.cancelJob(id)
  }

  const uploadData = async (data) => {
    await datacaptureAPI.uploadData(data);
  }

  const loadAllCaptureScripts = async () => {
    const scripts = await datacaptureAPI.getAllCaptureScripts();
  }

  const loadCaptureScriptById = async (id) => {
    const scripts = await datacaptureAPI.getCaptureScript(id);
  }

  const createCaptureScript = async (script) => {
    const newScript = await datacaptureAPI.createCaptureScript(script);
    return newScript;
  }

  const updateCaptureScript = async (script) => {
    const updatedScript = await datacaptureAPI.updateCaptureScript(script);
    return updatedScript;
  }

  const deleteCaptureScript = async (id) => {
    await datacaptureAPI.deleteCaptureScript(id);
    // ctx.commit('uncacheCaptureScript', id);
  }

  const loadAllCaptureConfigs = async () => {
    const configs = await datacaptureAPI.getAllCaptureConfigs();
  }

  const loadCaptureConfigById = async (id) => {
    const config = await datacaptureAPI.getCaptureConfig(id);
  }

  const createCaptureConfig = async (config) => {
    const newConfig = await datacaptureAPI.createCaptureConfig(config);
    return newConfig;
  }

  const updateCaptureConfig = async (config) => {
    const updatedConfig = await datacaptureAPI.updateCaptureConfig(config);
    return updatedConfig;
  }

  const deleteCaptureConfig = async (id) => {
    await datacaptureAPI.deleteCaptureConfig(id);
  }

  return {
    jobs,
    captureConfigs,
    captureScripts,
    getJobs,
    getAllCaptureConfigs,
    getCaptureConfigById,
    getAllCaptureScripts,
    getCaptureScriptById,
    submitJob,
    loadJobs,
    cancelJob,
    uploadData,
    loadAllCaptureScripts,
    loadCaptureScriptById,
    createCaptureScript,
    updateCaptureScript,
    deleteCaptureScript,
    loadAllCaptureConfigs,
    loadCaptureConfigById,
    createCaptureConfig,
    updateCaptureConfig,
    deleteCaptureConfig
  }
})
