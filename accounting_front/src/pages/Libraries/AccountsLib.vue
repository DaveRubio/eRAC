<template>
  <q-page class="q-pa-lg">
    <div class="page-header q-mb-lg">
      <div class="text-h5 text-weight-bold">Accounts Library</div>
    </div>

    <!-- Top Controls -->
    <!-- Main Card -->
    <q-card
      class="q-pa-none shadow-3 rounded-borders q-mx-auto"
      style="overflow: hidden; max-width: 900px; height: 70vh"
    >
      <!-- Header Section -->
      <div class="row items-center justify-between bg-grey-3 q-pa-md">
        <q-select
          v-model="selectedYear"
          :options="yearOptions"
          label="Select Year"
          outlined
          dense
          style="width: 300px"
          :loading="accountsStore.loading"
          :disable="accountsStore.loading || !yearOptions.length"
          emit-value
          map-options
        >
          <template v-slot:selected>
            <span v-if="selectedYear">{{ selectedYear }}</span>
            <span v-else class="text-grey">Current Year: {{ currentYear }}</span>
          </template>
          <template v-if="yearOptions.length === 0 && !accountsStore.loading" #no-option>
            <q-item>
              <q-item-section class="text-grey">No years available</q-item-section>
            </q-item>
          </template>
        </q-select>

        <div>
          <q-btn
            icon="add"
            label="Add Year"
            class="allocate-btn"
            @click="showAddYearDialog = true"
          />
          <q-btn
            icon="content_copy"
            label="Copy to Another Year"
            @click="showCopyDialog = true"
            :disable="!selectedYear || yearOptions.length < 2"
            class="q-ml-sm allocate-btn"
          />
        </div>
      </div>

      <q-card flat class="q-pt-xs rounded-borders bg-white">
        <!-- Add Account Button -->
        <div class="scroll-content q-pa-md">
          <div class="row items-center justify-between q-mb-sm">
            <!-- Search Input (left-aligned) -->
            <q-input
              v-model="searchQuery"
              dense
              outlined
              placeholder="Search..."
              class="col-md-4 col-sm-6 col-xs-12"
              style="min-width: 300px"
            >
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>

            <!-- Add Account Button (right-aligned) -->
            <q-btn
              icon="add"
              label="Add Account"
              @click="showAddClassForm"
              :disable="!selectedYear"
              class="col-auto allocate-btn"
            />
          </div>

          <!-- Account Entries -->
          <div ref="sortableContainer" style="max-height: calc(70vh - 150px); overflow-y: auto">
            <template v-for="expenseClass in filteredExpenseClasses" :key="expenseClass.id">
              <div
                class="draggable-item"
                :data-id="expenseClass.id"
                @mouseover="hoveredClass = expenseClass.id"
                @mouseleave="hoveredClass = null"
              >
                <q-card flat bordered class="q-mb-sm shadow-1">
                  <q-expansion-item
                    :model-value="expandedClasses[expenseClass.id]"
                    @update:model-value="toggleExpansion(expenseClass.id)"
                    class="rounded-borders"
                    header-class="q-pa-none"
                    expand-icon-class="hidden"
                    dense
                  >
                    <template #header>
                      <div
                        class="bg-white q-pa-md full-width row items-center justify-between rounded-borders"
                        style="border: 1px solid #e0e0e0"
                      >
                        <div class="row items-center">
                          <q-icon name="drag_indicator" class="drag-handle q-mr-sm" />
                          <div class="text-body1 text-weight-medium">{{ expenseClass.name }}</div>
                        </div>
                        <div class="row items-center q-gutter-sm">
                          <q-btn
                            dense
                            flat
                            round
                            icon="edit"
                            class="edit-btn"
                            @click.stop="editExpenseClass(expenseClass)"
                          />
                          <q-btn
                            dense
                            flat
                            round
                            icon="delete"
                            class="delete-btn"
                            @click.stop="confirmDeleteExpenseClass(expenseClass)"
                          />
                          <q-btn
                            dense
                            flat
                            round
                            icon="add"
                            @click.stop="showAddTypeForm(expenseClass)"
                            class="add-btn"
                          />
                          <q-icon
                            :name="expandedClasses[expenseClass.id] ? 'expand_less' : 'expand_more'"
                            color="grey"
                          />
                        </div>
                      </div>
                    </template>

                    <!-- Expanded Content (with drag for types) -->
                    <div class="q-pa-md">
                      <div class="text-subtitle1 text-weight-medium q-mb-xs"></div>
                      <div class="text-caption text-grey-7 q-mb-md">
                        Expenses under {{ expenseClass.name }}
                      </div>

                      <!--Expense Type-->
                      <div
                        :ref="(el) => initTypeContainer(el, expenseClass.id)"
                        class="type-container"
                      >
                        <template
                          v-for="expenseType in getExpenseTypesForClass(expenseClass.id)"
                          :key="expenseType.id"
                        >
                          <div class="draggable-type" :data-id="expenseType.id">
                            <q-card flat bordered class="q-mb-xs shadow-1">
                              <q-expansion-item
                                v-model="expandedTypes[expenseType.id]"
                                class="type-expansion"
                                header-class="q-pa-none"
                                expand-icon-class="hidden"
                              >
                                <template #header>
                                  <div
                                    class="bg-white q-pa-sm full-width row items-center justify-between rounded-borders"
                                  >
                                    <div class="row items-center">
                                      <q-icon name="drag_indicator" class="drag-handle q-mr-sm" />
                                      <div class="text-body2">{{ expenseType.name }}</div>
                                    </div>
                                    <div class="row items-center q-gutter-xs">
                                      <q-btn
                                        dense
                                        flat
                                        round
                                        icon="edit"
                                        class="edit-btn"
                                        @click.stop="editExpenseType(expenseType)"
                                      />
                                      <q-btn
                                        dense
                                        flat
                                        round
                                        icon="delete"
                                        class="delete-btn"
                                        @click.stop="confirmDeleteExpenseType(expenseType)"
                                      />
                                      <q-btn
                                        dense
                                        flat
                                        round
                                        icon="add"
                                        class="allocate-btn"
                                        @click.stop="showAddItemDialogForType(expenseType)"
                                      />
                                      <q-icon
                                        :name="
                                          expandedTypes[expenseType.id]
                                            ? 'expand_less'
                                            : 'expand_more'
                                        "
                                        color="grey"
                                        class="q-ml-xs"
                                      />
                                    </div>
                                  </div>
                                </template>

                                <!-- Expense Items List -->
                                <!-- Expense Items List -->
                                <div class="q-p-xs item-container">
                                  <div
                                    :ref="
                                      (el) => {
                                        if (el) initItemContainer(el, expenseType.id)
                                      }
                                    "
                                    class="item-container"
                                  >
                                    <template
                                      v-for="item in getExpenseItemsForType(expenseType.id)"
                                      :key="item.id"
                                    >
                                      <div class="draggable-item" :data-id="item.id">
                                        <q-card flat bordered style="max-width: 100%">
                                          <div class="q-pa-xs row items-center justify-between">
                                            <div class="row items-center justify-center">
                                              <q-icon
                                                name="drag_indicator"
                                                class="drag-handle q-mr-sm"
                                              />
                                              <div class="text-body2">{{ item.name }}</div>
                                            </div>
                                            <div class="row no-wrap items-center">
                                              <q-btn
                                                dense
                                                flat
                                                round
                                                icon="edit"
                                                class="edit-btn"
                                                @click="editExpenseItem(item)"
                                              />
                                              <q-btn
                                                dense
                                                flat
                                                round
                                                icon="delete"
                                                class="delete-btn"
                                                @click="confirmDeleteExpenseItem(item)"
                                              />
                                            </div>
                                          </div>
                                        </q-card>
                                      </div>
                                    </template>
                                  </div>
                                </div>
                              </q-expansion-item>
                            </q-card>
                          </div>
                        </template>
                      </div>
                    </div>
                  </q-expansion-item>
                </q-card>
              </div>
            </template>
          </div>
        </div>
      </q-card>
    </q-card>

    <!-- Add Year Dialog -->
    <q-dialog v-model="showAddYearDialog" persistent>
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Add New Fiscal Year</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newYear"
            filled
            label="Year (YYYY)"
            mask="####"
            outlined
            :rules="[
              (val) => !!val || 'Year is required',
              (val) => val?.length === 4 || 'Must be 4 digits',
              (val) =>
                !accountsStore.years.some((y) => y.year.toString() === val) ||
                'Year already exists',
            ]"
            :disable="accountsStore.loading"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            :disable="accountsStore.loading"
            v-close-popup
          />
          <q-btn
            flat
            label="Save"
            color="primary"
            @click="addYear"
            :loading="accountsStore.loading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!--AddExpenseClass-->
    <q-dialog v-model="showAddClassDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Add New Expense Class</div>
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="newExpenseClass"
            :options="expenseClassOptions"
            label="Expense Class"
            outlined
            use-input
            input-debounce="0"
            @filter="filterExpenseClasses"
            @new-value="createExpenseClass"
            :rules="[(val) => !!val || 'Required']"
          >
            <template v-slot:after>
              <q-btn round dense flat icon="add" @click="newExpenseClass = 'Other'" />
            </template>
          </q-select>

          <q-input
            v-if="newExpenseClass === 'Other'"
            v-model="customExpenseClass"
            label="Specify Expense Class"
            outlined
            class="q-mt-md"
            :rules="[(val) => !!val || 'Required']"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup @click="resetClassForm" />
          <q-btn flat label="Save" class="modal-save-btn" @click="saveExpenseClass" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!--AddExpenseType-->
    <q-dialog v-model="showAddTypeDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <!-- Dynamic header showing parent class -->
          <div class="text-h6">Add New Expense Type in {{ getSelectedClassName() }}</div>
        </q-card-section>
        <q-card-section>
          <!-- Simple input (no select options) -->
          <q-input
            v-model="newExpenseType.name"
            label="Type Name"
            outlined
            :rules="[(val) => !!val || 'Required']"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup @click="resetTypeForm" />
          <q-btn flat label="Save" class="modal-save-btn" @click="saveExpenseType" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Copy to Another Year -->
    <q-dialog v-model="showCopyDialog">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Copy to Another Year</div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">Select Target Year:</div>
          <q-select
            v-model="copyTargetYear"
            :options="years.filter((y) => y !== selectedYear)"
            label="Target Year"
            outlined
            :rules="[(val) => !!val || 'Required']"
            @update:model-value="checkForDuplicates"
          />

          <div v-if="duplicateWarning" class="text-warning q-mt-sm q-mb-sm">
            <q-icon name="warning" /> {{ duplicateWarning }}
          </div>

          <div class="text-subtitle2 q-mt-md q-mb-sm">Select Classes to Copy:</div>
          <q-list bordered>
            <q-item
              v-for="expenseClass in filteredExpenseClasses"
              :key="expenseClass.id"
              tag="label"
            >
              <q-item-section side>
                <q-checkbox
                  v-model="selectedClassesToCopy"
                  :val="expenseClass.id"
                  :disable="classExistsInYear(expenseClass.name, copyTargetYear)"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ expenseClass.name }}</q-item-label>
                <q-item-label caption>
                  {{ getExpenseTypesForClass(expenseClass.id).length }} types
                  <span
                    v-if="classExistsInYear(expenseClass.name, copyTargetYear)"
                    class="text-warning"
                  >
                    (Already exists in {{ copyTargetYear }})
                  </span>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Copy" class="modal-save-btn" @click="copyClassesToYear" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Edit Dialogs and Delete Confirmations -->
    <q-dialog v-model="showEditClassDialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Edit Expense Class</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="editingExpenseClass.name"
            label="Expense Class Name"
            outlined
            :rules="[(val) => !!val || 'Name is required']"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="updateExpenseClass" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Edit Expense Type Dialog -->
    <q-dialog v-model="showEditTypeDialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Edit Expense Type</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="editingExpenseType.name"
            label="Expense Type Name"
            outlined
            :rules="[(val) => !!val || 'Name is required']"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="updateExpenseType" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirm Delete</div>
        </q-card-section>

        <q-card-section> Are you sure you want to delete {{ itemToDelete?.name }}? </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="confirmDelete" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Add Item Dialog -->
    <q-dialog v-model="showAddItemDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Add New Expense Item</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="newExpenseItem.name"
            label="Item Name"
            outlined
            :rules="[(val) => !!val || 'Name is required']"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" class="modal-save-btn" @click="saveExpenseItem" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Edit Item Dialog -->
    <q-dialog v-model="showEditItemDialog">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Edit Expense Item</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="editingExpenseItem.name"
            label="Item Name"
            outlined
            :rules="[(val) => !!val || 'Name is required']"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="updateExpenseItem" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- (Same as previous implementation) -->
  </q-page>
