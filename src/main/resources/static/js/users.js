// Users page JavaScript functionality
document.addEventListener(EventTypes.DOM_CONTENT_LOADED, function () {
  // Initialize user data if available
  if (typeof users !== JavaScriptTypes.UNDEFINED) {
    console.log(Messages.USERS_DATA_LOADED, users.length, Messages.USERS);
  }

  // Initialize common page functionality
  CommonInit.initializePage();

  // Initialize form validation
  initializeFormValidation();

  // Initialize filters
  initializeFilters();
});

// User Management Functions
let currentUserId = null;

function viewUser(userId) {
  // Find user data
  const user = UserUtils.findUserById(userId);
  if (!user) {
    NotificationSystem.showError(Messages.USER_NOT_FOUND);
    return;
  }

  // Populate view modal
  populateViewModal(user);

  // Show modal
  ModalUtils.show(DomElements.VIEW_USER_MODAL);
}

function editUser(userId) {
  // Find user data
  const user = UserUtils.findUserById(userId);
  if (!user) {
    NotificationSystem.showError(Messages.USER_NOT_FOUND);
    return;
  }

  // Set current user ID for editing
  currentUserId = userId;

  // Populate edit modal
  populateEditModal(user);

  // Show modal
  ModalUtils.show(DomElements.EDIT_USER_MODAL);
}

function deleteUser(userId) {
  // Find user data
  const user = UserUtils.findUserById(userId);
  if (!user) {
    NotificationSystem.showError(Messages.USER_NOT_FOUND);
    return;
  }

  // Set current user for deletion
  currentUserId = userId;

  // Update delete modal
  document.getElementById(DomElements.DELETE_USER_NAME).textContent = 
    `${user.firstName} ${user.lastName} (${user.username})`;

  // Show modal
  ModalUtils.show(DomElements.DELETE_USER_MODAL);
}

function editUserFromView() {
  ModalUtils.hide(DomElements.VIEW_USER_MODAL);
  
  // Get user ID from view modal
  const userId = document.getElementById(DomElements.VIEW_USER_ID).textContent;
  editUser(parseInt(userId));
}

function confirmDeleteUser() {
  if (!currentUserId) {
    NotificationSystem.showError(Messages.NO_USER_SELECTED_FOR_DELETION);
    return;
  }

  // Show loading state
  const deleteBtn = document.getElementById(DomElements.CONFIRM_DELETE_BTN);
  FormUtils.showLoadingState(deleteBtn, HtmlContent.DELETING_SPINNER);

  // Simulate API call (replace with actual API call)
  setTimeout(() => {
    // Hide modal
    ModalUtils.hide(DomElements.DELETE_USER_MODAL);

    // Reset button
    FormUtils.resetLoadingState(deleteBtn);

    // Show success message
    NotificationSystem.showSuccess(Messages.USER_DELETED_SUCCESSFULLY);

    // Refresh page or remove row
    location.reload();
  }, 1500);
}

function toggleUserStatus(userId) {
  const user = UserUtils.findUserById(userId);
  if (!user) {
    NotificationSystem.showError(Messages.USER_NOT_FOUND);
    return;
  }

  const newStatus = !user.isActive;
  const action = newStatus ? Messages.ACTIVATE : Messages.DEACTIVATE;
  const confirmMessage = newStatus ? Messages.ARE_YOU_SURE_ACTIVATE : Messages.ARE_YOU_SURE_DEACTIVATE;

  if (confirm(confirmMessage)) {
    // Simulate API call
    const successMessage = newStatus ? Messages.USER_ACTIVATED_SUCCESSFULLY : Messages.USER_DEACTIVATED_SUCCESSFULLY;
    NotificationSystem.showSuccess(successMessage);
    // Update UI or reload
    setTimeout(() => location.reload(), Messages.TIMEOUT_1000);
  }
}

function resetUserPassword(userId) {
  const user = UserUtils.findUserById(userId);
  if (!user) {
    NotificationSystem.showError(Messages.USER_NOT_FOUND);
    return;
  }

  const confirmMessage = Messages.RESET_PASSWORD_CONFIRM.replace('{name}', `${user.firstName} ${user.lastName}`);
  if (confirm(confirmMessage)) {
    // Simulate API call
    NotificationSystem.showSuccess(Messages.PASSWORD_RESET_EMAIL_SENT);
  }
}

