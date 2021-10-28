<template>
    <q-page>
        <div class="q-pa-md">
            <div class="row text-h6 items-center q-px-md oa-section-title">
                <q-icon name="scanner" class="q-mr-sm"/>
                DataCapture Jobs
            </div>
            <div class="row q-pa-lg oa-section-body">
                <CaptureJobsList></CaptureJobsList>
            </div>
        </div>
    </q-page>
</template>

<script>
    import CaptureJobsList from "./CaptureJobsList";

    export default {
        components: {
            CaptureJobsList
        },
        setup() {
            return {}
        }
    }
</script>