</template>
<script setup>
import Sortable from 'sortablejs'
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { useAccountsLibraryStore } from 'stores/accountsLibstore'

const $q = useQuasar()
const accountsStore = useAccountsLibraryStore()

// State
const searchQuery = ref('')
const filteredExpenseClassOptions = ref([])
const expenseClasses = ref([
  { id: 1, name: 'MOOE', year: '2024' },
  { id: 2, name: 'Personal Services', year: '2024' },
  { id: 3, name: 'Capital Outlay', year: '2025' },
])

const expenseTypes = ref([
  { id: 1, classId: 1, name: 'Travel Expenses', year: '2024' },
  { id: 2, classId: 1, name: 'Water Expenses', year: '2024' },
  { id: 3, classId: 2, name: 'Salaries', year: '2024' },
  { id: 4, classId: 3, name: 'Equipment', year: '2025' },
])

const expenseItems = ref([])

// Dialog controls
const showAddYearDialog = ref(false)
const showCopyDialog = ref(false)
const showAddClassDialog = ref(false)
const showAddTypeDialog = ref(false)
const showAddItemDialog = ref(false)
const showEditClassDialog = ref(false)
const showEditTypeDialog = ref(false)
const showEditItemDialog = ref(false)
const showDeleteConfirm = ref(false)

