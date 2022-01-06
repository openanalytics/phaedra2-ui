<template>
    <div class="tag-icon flex inline" v-for="tag in tags" :key="tag">
        <Tag :tagInfo="tag" :objectInfo="objectInfo" :objectClass="objectClass" :readOnly="readOnly" />
    </div>
    <q-btn round dense icon="add" size="xs" class="on-right" v-show="!readOnly" @click="showAddTagDialog = true">
      <q-tooltip :delay="500" class="text-black bg-secondary">Add a new Tag</q-tooltip>
    </q-btn>

    <q-dialog v-model="showAddTagDialog">
      <q-card style="min-width: 30vw">
        <q-card-section class="row text-h6 items-center full-width q-pa-sm bg-primary text-secondary">
          <q-icon name="add" class="q-pr-sm"/>
          Add Tag
        </q-card-section>
        <q-card-section>
          <div class="row">
              <div class="col-2 row items-center">
                <q-avatar icon="sell" color="primary" text-color="white" />
              </div>
              <div class="col-10">
                <span>New Tag Name:</span><br/>
                <q-input dense v-model="newTag" autofocus @keyup.enter="showAddTagDialog = false" />
              </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn label="Add tag" v-close-popup color="primary" @click="doAddTag" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
    import {ref, computed} from "vue";
    import {useStore} from 'vuex'
    import Tag from "@/components/tag/Tag"

    export default {
        props: {
            objectInfo: Object,
            objectClass: String,
            readOnly: Boolean
        },
        components: {
            Tag
        },
        setup(props) {
            const exported = {};
            const store = useStore();

            exported.tags = computed(() => store.getters['metadata/getTags']({ objectId: props.objectInfo.id, objectClass: props.objectClass }));

            exported.showAddTagDialog = ref(false);
            exported.newTag = ref('');

            exported.doAddTag = function () {
                store.dispatch('metadata/addTag', {
                    objectId: props.objectInfo.id,
                    objectClass: props.objectClass,
                    tag: exported.newTag.value,
                })
            };

            return exported;
        },
    }
</script>