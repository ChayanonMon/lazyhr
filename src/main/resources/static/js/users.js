// Users page JavaScript functionality
document.addEventListener(EventTypes.DOM_CONTENT_LOADED, function () {
  // Initialize user data if available
  if (typeof users !== JavaScriptTypes.UNDEFINED) {
    console.log(Messages.USERS_DATA_LOADED, users.length, Messages.USERS);
  }

  // Format timestamps in the table
  formatTimestampsInTable();

  // Initialize tooltips
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll(Bootstrap.TOOLTIP_SELECTOR)
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Initialize form validation
  initializeFormValidation();

  // Initialize filters
  initializeFilters();
});

// User Management Functions
let currentUserId = null;

function viewUser(userId) {
  // Find user data
  const user = findUserById(userId);
  if (!user) {
    showAlert(Messages.USER_NOT_FOUND, HttpStatus.ERROR);
    return;
  }

  // Populate view modal
  populateViewModal(user);

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById(DomElements.VIEW_USER_MODAL));
  modal.show();
}

function editUser(userId) {
  // Find user data
  const user = findUserById(userId);
  if (!user) {
    showAlert(Messages.USER_NOT_FOUND, HttpStatus.ERROR);
    return;
  }

  // Set current user ID for editing
  currentUserId = userId;

  // Populate edit modal
  populateEditModal(user);

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById(DomElements.EDIT_USER_MODAL));
  modal.show();
}

function deleteUser(userId) {
  // Find user data
  const user = findUserById(userId);
  if (!user) {
    showAlert(Messages.USER_NOT_FOUND, HttpStatus.ERROR);
    return;
  }

  // Set current user for deletion
  currentUserId = userId;

  // Update delete modal
  document.getElementById(DomElements.DELETE_USER_NAME).textContent = 
    `${user.firstName} ${user.lastName} (${user.username})`;

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById(DomElements.DELETE_USER_MODAL));
  modal.show();
}

function editUserFromView() {
  const viewModal = bootstrap.Modal.getInstance(document.getElementById(DomElements.VIEW_USER_MODAL));
  viewModal.hide();
  
  // Get user ID from view modal
  const userId = document.getElementById(DomElements.VIEW_USER_ID).textContent;
  editUser(parseInt(userId));
}

function confirmDeleteUser() {
  if (!currentUserId) {
    showAlert(Messages.NO_USER_SELECTED_FOR_DELETION, HttpStatus.ERROR);
    return;
  }

  // Show loading state
  const deleteBtn = document.getElementById(DomElements.CONFIRM_DELETE_BTN);
  const originalText = deleteBtn.innerHTML;
  deleteBtn.innerHTML = HtmlContent.DELETING_SPINNER;
  deleteBtn.disabled = true;

  // Simulate API call (replace with actual API call)
  setTimeout(() => {
    // Hide modal
    const modal = bootstrap.Modal.getInstance(document.getElementById(DomElements.DELETE_USER_MODAL));
    modal.hide();

    // Reset button
    deleteBtn.innerHTML = originalText;
    deleteBtn.disabled = false;

    // Show success message
    showAlert(Messages.USER_DELETED_SUCCESSFULLY, HttpStatus.SUCCESS);

    // Refresh page or remove row
    location.reload();
  }, 1500);
}

function toggleUserStatus(userId) {
  const user = findUserById(userId);
  if (!user) {
    showAlert(Messages.USER_NOT_FOUND, HttpStatus.ERROR);
    return;
  }

  const newStatus = !user.isActive;
  const action = newStatus ? Messages.ACTIVATE : Messages.DEACTIVATE;
  const confirmMessage = newStatus ? Messages.ARE_YOU_SURE_ACTIVATE : Messages.ARE_YOU_SURE_DEACTIVATE;

  if (confirm(confirmMessage)) {
    // Simulate API call
    const successMessage = newStatus ? Messages.USER_ACTIVATED_SUCCESSFULLY : Messages.USER_DEACTIVATED_SUCCESSFULLY;
    showAlert(successMessage, HttpStatus.SUCCESS);
    // Update UI or reload
    setTimeout(() => location.reload(), Messages.TIMEOUT_1000);
  }
}