// Form data
const newYear = ref((new Date().getFullYear() + 1).toString())
const newExpenseClass = ref('')
const customExpenseClass = ref('')
const newExpenseType = ref({ name: '', classId: null })
const newExpenseItem = ref({ name: '', typeId: null })
const editingExpenseClass = ref(null)
const editingExpenseType = ref(null)
const editingExpenseItem = ref(null)
const itemToDelete = ref(null)
const deleteType = ref('')

// UI state
const hoveredClass = ref(null)
const expandedClasses = ref({})
const expandedTypes = ref({})
const copyTargetYear = ref(null)
const selectedClassesToCopy = ref([])
const duplicateWarning = ref(null)
const currentParentClass = ref(null)
const sortableContainer = ref(null)
const typeSortables = ref({})

// Add this method to initialize type containers
const initTypeContainer = (el, classId) => {
  if (el && !typeSortables.value[classId]) {
    typeSortables.value[classId] = new Sortable(el, {
      animation: 150,
      handle: '.drag-handle',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      onEnd: (evt) => {
        const types = [...getExpenseTypesForClass(classId)]
        const [movedType] = types.splice(evt.oldIndex, 1)
        types.splice(evt.newIndex, 0, movedType)

        const otherTypes = expenseTypes.value.filter((et) => et.classId !== classId)
        expenseTypes.value = [
          ...otherTypes,
          ...types.map((type, index) => ({ ...type, order: index })),
        ]
      },
    })
  }
}

