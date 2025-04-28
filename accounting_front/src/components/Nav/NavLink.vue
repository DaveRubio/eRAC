<template>
  <div>
    <!-- Parent Item -->
    <q-item
      clickable
      :to="hasChildren ? null : props.link"
      class="nav-menu"
      @click="handleClick"
      active-class="active-menu"
    >
      <q-item-section v-if="props.icon" avatar>
        <q-icon :name="props.icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ props.title }}</q-item-label>
      </q-item-section>

      <!-- Dropdown arrow indicator if has children -->
      <q-item-section avatar v-if="hasChildren">
        <q-icon :name="isExpanded ? 'expand_less' : 'expand_more'" />
      </q-item-section>
    </q-item>

    <!-- Child Items -->
    <q-slide-transition>
      <q-list v-show="hasChildren && isExpanded" class="modern-tree-menu">
        <q-item
          v-for="child in props.children"
          :key="child.title"
          clickable
          :to="child.link"
          class="modern-submenu"
          active-class="modern-submenu-active"
        >
          <q-item-section avatar class="tree-icon">
            <q-icon name="circle" size="6px" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ child.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-slide-transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: '#',
  },
  icon: {
    type: String,
    default: '',
  },
  children: {
    type: Array,
    default: () => [],
  },
  expanded: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle'])

const hasChildren = computed(() => props.children && props.children.length > 0)
const isExpanded = computed(() => props.expanded)

const handleClick = () => {
  if (hasChildren.value) {
    emit('toggle')
  }
}
</script>

<style scoped>
.active-menu {
  background-color: rgba(6, 100, 6, 0.6) !important;
  color: white !important;
}

.nav-menu {
  border-radius: 4px;
  color: rgba(2, 2, 2, 0.655);
  font-size: 18px;
  font-weight: bolder;
}

.nav-menu:hover {
  background-color: rgb(255, 255, 255);
  color: #056e1f;
}

/* Modern Tree Menu Container */
.modern-tree-menu {
  margin-left: 24px;
  padding-left: 8px;
  position: relative;
}

/* Vertical connecting line */
.modern-tree-menu:before {
  content: '';
  position: absolute;
  left: 16px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(6, 100, 6, 0.3) 10%,
    rgba(6, 100, 6, 0.3) 90%,
    transparent 100%
  );
}

/* Submenu Items */
.modern-submenu {
  padding: 6px 12px;
  margin: 2px 0;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.665);
  font-size: 15px;
  font-weight: bolder;
  transition: all 0.2s ease;
  position: relative;
}

/* Active State (keeps your color scheme) */
.modern-submenu-active {
  background-color: rgba(6, 100, 6, 0.6) !important;
  color: white !important;
  font-weight: bold;
}

/* Hover State */
.modern-submenu:hover {
  background-color: rgb(255, 255, 255);
  color: #056e1f;
}

/* Tree icon styling */
.tree-icon {
  min-width: 24px;
  color: rgba(6, 100, 6, 0.6);
}

.modern-submenu-active .tree-icon {
  color: white;
}

/* Animation for smoother transitions */
.q-slide-transition {
  transition: all 0.25s ease;
}
</style>
