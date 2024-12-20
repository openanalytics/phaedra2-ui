<template>
  <q-file label="Select source file(s)" v-model="state.files" multiple>
    <template v-slot:append>
      <q-icon name="folder" />
    </template>
  </q-file>
  <!--  <q-field borderless dense>-->
  <!--&lt;!&ndash;    <template v-slot:control>&ndash;&gt;-->
  <!--      <q-input label="Select a source ..." v-model="state.files" type="text"-->
  <!--               dense stack-label readonly disable style="width: 100%;"/>-->
  <!--&lt;!&ndash;    </template>&ndash;&gt;-->
  <!--&lt;!&ndash;    <template v-slot:append>&ndash;&gt;-->
  <!--&lt;!&ndash;      <input ref="fileInput" type="file" webkitdirectory style="display: none;"&ndash;&gt;-->
  <!--&lt;!&ndash;             @change="handleDirectorySelect"/>&ndash;&gt;-->
  <!--    <input ref="fileInput" type="file" style="display: none;"-->
  <!--           @change="handleDirectorySelect"/>-->
  <!--      <q-btn icon="folder" @click="$refs.fileInput.click()" class="oa-button-auto"/>-->
  <!--&lt;!&ndash;    </template>&ndash;&gt;-->
  <!--  </q-field>-->

  <!--  <div v-if="state.uploading">Uploading...</div>-->
</template>

<script setup>
import { useStore } from "vuex";
import { reactive, ref } from "vue";

const store = useStore();

const state = reactive({
  uploading: false,
  directory: null,
  files: null,
});

const handleDirectorySelect = (event) => {
  state.directory = event.target.files[0].webkitRelativePath.split("/")[0];
  state.fileNames = event.target.files.map((file) => file.webkitRelativePath);
  state.files = [...event.target.files];
};

const uploadDirectoryItems = async () => {
  if (!state.directory) {
    return;
  }

  state.uploading = true;

  const formData = new FormData();
  formData.append("directory", state.directory);

  // const files = [...directory.value.files];
  try {
    // for (let i = 0; i < files.length; i++) {
    //   const formData = new FormData();
    //   formData.append('files[]', files[i]);
    //   // store.dispatch('datacapture/uploadData', formData);
    // }
    const selectedDirectories = getUniqueParentDirs();
    // await store.dispatch('datacapture/uploadData', formData)
    state.uploading = false;
  } catch (error) {
    console.error(error);
    state.uploading = false;
  }
};

const getUniqueParentDirs = () => {
  const parentDirs = new Set();

  if (state.files) {
    for (const file of state.files) {
      const levels = file.webkitRelativePath.split("/").length;
      const parent = levels > 2 ? levels - 2 : levels - 1;
      const parentDir = file.webkitRelativePath.split("/")[parent];
      parentDirs.add(parentDir);
    }
  }
  return [...parentDirs];
};
</script>

<style>
.custom-file-upload {
  display: inline-block;
  border: 1px solid #ccc;
  background-color: #f2f2f2;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
}

.custom-file-upload:hover {
  background-color: #e6e6e6;
}
</style>