function resetUserPassword(userId) {
  const user = findUserById(userId);
  if (!user) {
    showAlert(Messages.USER_NOT_FOUND, HttpStatus.ERROR);
    return;
  }

  const confirmMessage = Messages.RESET_PASSWORD_CONFIRM.replace('{name}', `${user.firstName} ${user.lastName}`);
  if (confirm(confirmMessage)) {
    // Simulate API call
    showAlert(Messages.PASSWORD_RESET_EMAIL_SENT, HttpStatus.SUCCESS);
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
  document.getElementById(DomElements.VIEW_HIRE_DATE).textContent = formatDate(user.hireDate) || Messages.NOT_AVAILABLE;
  document.getElementById(DomElements.VIEW_SALARY).textContent = user.salary ? `${Messages.CURRENCY_DOLLAR}${parseFloat(user.salary).toLocaleString()}` : Messages.NOT_AVAILABLE;
  document.getElementById(DomElements.VIEW_LAST_LOGIN).textContent = user.lastLogin || Messages.NEVER;

  // Avatar
  const avatar = document.getElementById(DomElements.VIEW_USER_AVATAR);
  avatar.textContent = getInitials(user.firstName, user.lastName);
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
  document.getElementById(DomElements.EDIT_HIRE_DATE).value = formatDateForInput(user.hireDate) || Messages.EMPTY_STRING;
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
  const table = document.getElementById(DomElements.USERS_TABLE);
  
  if (!table) return;
  
  const tbody = table.getElementsByTagName(TableStructure.TBODY_TAG)[0];
  if (!tbody) return;
  
  const rows = tbody.getElementsByTagName(TableStructure.TR_TAG);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
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
      const matchesRole = !roleFilter || role.includes(roleFilter);
      const matchesStatus = !statusFilter || status === statusFilter;

      if (matchesSearch && matchesRole && matchesStatus) {
        row.style.display = TableStructure.DISPLAY_BLOCK;
      } else {
        row.style.display = TableStructure.DISPLAY_NONE;
      }
    }
  }
}

// Utility Functions
function findUserById(userId) {
  if (typeof users === JavaScriptTypes.UNDEFINED || !users) {
    console.error(Messages.USERS_DATA_NOT_AVAILABLE_CONSOLE);
    return null;
  }

  return users.find(user => user.id == userId);
}

function getInitials(firstName, lastName) {
  const first = firstName ? firstName.charAt(0).toUpperCase() : Messages.EMPTY_STRING;
  const last = lastName ? lastName.charAt(0).toUpperCase() : Messages.EMPTY_STRING;
  return first + last || Messages.QUESTION_MARKS;
}

function formatDate(dateValue) {
  if (!dateValue) return null;
  
  try {
    let date;
    
    // Handle timestamp (number) or date string
    if (typeof dateValue === JavaScriptTypes.NUMBER) {
      date = new Date(dateValue);
    } else if (typeof dateValue === JavaScriptTypes.STRING) {
      // If it's a string that looks like a timestamp
      if (!isNaN(dateValue)) {
        date = new Date(parseInt(dateValue));
      } else {
        date = new Date(dateValue);
      }
    } else {
      return dateValue;
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateValue;
    }
    
    return date.toLocaleDateString(LocaleOptions.LOCALE_EN_US, LocaleOptions.DATE_FORMAT_OPTIONS);
  } catch (e) {
    return dateValue;
  }
}

function formatDateForInput(dateValue) {
  if (!dateValue) return Messages.EMPTY_STRING;
  
  try {
    let date;
    
    // Handle timestamp (number) or date string
    if (typeof dateValue === JavaScriptTypes.NUMBER) {
      date = new Date(dateValue);
    } else if (typeof dateValue === JavaScriptTypes.STRING) {
      // If it's a string that looks like a timestamp
      if (!isNaN(dateValue)) {
        date = new Date(parseInt(dateValue));
      } else {
        date = new Date(dateValue);
      }
    } else {
      return Messages.EMPTY_STRING;
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return Messages.EMPTY_STRING;
    }
    
    // Format as YYYY-MM-DD for HTML date input
    // Use local date to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(Messages.PAD_START_LENGTH, Messages.PAD_START_STRING);
    const day = String(date.getDate()).padStart(Messages.PAD_START_LENGTH, Messages.PAD_START_STRING);
    
    return `${year}-${month}-${day}`;
  } catch (e) {
    return Messages.EMPTY_STRING;
  }
}

