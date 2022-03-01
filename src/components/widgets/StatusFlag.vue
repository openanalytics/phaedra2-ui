<template>
    <div>
        <q-icon :name="flag.name" :color="flag.color">
          <q-tooltip v-if="statusReason != null">
            {{ statusReason }}
          </q-tooltip>
        </q-icon>
    </div>
</template>

<script>
import {computed} from "vue";

export default {
    props: {
        object: Object,
        statusField: String,
    },
    setup(props) {
        const negativeFlag = { name: 'cancel', color: 'negative' };
        const positiveFlag = { name: 'check_circle', color: 'positive' };
        const neutralFlag = { name: 'horizontal_rule', color: '' };

        const statusValue = computed(() => props.object[props.statusField] || 'unknown');
        
        let flags = {
            'unknown': neutralFlag,
            
            'CALCULATION_NEEDED': neutralFlag,
            'CALCULATION_OK': positiveFlag,
            'CALCULATION_NOT_POSSIBLE': negativeFlag,
            'CALCULATION_ERROR': negativeFlag,
            
            'VALIDATION_NOT_SET': neutralFlag,
            'VALIDATED': positiveFlag,
            'INVALIDATED': negativeFlag,

            'APPROVAL_NOT_SET': neutralFlag,
            'APPROVED': positiveFlag,
            'DISAPPROVED': negativeFlag
        };
        const flag = computed(() => flags[statusValue.value]);

        const statusReason = computed(() => {
            if (statusValue.value == 'INVALIDATED') return props.object.invalidatedReason;
            if (statusValue.value == 'DISAPPROVED') return props.object.disapprovedReason;
            return null;
        });

        return {
            flag,
            statusReason
        }
    }
}
</script>