onMounted(() => {
  nextTick(() => {
    // Initialize class sorting
    if (sortableContainer.value) {
      new Sortable(sortableContainer.value, {
        animation: 150,
        handle: '.drag-handle',
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        onEnd: (evt) => {
          const items = [...filteredExpenseClasses.value]
          const [movedItem] = items.splice(evt.oldIndex, 1)
          items.splice(evt.newIndex, 0, movedItem)

          const year = selectedYear.value
          const otherYearsData = expenseClasses.value.filter((ec) => ec.year !== year)
          expenseClasses.value = [...otherYearsData, ...items]
        },
      })
    }
  })
})

const toggleExpansion = (classId) => {
  // Create a copy of the current expanded state
  const newExpanded = { ...expandedClasses.value }

  // If the clicked class is currently collapsed
  if (!newExpanded[classId]) {
    // Close all other classes
    Object.keys(newExpanded).forEach((id) => {
      newExpanded[id] = false
    })
    // Open the clicked class
    newExpanded[classId] = true

    // Initialize sortable for types when expanded
    nextTick(() => {
      const container = document.querySelector(`[ref="typeContainer_${classId}"]`)
      if (container && !typeSortables.value[classId]) {
        initTypeContainer(container, classId)
      }
    })
  } else {
    // If clicking an already expanded class, close it
    newExpanded[classId] = false
  }

  // Update the reactive state
  expandedClasses.value = newExpanded
}

