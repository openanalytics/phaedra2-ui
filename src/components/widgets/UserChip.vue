<template>
    <q-chip dense>
        <q-avatar icon="account_circle" />
        {{ userName }}
    </q-chip>
</template>

<script setup>
    import {computed} from "vue";
    import {useStore} from 'vuex'

    const props = defineProps({
        id: String
    });

    const store = useStore();
    const userName = computed(() => store.getters['userinfo/getUserName'](props.id));
    if (!store.getters['userinfo/areUserNamesLoaded']()) store.dispatch('userinfo/loadUserNames');
</script>
