<script setup>
import { ref } from "vue";
import { usePanesStore } from "../../stores/panes";

const props = defineProps(["position"]);
const emit = defineEmits(["dropped"]);

const panesStore = usePanesStore();

const drag = ref(false);

function allowDrop(event) {
  event.preventDefault();
}

function drop() {
  drag.value = false;
  emit("dropped", props.position);
}
</script>

<template>
  <div :class="[panesStore.draggedElement != undefined ? '' : 'invisible']">
    <div class="dropArea" :class="[position, drag ? 'activeDropArea' : '']">
      <div
        class="inactiveDropArea"
        @dragenter="drag = true"
        @dragleave="drag = false"
        @dragend="drag = false"
        v-on:drop="drop"
        v-on:dragover="allowDrop"
      ></div>
    </div>
  </div>
</template>

<style>
.invisible {
  visibility: hidden;
}
.activeDropArea {
  -webkit-box-shadow: inset 0px 0px 70px -11px rgba(50, 50, 70, 0.9);
  -moz-box-shadow: inset 0px 0px 70px -11px rgba(50, 50, 70, 0.9);
  box-shadow: inset 0px 0px 70px -11px rgba(50, 50, 70, 0.9);
}
.inactiveDropArea {
  z-index: 100;
}
.dropArea {
  display: flex;
  position: absolute;
}

.dropArea.top {
  max-width: 100%;
  width: 100%;
  max-height: 50%;
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}

.top .inactiveDropArea {
  max-width: 100%;
  width: 100%;
  max-height: 50%;
  height: 100%;
}

.dropArea.bottom {
  align-items: flex-end;
  max-width: 100%;
  width: 100%;
  max-height: 50%;
  height: 100%;
  left: 0;
  top: 50%;
  bottom: 0;
  right: 0;
}

.bottom .inactiveDropArea {
  max-width: 100%;
  width: 100%;
  max-height: 50%;
  height: 100%;
}

.dropArea.left {
  max-width: 50%;
  width: 100%;
  max-height: 100%;
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}

.left .inactiveDropArea {
  max-width: 50%;
  width: 100%;
  max-height: 100%;
  height: 100%;
}

.dropArea.right {
  max-width: 50%;
  width: 100%;
  max-height: 1000%;
  height: 100%;
  left: 50%;
  top: 0;
  bottom: 0;
  right: 0;
}

.right .inactiveDropArea {
  max-width: 50%;
  width: 100%;
  max-height: 100%;
  height: 100%;
  margin-left: 50%;
}

.dropArea.center {
  max-width: 100%;
  width: 100%;
  max-height: 100%;
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}

.center .inactiveDropArea {
  max-width: 50%;
  width: 100%;
  max-height: 50%;
  height: 100%;
  margin-left: 25%;
  margin-top: 25%;
}
</style>