// Helper functions for checking existing items
const classExistsInYear = (className, year) => {
  return expenseClasses.value.some(
    (ec) => ec.name.toLowerCase() === className.toLowerCase() && ec.year === year,
  )
}

const typeExistsInClass = (typeName, classId) => {
  return expenseTypes.value.some(
    (et) => et.name.toLowerCase() === typeName.toLowerCase() && et.classId === classId,
  )
}

// Computed properties
const filteredExpenseClasses = computed(() => {
  if (!selectedYear.value) return []

  return expenseClasses.value
    .filter((ec) => ec.year === selectedYear.value)
    .filter(
      (ec) =>
        ec.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        getExpenseTypesForClass(ec.id).some((et) =>
          et.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
        ),
    )
})

const currentYear = ref(new Date().getFullYear().toString())

/// Computed properties with additional safeguards
const yearOptions = computed(() => {
  return accountsStore.years.map((year) => ({
    label: year.year.toString(),
    value: year.year.toString(),
  }))
})

const selectedYear = computed({
  get: () => accountsStore.selectedYear,
  set: (value) => {
    accountsStore.selectedYear = value
  },
})
// Methods
const showAddClassForm = () => {
  newExpenseClass.value = ''
  customExpenseClass.value = ''
  showAddClassDialog.value = true
}

// Fix the saveExpenseClass method
const saveExpenseClass = () => {
  // First get the class name (handle 'Other' case)
  const className =
    newExpenseClass.value === 'Other' ? customExpenseClass.value : newExpenseClass.value

  // Validate
  if (!className) {
    $q.notify({ type: 'negative', message: 'Class name is required' })
    return
  }

  // Check for duplicates
  const exists = expenseClasses.value.some(
    (ec) => ec.name.toLowerCase() === className.toLowerCase() && ec.year === selectedYear.value,
  )

  if (exists) {
    $q.notify({ type: 'negative', message: 'This class already exists for the selected year' })
    return
  }

  // Add new class
  const newId = Math.max(...expenseClasses.value.map((ec) => ec.id), 0) + 1
  expenseClasses.value.push({
    id: newId,
    name: className,
    year: selectedYear.value,
  })

  $q.notify({ type: 'positive', message: 'Class added successfully' })
  resetClassForm()
}

const resetClassForm = () => {
  newExpenseClass.value = ''
  customExpenseClass.value = ''
  showAddClassDialog.value = false
}
// Add Type
const showAddTypeForm = (expenseClass) => {
  currentParentClass.value = expenseClass
  newExpenseType.value = { name: '', classId: expenseClass.id }
  showAddTypeDialog.value = true
}

