<template>
  <q-layout view="lHh lpR ffr" no-shadow>
    <q-header elevated class="custom-header">
      <q-toolbar class="justify-end q-pr-md">
        <q-btn flat round dense>
          <q-avatar size="45px">
            <img
              :src="authStore.user?.photo_url || 'src/assets/user.png'"
              @error="handleImageError"
            />
          </q-avatar>
          <q-menu transition-show="jump-down" transition-hide="jump-up">
            <q-list class="q-pa-sm" style="min-width: 180px">
              <!-- User Info (non-clickable) -->
              <q-item class="q-mb-sm" v-if="authStore.user">
                <q-item-section>
                  <div class="text-subtitle2">
                    {{ authStore.user.first_name }} {{ authStore.user.last_name }}
                  </div>
                  <div class="text-caption text-grey">
                    {{ authStore.user.position }}
                  </div>
                </q-item-section>
              </q-item>

              <q-separator />

              <!-- Settings -->
              <q-item clickable v-close-popup @click="goToSettings">
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>
                <q-item-section>Settings</q-item-section>
              </q-item>

              <!-- Logout -->
              <q-item clickable v-close-popup @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width="250"
      :breakpoint="767"
      show-if-above
      class="custom-card-drawer"
    >
      <q-list>
        <q-item class="column items-center q-pt-md">
          <img
            src="src/assets/tagumlogo.png"
            alt="ERACS Logo"
            style="width: 80px; height: 75px"
            class="q-mb-sm"
          />
          <q-item-label class="eracs-title">
            Electronic Registry of Appropriation and Commitment (eRAC)
          </q-item-label>
        </q-item>
        <br />

        <NavLink
          v-for="link in navLinks"
          :key="link.title"
          v-bind="link"
          :expanded="expanded[link.title] || false"
          @toggle="toggleExpand(link.title)"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import NavLink from 'components/Nav/NavLink.vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const route = useRoute()
const imageLoadingFailed = ref(false)

const handleImageError = (e) => {
  e.target.src = 'src/assets/user.png'
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login') // Handle redirect in component
}

onMounted(async () => {
  await authStore.initialize()
})

onMounted(() => {
  // Preload image when component mounts
  if (authStore.user?.photo_url || authStore.user?.photo_path) {
    const img = new Image()
    img.src = userPhoto.value
  }
})

// Reset image state when user changes
watch(
  () => authStore.user,
  () => {
    imageLoadingFailed.value = false
  },
  { deep: true },
)

const userPhoto = computed(() => {
  if (!authStore.user) return 'src/assets/user.png'

  // Use photo_url if available, otherwise try constructing from photo_path
  return (
    authStore.user.photo_url ||
    (authStore.user.photo_path ? `/storage/${authStore.user.photo_path}` : 'src/assets/user.png')
  )
})

watch(
  () => route.meta.title,
  (newTitle) => {
    document.title = newTitle ? `${newTitle} | ERACS` : 'ERACS'
  },
)

const navLinks = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    link: '/home/dashboard',
  },
  {
    title: 'Transactions',
    icon: 'receipt_long',
    children: [
      { title: 'Appropriation', link: '/home/transactions/appropriation' },
      { title: 'Disbursement', link: '/home/transactions/disbursement' },
      { title: 'Augmentation', link: '/home/transactions/augmentation' },
    ],
  },
  {
    title: 'Continuing',
    icon: 'sync',
    children: [
      { title: 'Appropriation', link: '/home/continuing/appropriation' },
      { title: 'Disbursement', link: '/home/continuing/disbursement' },
      { title: 'Augmentation', link: '/home/continuing/augmentation' },
    ],
  },
  {
    title: 'Libraries',
    icon: 'library_books',
    children: [
      { title: 'Accounts', link: '/home/libraries/accounts' },
      { title: 'Particulars', link: '/home/libraries/particulars' },
      { title: 'Bank', link: '/home/libraries/bank' },
      { title: 'Continuing', link: '/home/libraries/continuing' },
    ],
  },
  {
    title: 'Reports',
    icon: 'assessment',
    link: '/home/reports',
  },
]

const leftDrawerOpen = ref(false)

// Track expanded state for each dropdown
const expanded = ref({
  Transactions: false,
  Continuing: false,
  Libraries: false,
})

// Toggle dropdown state
const toggleExpand = (title) => {
  if (Object.hasOwn(expanded.value, title)) {
    expanded.value[title] = !expanded.value[title]
  }
}
</script>

<style>
.custom-card-drawer {
  background: linear-gradient(to bottom, rgb(255, 255, 255), #58b265);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.custom-header {
  background: rgba(223, 237, 225, 1);
}

/* Smooth transitions */
.q-slide-transition {
  transition: max-height 0.9s ease;
}

.eracs-title {
  color: rgba(2, 2, 2, 0.7);
  font-size: 0.95rem;
  font-weight: bolder;
  text-align: center;
}
</style>
