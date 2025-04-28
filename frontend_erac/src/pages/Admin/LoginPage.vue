<template>
  <q-card class="login-card">
    <div class="logo-container">
      <q-img src="src/assets/tagumlogo.png" class="logo" contain spinner-color="white" />
    </div>
    <q-card-section>
      <div></div>
    </q-card-section>
    <q-card-section> </q-card-section>
    <q-card-section class="text-center">
      <div class="text-h6 text-green-8 text-bold">City Accounting Office</div>
      <div class="text-caption text-gray" style="font-style: oblique">
        Electronic Registry of Appropriation and Commitment (eRAC)
      </div>
    </q-card-section>
    <q-card-section class="text-center">
      <div class="text-h5 text-green-8 text-bold">Admin</div>
    </q-card-section>
    <q-card-section>
      <q-input
        color="green"
        v-model="username"
        label="Username"
        outlined
        dense
        :prepend-icon="'user'"
      />
      <q-input
        color="primary"
        v-model="password"
        label="Password"
        outlined
        dense
        type="password"
        class="q-mt-md"
        :prepend-icon="'lock'"
      />
      <div class="text-right text-blue text-caption cursor-pointer q-mt-sm">Forgot password?</div>
      <q-btn label="Sign In" color="green" class="full-width q-mt-md" @click="handleLogin" />
    </q-card-section>
    <q-card-section class="text-center">
      <div class="text-caption q-mt-sm">
        Switch to <span class="text-blue cursor-pointer" @click="goToUser">User</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
export default {
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    login() {
      // Implement login logic here
      console.log('Logging in with:', this.email, this.password)
    },
  },

  setup() {
    const $q = useQuasar()
    const router = useRouter()

    const handleLogin = async () => {
      try {
        // Your login logic here
        $q.notify({
          type: 'positive',
          message: 'Login successful!',
          position: 'top',
          timeout: 2500,
        })
        router.push('/admin/dashboard') // Redirect to the dashboard or home page after login
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Login failed: ' + error.message,
        })
      }
    }

    const goToUser = () => {
      router.push('/') // Make sure this matches your signup route
    }

    return {
      handleLogin,
      goToUser,
    }
  },
}
</script>

<style scoped>
.login-card {
  width: 400px;
  padding: 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255);
  position: relative;
  box-shadow: 0 8px 8px rgb(38, 121, 0);
  margin-top: 120px;
}
</style>