const getSelectedClassName = () => {
  return currentParentClass.value?.name || 'Selected Class'
}

const saveExpenseType = () => {
  if (!newExpenseType.value.name) {
    $q.notify({ type: 'negative', message: 'Type name is required' })
    return
  }

  const newId = Math.max(...expenseTypes.value.map((et) => et.id), 0) + 1
  expenseTypes.value.push({
    id: newId,
    name: newExpenseType.value.name,
    classId: currentParentClass.value.id,
    year: selectedYear.value,
  })

  $q.notify({ type: 'positive', message: 'Type added successfully' })
  resetTypeForm()
}

const resetTypeForm = () => {
  newExpenseType.value = { name: '', classId: null }
  showAddTypeDialog.value = false
}

const expenseClassOptions = computed(() => {
  return [...new Set(expenseClasses.value.map((ec) => ec.name))]
})

// Add Year method
// Add Year method
// Add Year method with improved validation
const addYear = async () => {
  const yearStr = newYear.value?.toString().trim()

  if (!yearStr || yearStr.length !== 4 || isNaN(yearStr)) {
    $q.notify({
      type: 'negative',
      message: 'Please enter a valid 4-digit year',
      position: 'top',
    })
    return
  }

  try {
    await accountsStore.addYear(yearStr)
    $q.notify({
      type: 'positive',
      message: `Year ${yearStr} added successfully`,
      position: 'top',
    })
    newYear.value = ''
    showAddYearDialog.value = false

    // Refresh the years list
    await accountsStore.fetchYears()

    // Auto-select the new year
    selectedYear.value = yearStr
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to add year',
      position: 'top',
    })
  }
}

const filterExpenseClasses = (val, update) => {
  update(() => {
    const needle = val.toLowerCase()
    filteredExpenseClassOptions.value = expenseClassOptions.value.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1,
    )
  })
}

const createExpenseClass = (val, done) => {
  if (val.length > 0) {
    if (!expenseClassOptions.value.includes(val)) {
      const newId = Math.max(...expenseClasses.value.map((ec) => ec.id), 0) + 1
      expenseClasses.value.push({
        id: newId,
        name: val,
        year: selectedYear.value,
      })
      $q.notify({
        type: 'positive',
        message: `New expense class "${val}" created`,
      })
    }
    newExpenseClass.value = val
  }
  done()
}

const getExpenseTypesForClass = (classId) => {
  if (!selectedYear.value) return []
  return expenseTypes.value.filter((et) => et.classId === classId && et.year === selectedYear.value)
}

const editExpenseClass = (expenseClass) => {
  editingExpenseClass.value = { ...expenseClass }
  showEditClassDialog.value = true
}

const updateExpenseClass = () => {
  const index = expenseClasses.value.findIndex((ec) => ec.id === editingExpenseClass.value.id)
  if (index !== -1) {
    expenseClasses.value[index] = { ...editingExpenseClass.value }
  }
  showEditClassDialog.value = false
}

const editExpenseType = (expenseType) => {
  editingExpenseType.value = { ...expenseType }
  showEditTypeDialog.value = true
}

const updateExpenseType = () => {
  const index = expenseTypes.value.findIndex((et) => et.id === editingExpenseType.value.id)
  if (index !== -1) {
    expenseTypes.value[index] = { ...editingExpenseType.value }
  }
  showEditTypeDialog.value = false
}

const confirmDeleteExpenseClass = (expenseClass) => {
  itemToDelete.value = expenseClass
  deleteType.value = 'class'
  showDeleteConfirm.value = true
}

const confirmDeleteExpenseType = (expenseType) => {
  itemToDelete.value = expenseType
  deleteType.value = 'type'
  showDeleteConfirm.value = true
}

const getExpenseItemsForType = (typeId) => {
  if (!selectedYear.value) return []
  return expenseItems.value.filter(
    (item) => item.typeId === typeId && item.year === selectedYear.value,
  )
}

