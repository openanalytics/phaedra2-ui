<template>
    <q-page class="oa-root-div">
        <oa-section title="Post Message" icon="mail" class="q-pa-sm">
            <div class="row q-pa-md">
                <q-form class="full-width" @submit="doPostMessage">
                    <q-input label="Topic" v-model="message.topic" dense/>
                    <q-input label="Key" v-model="message.key" dense/>
                    <q-input label="Body" v-model="message.body" type="textarea" dense/>

                    <div class="row justify-end q-pt-md">
                        <q-btn label="Post" type="submit" color="primary" class="on-right"/>
                    </div>
                </q-form>
            </div>
        </oa-section>
    </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar'
import OaSection from "@/components/widgets/OaSection";
import pipelinesAPI from "@/api/pipelines";

const $q = useQuasar();

const message = ref({
    topic: "",
    key: "",
    body: ""
});

const doPostMessage = async () => {
    if (message.value.topic && message.value.key && message.value.body) {
        await pipelinesAPI.postMessage(message.value);
        $q.notify({
            message: 'The message has been posted.'
        });
    }
}

</script>