// Modal Population Functions
function populateViewModal(user) {
  // Basic info
  document.getElementById(DomElements.VIEW_USER_ID).textContent = user.id || Messages.NOT_AVAILABLE;
  document.getElementById(DomElements.VIEW_EMPLOYEE_ID).textContent = user.employeeId || Messages.NOT_AVAILABLE;
  document.getElementById(DomElements.VIEW_FIRST_NAME).textContent = user.firstName || Messages.NOT_AVAILABLE;
  document.getElementById(DomElements.VIEW_LAST_NAME).textContent = user.lastName || Messages.NOT_AVAILABLE;
  document.getElementById(DomElements.VIEW_USERNAME).textContent = user.username || Messages.NOT_AVAILABLE;
  document.getElementById(DomElements.VIEW_EMAIL).textContent = user.email || Messages.NOT_AVAILABLE;
  document.getElementById(DomElements.VIEW_DEPARTMENT).textContent = user.department || Messages.NOT_AVAILABLE;
  document.getElementById(DomElements.VIEW_POSITION).textContent = user.position || Messages.NOT_AVAILABLE;

  // Role badge
  const roleElement = document.getElementById(DomElements.VIEW_ROLE);
  roleElement.textContent = user.role || Messages.EMPLOYEE;
  roleElement.className = `${CssClasses.ROLE_BADGE} ${(user.role || Messages.EMPLOYEE_LOWERCASE).toLowerCase()}`;

  // Status badge
  const statusElement = document.getElementById(DomElements.VIEW_STATUS);
  statusElement.textContent = user.isActive ? Messages.ACTIVE : Messages.INACTIVE;
  statusElement.className = `${Messages.BADGE_CLASS} ${user.isActive ? Messages.BG_SUCCESS : Messages.BG_DANGER}`;

  // Dates and other info
  document.getElementById(DomElements.VIEW_HIRE_DATE).textContent = DateTimeUtils.formatDate(user.hireDate) || Messages.NOT_AVAILABLE;
  document.getElementById(DomElements.VIEW_SALARY).textContent = user.salary ? `${Messages.CURRENCY_DOLLAR}${parseFloat(user.salary).toLocaleString()}` : Messages.NOT_AVAILABLE;
  document.getElementById(DomElements.VIEW_LAST_LOGIN).textContent = user.lastLogin || Messages.NEVER;

  // Avatar
  const avatar = document.getElementById(DomElements.VIEW_USER_AVATAR);
  avatar.textContent = UserUtils.getInitials(user.firstName, user.lastName);
}

function populateEditModal(user) {
  // Set user ID
  document.getElementById(DomElements.EDIT_USER_ID).value = user.id || Messages.EMPTY_STRING;
  
  // Basic info
  document.getElementById(DomElements.EDIT_FIRST_NAME).value = user.firstName || Messages.EMPTY_STRING;
  document.getElementById(DomElements.EDIT_LAST_NAME).value = user.lastName || Messages.EMPTY_STRING;
  document.getElementById(DomElements.EDIT_USERNAME).value = user.username || Messages.EMPTY_STRING;
  document.getElementById(DomElements.EDIT_EMAIL).value = user.email || Messages.EMPTY_STRING;
  document.getElementById(DomElements.EDIT_EMPLOYEE_ID).value = user.employeeId || Messages.EMPTY_STRING;
  document.getElementById(DomElements.EDIT_ROLE).value = user.role || Messages.DEFAULT_EMPLOYEE_ROLE;
  document.getElementById(DomElements.EDIT_DEPARTMENT).value = user.department || Messages.EMPTY_STRING;
  document.getElementById(DomElements.EDIT_POSITION).value = user.position || Messages.EMPTY_STRING;
  
  // Dates and checkboxes
  document.getElementById(DomElements.EDIT_HIRE_DATE).value = DateTimeUtils.formatDateForInput(user.hireDate) || Messages.EMPTY_STRING;
  document.getElementById(DomElements.EDIT_SALARY).value = user.salary || Messages.EMPTY_STRING;
  document.getElementById(DomElements.EDIT_IS_ACTIVE).checked = user.isActive !== false;
}

// Search and filter functionality
function initializeFilters() {
  const searchInput = document.getElementById(DomElements.SEARCH_INPUT);
  const roleFilter = document.getElementById(DomElements.ROLE_FILTER);
  const statusFilter = document.getElementById(DomElements.STATUS_FILTER);

  if (searchInput) {
    searchInput.addEventListener(EventTypes.CHANGE, filterTable);
  }
  if (roleFilter) {
    roleFilter.addEventListener(EventTypes.CHANGE, filterTable);
  }
  if (statusFilter) {
    statusFilter.addEventListener(EventTypes.CHANGE, filterTable);
  }
}