const showAddItemDialogForType = (expenseType) => {
  newExpenseItem.value = { name: '', typeId: expenseType.id }
  showAddItemDialog.value = true
}

const saveExpenseItem = () => {
  const newId = Math.max(...expenseItems.value.map((item) => item.id), 0) + 1
  expenseItems.value.push({
    id: newId,
    name: newExpenseItem.value.name,
    typeId: newExpenseItem.value.typeId,
    year: selectedYear.value,
  })
  showAddItemDialog.value = false
  newExpenseItem.value = { name: '', typeId: null }
}

const editExpenseItem = (item) => {
  editingExpenseItem.value = { ...item }
  showEditItemDialog.value = true
}

const updateExpenseItem = () => {
  const index = expenseItems.value.findIndex((item) => item.id === editingExpenseItem.value.id)
  if (index !== -1) {
    expenseItems.value[index] = { ...editingExpenseItem.value }
  }
  showEditItemDialog.value = false
}

const confirmDeleteExpenseItem = (item) => {
  itemToDelete.value = item
  deleteType.value = 'item'
  showDeleteConfirm.value = true
}

const confirmDelete = () => {
  if (deleteType.value === 'class') {
    // Delete class and all its types and items
    expenseClasses.value = expenseClasses.value.filter((ec) => ec.id !== itemToDelete.value.id)
    expenseTypes.value = expenseTypes.value.filter((et) => et.classId !== itemToDelete.value.id)
    const typeIds = expenseTypes.value
      .filter((et) => et.classId === itemToDelete.value.id)
      .map((et) => et.id)
    expenseItems.value = expenseItems.value.filter((item) => !typeIds.includes(item.typeId))
  } else if (deleteType.value === 'type') {
    // Delete type and all its items
    expenseTypes.value = expenseTypes.value.filter((et) => et.id !== itemToDelete.value.id)
    expenseItems.value = expenseItems.value.filter((item) => item.typeId !== itemToDelete.value.id)
  } else {
    // Delete just the item
    expenseItems.value = expenseItems.value.filter((item) => item.id !== itemToDelete.value.id)
  }
  showDeleteConfirm.value = false
}

const checkForDuplicates = () => {
  duplicateWarning.value = null
  if (copyTargetYear.value) {
    const duplicates = selectedClassesToCopy.value.filter((classId) =>
      classExistsInYear(
        expenseClasses.value.find((ec) => ec.id === classId).name,
        copyTargetYear.value,
      ),
    )
    if (duplicates.length > 0) {
      duplicateWarning.value = `The following classes already exist in ${copyTargetYear.value}: ${duplicates
        .map((id) => expenseClasses.value.find((ec) => ec.id === id).name)
        .join(', ')}`
    }
  }
}
watch(
  expandedTypes,
  (newVal) => {
    nextTick(() => {
      Object.keys(newVal).forEach((typeId) => {
        if (newVal[typeId]) {
          // This will find all item containers for this type
          const containers = document.querySelectorAll(`[data-item-container="${typeId}"]`)
          containers.forEach((container) => {
            if (container && !container.sortable) {
              initItemContainer(container, typeId)
            }
          })
        }
      })
    })
  },
  { deep: true },
)

const initItemContainer = (el, typeId) => {
  if (el && !el.sortable) {
    el.sortable = new Sortable(el, {
      animation: 150,
      handle: '.drag-handle',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      onEnd: (evt) => {
        const items = [...getExpenseItemsForType(typeId)]
        const [movedItem] = items.splice(evt.oldIndex, 1)
        items.splice(evt.newIndex, 0, movedItem)

        // Update Vue data store
        const otherItems = expenseItems.value.filter((item) => item.typeId !== typeId)
        expenseItems.value = [
          ...otherItems,
          ...items.map((item, index) => ({ ...item, order: index })),
        ]
      },
    })
  }
}

