<script setup lang="ts">
definePageMeta({ layout: 'admin' });

const password = ref('');
const error = ref('');
const loading = ref(false);
const router = useRouter();

const submit = async () => {
    error.value = '';
    loading.value = true;
    try {
        await $fetch('/api/admin/login', {
            method: 'POST',
            body: { password: password.value },
        });
        await router.push('/admin');
    } catch {
        error.value = 'Contraseña incorrecta';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="mx-auto flex max-w-sm flex-col items-center px-4 py-24">
        <h1 class="font-display text-2xl text-espresso">Acceso administrador</h1>
        <form class="mt-8 w-full space-y-4" @submit.prevent="submit">
            <div>
                <label for="password" class="font-mono text-xs uppercase tracking-widest text-espresso/60">
                    Contraseña
                </label>
                <input id="password" v-model="password" type="password" autofocus required
                    class="mt-2 w-full rounded-xl border border-espresso/20 bg-white px-4 py-2.5 text-sm text-espresso focus:border-cocoa focus:outline-none" />
            </div>
            <p v-if="error" class="text-sm text-cocoa">{{ error }}</p>
            <button type="submit" :disabled="loading"
                class="w-full rounded-full bg-espresso px-4 py-2.5 text-sm font-semibold text-mascarpone transition-colors hover:bg-cocoa disabled:opacity-50">
                {{ loading ? 'Ingresando...' : 'Ingresar' }}
            </button>
        </form>
    </div>
</template>