function filterTable() {
  const searchTerm = document
    .getElementById(DomElements.SEARCH_INPUT)
    .value.toLowerCase();
  const roleFilter = document.getElementById(DomElements.ROLE_FILTER).value;
  const statusFilter = document.getElementById(DomElements.STATUS_FILTER).value;
  
  // Use the common table filter utility with custom filter logic
  TableUtils.filterTable(DomElements.USERS_TABLE, DomElements.SEARCH_INPUT, 
    [DomElements.ROLE_FILTER, DomElements.STATUS_FILTER], 
    (row, searchTerm, filters) => {
      const cells = row.getElementsByTagName(TableStructure.TD_TAG);

      if (cells.length > 0) {
        const name = cells[TableStructure.NAME_COLUMN_INDEX].textContent.toLowerCase(); // Updated for User ID column
        const employeeId = cells[TableStructure.EMPLOYEE_ID_COLUMN_INDEX].textContent.toLowerCase();
        const email = cells[TableStructure.EMAIL_COLUMN_INDEX].textContent.toLowerCase();
        const role = cells[TableStructure.ROLE_COLUMN_INDEX].textContent;
        const status = cells[TableStructure.STATUS_COLUMN_INDEX].textContent.includes(TableStructure.STATUS_ACTIVE_TEXT)
          ? TableStructure.STATUS_TRUE
          : TableStructure.STATUS_FALSE;

        const matchesSearch =
          name.includes(searchTerm) ||
          employeeId.includes(searchTerm) ||
          email.includes(searchTerm);
        const matchesRole = !filters[DomElements.ROLE_FILTER] || role.includes(filters[DomElements.ROLE_FILTER]);
        const matchesStatus = !filters[DomElements.STATUS_FILTER] || status === filters[DomElements.STATUS_FILTER];

        return matchesSearch && matchesRole && matchesStatus;
      }
      return false;
    }
  );
}

// Form Handling
function initializeFormValidation() {
  // Add User Form
  const addUserForm = document.getElementById(DomElements.ADD_USER_FORM);
  if (addUserForm) {
    addUserForm.addEventListener(EventTypes.SUBMIT, handleAddUser);
  }

  // Edit User Form
  const editUserForm = document.getElementById(DomElements.EDIT_USER_FORM);
  if (editUserForm) {
    editUserForm.addEventListener(EventTypes.SUBMIT, handleEditUser);
  }
}

function handleAddUser(event) {
  event.preventDefault();
  
  const userData = FormUtils.getFormData(event.target);
  
  // Basic validation
  if (!FormUtils.validateRequiredFields(userData, ['firstName', 'lastName', 'username', 'email'])) {
    return;
  }

  // Show loading state
  const submitBtn = event.target.querySelector(CssSelectors.SUBMIT_BUTTON);
  FormUtils.showLoadingState(submitBtn, HtmlContent.ADDING_USER_SPINNER);

  // Simulate API call
  setTimeout(() => {
    // Hide modal
    ModalUtils.hide(DomElements.ADD_USER_MODAL);

    // Reset form
    event.target.reset();

    // Reset button
    FormUtils.resetLoadingState(submitBtn);

    // Show success message
    NotificationSystem.showSuccess(Messages.USER_ADDED_SUCCESSFULLY);

    // Refresh page
    setTimeout(() => location.reload(), Messages.TIMEOUT_1000);
  }, Messages.TIMEOUT_1500);
}

function handleEditUser(event) {
  event.preventDefault();
  
  const userData = FormUtils.getFormData(event.target);
  
  // Get the user ID from the hidden field
  const userId = userData.userId;
  
  // Remove read-only fields and internal fields from submission data
  delete userData.username;
  delete userData.employeeId;
  delete userData.userId;
  
  // Convert checkbox value to boolean
  userData.isActive = userData.isActive === Messages.ON_VALUE;
  
  // Convert salary to number if provided
  if (userData.salary) {
    userData.salary = parseFloat(userData.salary);
  }
  
  // Convert hire date to timestamp if provided
  if (userData.hireDate) {
    userData.hireDate = new Date(userData.hireDate).getTime();
  }
  
  // Basic validation
  if (!FormUtils.validateRequiredFields(userData, ['firstName', 'lastName', 'email'])) {
    return;
  }

  // Show loading state
  const submitBtn = event.target.querySelector(CssSelectors.SUBMIT_BUTTON);
  FormUtils.showLoadingState(submitBtn, HtmlContent.SAVING_CHANGES_SPINNER);

  // Make actual API call to update user
  ApiUtils.makeRequest(ApiEndpoints.USERS_UPDATE(userId), {
    method: HttpMethods.PUT,
    body: JSON.stringify(userData)
  })
  .then(data => {
    // Hide modal
    ModalUtils.hide(DomElements.EDIT_USER_MODAL);

    // Reset button
    FormUtils.resetLoadingState(submitBtn);

    ApiUtils.handleResponse(data,
      () => {
        // Show success message
        NotificationSystem.showSuccess(Messages.USER_UPDATED_SUCCESSFULLY);
        
        // Refresh page to show updated data
        setTimeout(() => location.reload(), Messages.TIMEOUT_1000);
      },
      (error) => NotificationSystem.showError(error)
    );
  })
  .catch(error => {
    console.error(Messages.ERROR_UPDATING_USER, error);
    
    // Reset button
    FormUtils.resetLoadingState(submitBtn);
    
    // Show error message
    NotificationSystem.showError(Messages.FAILED_TO_UPDATE_USER);
  });
}
