<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const loggingOut = ref(false);

const logout = async () => {
    loggingOut.value = true;
    try {
        await $fetch('/api/admin/logout', { method: 'POST' });
        await router.push('/admin/login');
    } finally {
        loggingOut.value = false;
    }
};
</script>

<template>
    <div class="flex min-h-screen flex-col bg-mascarpone">
        <header class="border-b border-espresso/10 bg-espresso text-mascarpone">
            <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
                <NuxtLink to="/admin" class="font-display text-xl tracking-tight text-mascarpone">
                    Manjarmio <span class="text-saffron">Admin</span>
                </NuxtLink>
                <button v-if="route.path !== '/admin/login'" type="button" @click="logout" :disabled="loggingOut"
                    class="rounded-full border border-mascarpone/30 px-4 py-1.5 text-xs font-semibold text-mascarpone/80 transition-colors hover:border-mascarpone hover:text-mascarpone disabled:opacity-50">
                    {{ loggingOut ? 'Saliendo...' : 'Cerrar sesión' }}
                </button>
            </div>
        </header>
        <main class="flex-1">
            <slot />
        </main>
    </div>
</template>