function formatTimestampsInTable() {
  // Find all elements with the format-timestamp class
  const timestampElements = document.querySelectorAll(CssSelectors.FORMAT_TIMESTAMP);
  
  timestampElements.forEach(element => {
    const timestamp = element.getAttribute(DataAttributes.TIMESTAMP);
    if (timestamp && timestamp !== Messages.NOT_AVAILABLE && !isNaN(timestamp)) {
      // Use the same formatDate function for consistency
      const formattedDate = formatDate(parseInt(timestamp));
      if (formattedDate) {
        element.textContent = formattedDate;
      }
    }
  });
}

function showAlert(message, type = Messages.ALERT_INFO) {
  // Create alert element
  const alertDiv = document.createElement(CssStyles.DIV_ELEMENT);
  alertDiv.className = `alert alert-${type === Messages.ALERT_ERROR ? Messages.ALERT_DANGER : type} alert-dismissible fade show position-fixed`;
  alertDiv.style.cssText = CssStyles.ALERT_POSITION;
  
  alertDiv.innerHTML = `
    <i class="fas fa-${type === Messages.ALERT_SUCCESS ? IconClasses.CHECK_CIRCLE : type === Messages.ALERT_ERROR ? IconClasses.EXCLAMATION_CIRCLE : IconClasses.INFO_CIRCLE} me-2"></i>
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;

  document.body.appendChild(alertDiv);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove();
    }
  }, 5000);
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
  
  const formData = new FormData(event.target);
  const userData = Object.fromEntries(formData.entries());
  
  // Basic validation
  if (!userData.firstName || !userData.lastName || !userData.username || !userData.email) {
    showAlert(Messages.PLEASE_FILL_REQUIRED_FIELDS, Messages.ALERT_ERROR);
    return;
  }

  // Show loading state
  const submitBtn = event.target.querySelector(CssSelectors.SUBMIT_BUTTON);
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = HtmlContent.ADDING_USER_SPINNER;
  submitBtn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    // Hide modal
    const modal = bootstrap.Modal.getInstance(document.getElementById(DomElements.ADD_USER_MODAL));
    modal.hide();

    // Reset form
    event.target.reset();

    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;

    // Show success message
    showAlert(Messages.USER_ADDED_SUCCESSFULLY, Messages.ALERT_SUCCESS);

    // Refresh page
    setTimeout(() => location.reload(), Messages.TIMEOUT_1000);
  }, Messages.TIMEOUT_1500);
}

function handleEditUser(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const userData = Object.fromEntries(formData.entries());
  
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
  if (!userData.firstName || !userData.lastName || !userData.email) {
    showAlert(Messages.PLEASE_FILL_REQUIRED_FIELDS, Messages.ALERT_ERROR);
    return;
  }

  // Show loading state
  const submitBtn = event.target.querySelector(CssSelectors.SUBMIT_BUTTON);
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = HtmlContent.SAVING_CHANGES_SPINNER;
  submitBtn.disabled = true;

  // Make actual API call to update user
  fetch(ApiEndpoints.USERS_UPDATE(userId), {
    method: HttpMethods.PUT,
    headers: {
      'Content-Type': ContentTypes.APPLICATION_JSON,
    },
    body: JSON.stringify(userData)
  })
  .then(response => response.json())
  .then(data => {
    // Hide modal
    const modal = bootstrap.Modal.getInstance(document.getElementById(DomElements.EDIT_USER_MODAL));
    modal.hide();

    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;

    if (data.status === Messages.SUCCESS_STATUS) {
      // Show success message
      showAlert(Messages.USER_UPDATED_SUCCESSFULLY, Messages.ALERT_SUCCESS);
      
      // Refresh page to show updated data
      setTimeout(() => location.reload(), Messages.TIMEOUT_1000);
    } else {
      // Show error message
      showAlert(data.message || Messages.FAILED_TO_UPDATE_USER, Messages.ALERT_ERROR);
    }
  })
  .catch(error => {
    console.error(Messages.ERROR_UPDATING_USER, error);
    
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
    // Show error message
    showAlert(Messages.FAILED_TO_UPDATE_USER, Messages.ALERT_ERROR);
  });
}
