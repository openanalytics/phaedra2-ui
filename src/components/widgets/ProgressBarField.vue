<template>
    <q-linear-progress rounded size="20px" color="positive" :value="getProgressValue()">
          <div class="absolute-full flex flex-center">
            <span class="text-black text-body2">{{getValue() + ' / ' + getMaxValue()}}</span>
          </div>
    </q-linear-progress>    
</template>

<script>
    export default {
        props: {
            object: Object,
            valueFieldName: String,
            maxValueFieldName: String
        },
        setup(props) {
            const exported = {};

            exported.getValue = () => {
                return props.object ? props.object[props.valueFieldName] : 0;
            };
            exported.getMaxValue = () => {
                return props.object ? props.object[props.maxValueFieldName] : 0;
            };
            exported.getProgressValue = () => {
                const value = exported.getValue();
                const maxValue = exported.getMaxValue();
                if (maxValue === 0) return 0;
                else return value / maxValue;
            };

            return exported;
        }
    }
</script>
