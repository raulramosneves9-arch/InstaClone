<template>
  <div class="container py-4 edit-profile-view" style="max-width: 600px;">
    <h2 class="mb-4">Editar Perfil</h2>

    <div v-if="successMsg" class="alert alert-success">
      {{ successMsg }}
    </div>

    <form @submit.prevent="submitForm">
      <!-- Avatar Section -->
      <div class="mb-4 text-center">
        <div class="position-relative d-inline-block">
          <img :src="avatarPreview || authStore.user?.avatar || 'https://via.placeholder.com/150'" 
               class="rounded-circle object-fit-cover border" 
               width="150" height="150" alt="Avatar">
          <div class="mt-2">
            <label class="btn btn-sm btn-outline-primary" for="avatarInput">
              Alterar foto de perfil
            </label>
            <input type="file" id="avatarInput" class="d-none" accept="image/jpeg, image/jpg, image/png, image/webp" @change="onAvatarChange">
          </div>
        </div>
        <div v-if="avatarError" class="text-danger small mt-1">{{ avatarError }}</div>
        <div v-if="errors.avatar" class="text-danger small mt-1">{{ errors.avatar[0] }}</div>
      </div>

      <!-- Name Field -->
      <div class="mb-3">
        <label for="name" class="form-label">Nome</label>
        <input type="text" class="form-control" id="name" v-model="form.name" :class="{'is-invalid': errors.name}" :maxlength="PROFILE_NAME_MAX_LENGTH">
        <div v-if="errors.name" class="invalid-feedback">
          {{ errors.name[0] }}
        </div>
      </div>

      <!-- Username Field -->
      <div class="mb-3">
        <label for="username" class="form-label">Nome de Usuário</label>
        <input type="text" class="form-control" id="username" v-model="form.username" :class="{'is-invalid': errors.username || clientErrors.username}" :maxlength="PROFILE_USERNAME_MAX_LENGTH">
        <div v-if="clientErrors.username" class="invalid-feedback d-block">
          {{ clientErrors.username }}
        </div>
        <div v-if="errors.username" class="invalid-feedback">
          {{ errors.username[0] }}
        </div>
      </div>

      <!-- Bio Field -->
      <div class="mb-4">
        <label for="bio" class="form-label">Bio</label>
        <textarea class="form-control" id="bio" rows="4" v-model="form.bio" :class="{'is-invalid': errors.bio}" :maxlength="PROFILE_BIO_MAX_LENGTH"></textarea>
        <div class="form-text text-end">
          {{ form.bio.length }} / {{ PROFILE_BIO_MAX_LENGTH }}
        </div>
        <div v-if="errors.bio" class="invalid-feedback">
          {{ errors.bio[0] }}
        </div>
      </div>

      <div class="d-flex justify-content-end gap-2">
        <router-link to="/profile" class="btn btn-secondary">Cancelar</router-link>
        <button type="submit" class="btn btn-primary" :disabled="loading || hasClientErrors">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Salvar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';
import { useImageUpload } from '../composables/useImageUpload';
import {
  PROFILE_NAME_MAX_LENGTH,
  PROFILE_USERNAME_MAX_LENGTH,
  PROFILE_BIO_MAX_LENGTH
} from '../stores/profileUtils';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  name: '',
  username: '',
  bio: ''
});

const {
  imageFile: avatarFile,
  imagePreview: avatarPreview,
  uploadError: avatarError,
  handleFileChange: onAvatarChange
} = useImageUpload({
  maxFileSize: 2 * 1024 * 1024,
  sizeErrorMessage: 'A imagem não pode ter mais de 2MB.',
  typeErrorMessage: 'Formato inválido. Use JPEG, JPG, PNG ou WEBP.'
});

const errors = ref({});
const successMsg = ref('');
const loading = ref(false);

const clientErrors = reactive({
  username: ''
});

// Watch para validar o username no client-side
const validateUsername = () => {
  if (form.username && !/^[A-Za-z0-9._]+$/.test(form.username)) {
    clientErrors.username = 'O nome de usuário deve conter apenas letras, números, pontos e underscores.';
  } else {
    clientErrors.username = '';
  }
};

const hasClientErrors = computed(() => {
  validateUsername();
  return !!clientErrors.username || !!avatarError.value;
});

onMounted(() => {
  if (authStore.user) {
    form.name = authStore.user.name || '';
    form.username = authStore.user.username || '';
    form.bio = authStore.user.bio || '';
  }
});

async function submitForm() {
  if (hasClientErrors.value) return;

  loading.value = true;
  errors.value = {};
  successMsg.value = '';

  try {
    // 1. Update basic info
    await api.put('/users/me', {
      name: form.name,
      username: form.username,
      bio: form.bio
    });

    // 2. Upload avatar if selected
    if (avatarFile.value) {
      const formData = new FormData();
      formData.append('avatar', avatarFile.value);
      await api.post('/users/me/avatar', formData);
    }

    // Refresh user data
    await authStore.fetchMe();
    
    successMsg.value = 'Perfil atualizado com sucesso!';
    setTimeout(() => {
      router.push('/profile');
    }, 1500);

  } catch (err) {
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors;
    } else {
      errors.value = { general: ['Erro ao atualizar perfil.'] };
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.edit-profile-view {
  color: var(--text-primary);
}

.form-text {
  color: var(--text-secondary) !important;
}
</style>
