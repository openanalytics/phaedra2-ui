<template>
    <q-linear-progress rounded size="20px" color="positive" :value="getProgressValue()">
          <div class="absolute-full flex flex-center">
            <span class="text-black text-body2">{{actualValue + ' / ' + maxValue}}</span>
          </div>
    </q-linear-progress>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps(['actualValue', 'maxValue'])
const actualValue = computed(() => props.actualValue ? props.actualValue : 0)
const maxValue = computed(() => props.maxValue ? props.maxValue : 0)

const getProgressValue = () => {
  if (maxValue.value === 0) return 0;
  else return actualValue.value / maxValue.value;
}
</script>
