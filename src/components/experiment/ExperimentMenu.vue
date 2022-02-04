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

<script>
    import DeleteExperimentDialog from "@/components/experiment/DeleteExperimentDialog";

    export default {
        props: {
            experimentId: Number
        },
        components: {
            DeleteExperimentDialog
        },
        setup() {
            return {};
        }
    }
</script>