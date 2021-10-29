<template>
    <q-card style="width: 1000px; max-width: 80vw;">
        <q-card-section class="bg-primary text-white">
            <div class="text-h6"><q-icon name="scanner" class="q-mr-sm"/>DataCapture Job Details</div>
        </q-card-section>
        <q-card-section class="q-pa-md q-gutter-sm">
            <div class="row">
                <div class="col-4">Created On:</div>
                <div class="col-8">{{FormatUtils.formatDate(job.createDate)}}</div>
            </div>
            <div class="row">
                <div class="col-4">Created By:</div>
                <div class="col-8">{{job.createdBy}}</div>
            </div>
            <div class="row">
                <div class="col-4">Source Path:</div>
                <div class="col-8">{{job.sourcePath}}</div>
            </div>
            <div class="row">
                <div class="col-4">Status:</div>
                <q-badge :color="ColorUtils.getCaptureJobStatusColor(job.statusCode)">{{job.statusCode}}</q-badge>
            </div>
            <div class="row">
                <div class="col-4">Message:</div>
                <div class="col-8">{{job.statusMessage}}</div>
            </div>
            <div class="row">
                <div class="col-4">Capture Configuration:</div>
                <div class="col-8">{{job.captureConfig}}</div>
            </div>
        </q-card-section>
    </q-card>
</template>

<script>
    import FormatUtils from "@/lib/FormatUtils.js"
    import ColorUtils from "@/lib/ColorUtils.js"

    export default {
        props: {
            job: Object
        },
        setup() {
            return {
                FormatUtils,
                ColorUtils
            }
        }
    }
</script>