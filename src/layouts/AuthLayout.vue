<template>
    <div class="auth-layout d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-md-6 col-lg-4">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.auth-layout {
    background-color: var(--color-bg) !important;
}
</style>