<template>
    <q-chip dense size="12px">
        <q-avatar icon="account_circle" />
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

    const userName = computed(() => userInfoStore.userNames[props.id] ?? 'Unknown')
</script>
