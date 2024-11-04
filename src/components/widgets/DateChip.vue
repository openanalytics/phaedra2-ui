<template>
  <q-chip dense size="12px " v-if="dateTime">
    <q-avatar font-size="1em" icon="event" />
    <span>
      {{ formattedDate }}
    </span>
    <q-tooltip v-if="onHoverMessage" :offset="[10, 10]">
      {{ onHoverMessage }}
    </q-tooltip>
  </q-chip>
</template>

<script setup>
import { computed } from "vue";
import FormatUtils from "@/lib/FormatUtils.js";

const props = defineProps({
  dateTime: String,
  onHoverMessage: String,
});

const formattedDate = computed(() => FormatUtils.formatDate(props.dateTime));
</script>
