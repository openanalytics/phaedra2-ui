<template>
    <q-menu>
        <q-list>
            <q-item dense clickable @click="$refs.deleteDialog.showDialog = true">
                <q-item-section avatar><q-icon name="delete"/></q-item-section>
                <q-item-section>Delete</q-item-section>
            </q-item>
        </q-list>
    </q-menu>
    <DeleteExperimentDialog ref="deleteDialog" :experimentId="experimentId" />
</template>

<script setup>
    import DeleteExperimentDialog from "@/components/experiment/DeleteExperimentDialog";

    // export default {
        const props = defineProps({
            experimentId: Number
        })

    const showDeleteDialog = () => {

    }
            // DeleteExperimentDialog
        // },
        // setup() {
        //     return {};
        // }
    // }
</script>
