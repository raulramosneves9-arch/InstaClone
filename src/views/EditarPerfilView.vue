<template>
  <div class="edit-profile-container mx-auto mt-4 p-4 border rounded">
    <h4 class="mb-5 edit-title">Editar Perfil</h4>

    <div v-if="successMsg" class="success-msg mb-4">
      {{ successMsg }}
    </div>

    <form @submit.prevent="submitForm">
      <!-- Avatar Section -->
      <div class="mb-5 d-flex align-items-center gap-4">
        <div class="avatar-edit-wrapper">
          <img :src="avatarPreview || authStore.user?.avatar || 'https://via.placeholder.com/150'" 
               class="rounded-circle object-fit-cover border" 
               width="44" height="44" alt="Avatar">
        </div>
        <div class="avatar-actions">
          <div class="fw-semibold mb-1">{{ authStore.user?.username }}</div>
          <label class="btn-ig-text text-primary p-0 fw-bold" for="avatarInput">
            Alterar foto de perfil
          </label>
          <input type="file" id="avatarInput" class="d-none" accept="image/jpeg, image/jpg, image/png, image/webp" @change="onAvatarChange">
          <div v-if="avatarError" class="field-error mt-1">{{ avatarError }}</div>
          <div v-if="errors.avatar" class="field-error mt-1">{{ errors.avatar[0] }}</div>
        </div>
      </div>

      <!-- Name Field -->
      <div class="row mb-3 align-items-center">
        <label for="name" class="col-sm-3 text-sm-end fw-semibold">Nome</label>
        <div class="col-sm-9">
          <input type="text" class="ig-input" id="name" v-model="form.name" :maxlength="PROFILE_NAME_MAX_LENGTH">
          <div v-if="errors.name" class="field-error">
            {{ errors.name[0] }}
          </div>
        </div>
      </div>

      <!-- Username Field -->
      <div class="row mb-3 align-items-center">
        <label for="username" class="col-sm-3 text-sm-end fw-semibold">Nome de Usuário</label>
        <div class="col-sm-9">
          <input type="text" class="ig-input" id="username" v-model="form.username" :maxlength="PROFILE_USERNAME_MAX_LENGTH">
          <div v-if="clientErrors.username" class="field-error">
            {{ clientErrors.username }}
          </div>
          <div v-if="errors.username" class="field-error">
            {{ errors.username[0] }}
          </div>
        </div>
      </div>

      <!-- Bio Field -->
      <div class="row mb-4 align-items-start">
        <label for="bio" class="col-sm-3 text-sm-end fw-semibold mt-2">Bio</label>
        <div class="col-sm-9">
          <textarea class="ig-input" id="bio" rows="4" v-model="form.bio" :maxlength="PROFILE_BIO_MAX_LENGTH"></textarea>
          <div class="text-muted x-small text-end mt-1">
            {{ form.bio.length }} / {{ PROFILE_BIO_MAX_LENGTH }}
          </div>
          <div v-if="errors.bio" class="field-error">
            {{ errors.bio[0] }}
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-9 offset-sm-3 d-flex gap-3">
          <button type="submit" class="btn-ig" :disabled="loading || hasClientErrors">
            <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status"></span>
            Enviar
          </button>
          <router-link to="/profile" class="btn-ig-text">Cancelar</router-link>
        </div>
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
.edit-profile-container {
  max-width: 935px;
  background-color: var(--bg-main);
  color: var(--text-primary);
}

.edit-title {
  font-size: 1.5rem;
  font-weight: 400;
}

.ig-input {
  width: 100%;
  padding: 8px 12px;
  background-color: var(--bg-main);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 1rem;
}

.ig-input:focus {
  border-color: var(--text-secondary);
  outline: none;
}

.field-error {
  color: var(--danger);
  font-size: 0.8rem;
  margin-top: 4px;
}

.success-msg {
  padding: 12px 16px;
  background-color: rgba(0, 149, 246, 0.1);
  border: 1px solid var(--accent);
  border-radius: var(--radius-sm);
  color: var(--accent);
}

.x-small {
  font-size: 0.75rem;
}

@media (max-width: 575px) {
  .text-sm-end {
    text-align: left !important;
  }
}
</style>
