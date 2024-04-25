<template>
    <q-chip dense size="12px" v-if="id">
        <q-avatar font-size="1em" icon="account_circle" />
        {{ userName }}
    </q-chip>
</template>

<script setup>
    import {computed} from "vue";
    import {useUserInfoStore} from "@/stores/userinfo";

    const props = defineProps({
        id: String
    });

    const userInfoStore = useUserInfoStore()
    if (!userInfoStore.userNamesLoaded)
      userInfoStore.loadUserNames()

    const userName = computed(() => userInfoStore.getUserName(props.id))
</script>