const copyClassesToYear = () => {
  if (!copyTargetYear.value || selectedClassesToCopy.value.length === 0) {
    $q.notify({
      type: 'negative',
      message: 'Please select a target year and at least one class',
      position: 'top',
    })
    return
  }

  // Get max IDs to avoid conflicts
  const maxClassId = Math.max(...expenseClasses.value.map((ec) => ec.id), 0)
  const maxTypeId = Math.max(...expenseTypes.value.map((et) => et.id), 0)

  let newClassId = maxClassId + 1
  let newTypeId = maxTypeId + 1
  let skippedClasses = 0
  let skippedTypes = 0

  // Create a mapping of old class IDs to new class IDs
  const classIdMap = {}

  // Copy selected classes
  selectedClassesToCopy.value.forEach((oldClassId) => {
    const oldClass = expenseClasses.value.find((ec) => ec.id === oldClassId)
    if (oldClass) {
      // Check if class already exists in target year
      if (classExistsInYear(oldClass.name, copyTargetYear.value)) {
        skippedClasses++
        return
      }

      const newClass = {
        ...oldClass,
        id: newClassId,
        year: copyTargetYear.value,
      }
      expenseClasses.value.push(newClass)
      classIdMap[oldClassId] = newClassId
      newClassId++
    }
  })

  // Copy associated expense types
  selectedClassesToCopy.value.forEach((oldClassId) => {
    const oldTypes = expenseTypes.value.filter(
      (et) => et.classId === oldClassId && et.year === selectedYear.value,
    )

    oldTypes.forEach((oldType) => {
      // Check if type already exists in the new class
      if (typeExistsInClass(oldType.name, classIdMap[oldClassId])) {
        skippedTypes++
        return
      }

      const newType = {
        ...oldType,
        id: newTypeId++,
        classId: classIdMap[oldClassId],
        year: copyTargetYear.value,
      }
      expenseTypes.value.push(newType)
    })
  })

  // Prepare notification message
  const copiedClasses = selectedClassesToCopy.value.length - skippedClasses
  const copiedTypes =
    expenseTypes.value.filter(
      (et) => selectedClassesToCopy.value.includes(et.classId) && et.year === copyTargetYear.value,
    ).length - skippedTypes

  let message = `Copied ${copiedClasses} classes and ${copiedTypes} types to ${copyTargetYear.value}`

  if (skippedClasses > 0 || skippedTypes > 0) {
    message += ` (skipped ${skippedClasses} duplicate classes and ${skippedTypes} duplicate types)`
  }

  $q.notify({
    type: 'positive',
    message,
    position: 'top',
  })

  // Reset and close
  selectedClassesToCopy.value = []
  copyTargetYear.value = null
  showCopyDialog.value = false
}

watch(selectedYear, (newYear) => {
  // Clear any open dialogs when year changes
  showAddClassDialog.value = false
  resetClassForm()

  if (newYear) {
    // In a real app, you might fetch data for the selected year here
    console.log(`Loading data for year ${newYear}`)
  }
})

// Initialize years
// Initialize years
onMounted(async () => {
  try {
    await accountsStore.fetchYears()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Failed to load fiscal years',
      position: 'top',
    })
  }
})
</script>

<style scoped>
/* Hover effects for edit/delete buttons */
/* In your style section */
.q-expansion-item:hover {
  background-color: #f5f5f5;
}

.expense-type-item:hover {
  background-color: #f0f0f0;
}

.hover-effect {
  background-color: #f5f5f5;
  transition: background-color 0.3s;
}

.type-hover-effect {
  background-color: #f0f0f0;
  transition: background-color 0.3s;
}
.actions {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}

/* Add these to your existing styles */
.draggable-item,
.draggable-type {
  cursor: grab;
}

.drag-handle {
  cursor: grab;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.drag-handle:hover {
  opacity: 1;
}

.sortable-ghost {
  opacity: 0.5;
  background: #f5f5f5;
}

.sortable-chosen {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
