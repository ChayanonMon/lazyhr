// Users page JavaScript functionality
document.addEventListener("DOMContentLoaded", function () {
  // Initialize user data if available
  if (typeof users !== "undefined") {
    console.log("Users data loaded:", users.length, "users");
  }

  // Format timestamps in the table
  formatTimestampsInTable();

  // Initialize tooltips
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
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
    showAlert("User not found", "error");
    return;
  }

  // Populate view modal
  populateViewModal(user);

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById("viewUserModal"));
  modal.show();
}

function editUser(userId) {
  // Find user data
  const user = findUserById(userId);
  if (!user) {
    showAlert("User not found", "error");
    return;
  }

  // Set current user ID for editing
  currentUserId = userId;

  // Populate edit modal
  populateEditModal(user);

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById("editUserModal"));
  modal.show();
}

function deleteUser(userId) {
  // Find user data
  const user = findUserById(userId);
  if (!user) {
    showAlert("User not found", "error");
    return;
  }

  // Set current user for deletion
  currentUserId = userId;

  // Update delete modal
  document.getElementById("deleteUserName").textContent = 
    `${user.firstName} ${user.lastName} (${user.username})`;

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById("deleteUserModal"));
  modal.show();
}

function editUserFromView() {
  const viewModal = bootstrap.Modal.getInstance(document.getElementById("viewUserModal"));
  viewModal.hide();
  
  // Get user ID from view modal
  const userId = document.getElementById("viewUserId").textContent;
  editUser(parseInt(userId));
}

function confirmDeleteUser() {
  if (!currentUserId) {
    showAlert("No user selected for deletion", "error");
    return;
  }

  // Show loading state
  const deleteBtn = document.getElementById("confirmDeleteBtn");
  const originalText = deleteBtn.innerHTML;
  deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Deleting...';
  deleteBtn.disabled = true;

  // Simulate API call (replace with actual API call)
  setTimeout(() => {
    // Hide modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("deleteUserModal"));
    modal.hide();

    // Reset button
    deleteBtn.innerHTML = originalText;
    deleteBtn.disabled = false;

    // Show success message
    showAlert(`User deleted successfully`, "success");

    // Refresh page or remove row
    location.reload();
  }, 1500);
}

function toggleUserStatus(userId) {
  const user = findUserById(userId);
  if (!user) {
    showAlert("User not found", "error");
    return;
  }

  const newStatus = !user.isActive;
  const action = newStatus ? "activate" : "deactivate";

  if (confirm(`Are you sure you want to ${action} this user?`)) {
    // Simulate API call
    showAlert(`User ${action}d successfully`, "success");
    // Update UI or reload
    setTimeout(() => location.reload(), 1000);
  }
}

function resetUserPassword(userId) {
  const user = findUserById(userId);
  if (!user) {
    showAlert("User not found", "error");
    return;
  }

  if (confirm(`Reset password for ${user.firstName} ${user.lastName}? A new temporary password will be sent to their email.`)) {
    // Simulate API call
    showAlert("Password reset email sent successfully", "success");
  }
}

// Modal Population Functions
function populateViewModal(user) {
  // Basic info
  document.getElementById("viewUserId").textContent = user.id || "N/A";
  document.getElementById("viewEmployeeId").textContent = user.employeeId || "N/A";
  document.getElementById("viewFirstName").textContent = user.firstName || "N/A";
  document.getElementById("viewLastName").textContent = user.lastName || "N/A";
  document.getElementById("viewUsername").textContent = user.username || "N/A";
  document.getElementById("viewEmail").textContent = user.email || "N/A";
  document.getElementById("viewDepartment").textContent = user.department || "N/A";
  document.getElementById("viewPosition").textContent = user.position || "N/A";

  // Role badge
  const roleElement = document.getElementById("viewRole");
  roleElement.textContent = user.role || "EMPLOYEE";
  roleElement.className = `role-badge ${(user.role || "employee").toLowerCase()}`;

  // Status badge
  const statusElement = document.getElementById("viewUserStatus");
  statusElement.textContent = user.isActive ? "Active" : "Inactive";
  statusElement.className = `badge ${user.isActive ? "bg-success" : "bg-danger"}`;

  // Dates and other info
  document.getElementById("viewHireDate").textContent = formatDate(user.hireDate) || "N/A";
  document.getElementById("viewSalary").textContent = user.salary ? `$${parseFloat(user.salary).toLocaleString()}` : "N/A";
  document.getElementById("viewLastLogin").textContent = user.lastLogin || "Never";

  // Avatar
  const avatar = document.getElementById("viewUserAvatar");
  avatar.textContent = getInitials(user.firstName, user.lastName);
}

function populateEditModal(user) {
  // Set user ID
  document.getElementById("editUserId").value = user.id || "";
  
  // Basic info
  document.getElementById("editFirstName").value = user.firstName || "";
  document.getElementById("editLastName").value = user.lastName || "";
  document.getElementById("editUsername").value = user.username || "";
  document.getElementById("editEmail").value = user.email || "";
  document.getElementById("editEmployeeId").value = user.employeeId || "";
  document.getElementById("editRole").value = user.role || "EMPLOYEE";
  document.getElementById("editDepartment").value = user.department || "";
  document.getElementById("editPosition").value = user.position || "";
  
  // Dates and checkboxes
  document.getElementById("editHireDate").value = formatDateForInput(user.hireDate) || "";
  document.getElementById("editSalary").value = user.salary || "";
  document.getElementById("editIsActive").checked = user.isActive !== false;
}

// Search and filter functionality
function initializeFilters() {
  const searchInput = document.getElementById("searchInput");
  const roleFilter = document.getElementById("roleFilter");
  const statusFilter = document.getElementById("statusFilter");

  if (searchInput) {
    searchInput.addEventListener("input", filterTable);
  }
  if (roleFilter) {
    roleFilter.addEventListener("change", filterTable);
  }
  if (statusFilter) {
    statusFilter.addEventListener("change", filterTable);
  }
}

function filterTable() {
  const searchTerm = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const roleFilter = document.getElementById("roleFilter").value;
  const statusFilter = document.getElementById("statusFilter").value;
  const table = document.getElementById("usersTable");
  
  if (!table) return;
  
  const tbody = table.getElementsByTagName("tbody")[0];
  if (!tbody) return;
  
  const rows = tbody.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName("td");

    if (cells.length > 0) {
      const name = cells[1].textContent.toLowerCase(); // Updated for User ID column
      const employeeId = cells[2].textContent.toLowerCase();
      const email = cells[3].textContent.toLowerCase();
      const role = cells[6].textContent;
      const status = cells[8].textContent.includes("Active")
        ? "true"
        : "false";

      const matchesSearch =
        name.includes(searchTerm) ||
        employeeId.includes(searchTerm) ||
        email.includes(searchTerm);
      const matchesRole = !roleFilter || role.includes(roleFilter);
      const matchesStatus = !statusFilter || status === statusFilter;

      if (matchesSearch && matchesRole && matchesStatus) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    }
  }
}

// Utility Functions
function findUserById(userId) {
  if (typeof users === "undefined" || !users) {
    console.error("Users data not available");
    return null;
  }

  return users.find(user => user.id == userId);
}

function getInitials(firstName, lastName) {
  const first = firstName ? firstName.charAt(0).toUpperCase() : "";
  const last = lastName ? lastName.charAt(0).toUpperCase() : "";
  return first + last || "??";
}

function formatDate(dateValue) {
  if (!dateValue) return null;
  
  try {
    let date;
    
    // Handle timestamp (number) or date string
    if (typeof dateValue === 'number') {
      date = new Date(dateValue);
    } else if (typeof dateValue === 'string') {
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
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return dateValue;
  }
}

function formatDateForInput(dateValue) {
  if (!dateValue) return "";
  
  try {
    let date;
    
    // Handle timestamp (number) or date string
    if (typeof dateValue === 'number') {
      date = new Date(dateValue);
    } else if (typeof dateValue === 'string') {
      // If it's a string that looks like a timestamp
      if (!isNaN(dateValue)) {
        date = new Date(parseInt(dateValue));
      } else {
        date = new Date(dateValue);
      }
    } else {
      return "";
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "";
    }
    
    // Format as YYYY-MM-DD for HTML date input
    // Use local date to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (e) {
    return "";
  }
}

function formatTimestampsInTable() {
  // Find all elements with the format-timestamp class
  const timestampElements = document.querySelectorAll('.format-timestamp');
  
  timestampElements.forEach(element => {
    const timestamp = element.getAttribute('data-timestamp');
    if (timestamp && timestamp !== 'N/A' && !isNaN(timestamp)) {
      // Use the same formatDate function for consistency
      const formattedDate = formatDate(parseInt(timestamp));
      if (formattedDate) {
        element.textContent = formattedDate;
      }
    }
  });
}

function showAlert(message, type = "info") {
  // Create alert element
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type === "error" ? "danger" : type} alert-dismissible fade show position-fixed`;
  alertDiv.style.cssText = "top: 20px; right: 20px; z-index: 9999; min-width: 300px;";
  
  alertDiv.innerHTML = `
    <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"} me-2"></i>
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
  const addUserForm = document.getElementById("addUserForm");
  if (addUserForm) {
    addUserForm.addEventListener("submit", handleAddUser);
  }

  // Edit User Form
  const editUserForm = document.getElementById("editUserForm");
  if (editUserForm) {
    editUserForm.addEventListener("submit", handleEditUser);
  }
}

function handleAddUser(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const userData = Object.fromEntries(formData.entries());
  
  // Basic validation
  if (!userData.firstName || !userData.lastName || !userData.username || !userData.email) {
    showAlert("Please fill in all required fields", "error");
    return;
  }

  // Show loading state
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Adding User...';
  submitBtn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    // Hide modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("addUserModal"));
    modal.hide();

    // Reset form
    event.target.reset();

    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;

    // Show success message
    showAlert("User added successfully", "success");

    // Refresh page
    setTimeout(() => location.reload(), 1000);
  }, 1500);
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
  userData.isActive = userData.isActive === 'on';
  
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
    showAlert("Please fill in all required fields", "error");
    return;
  }

  // Show loading state
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Saving Changes...';
  submitBtn.disabled = true;

  // Make actual API call to update user
  fetch(`/lazyhr/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  })
  .then(response => response.json())
  .then(data => {
    // Hide modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("editUserModal"));
    modal.hide();

    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;

    if (data.status === 'success') {
      // Show success message
      showAlert("User updated successfully", "success");
      
      // Refresh page to show updated data
      setTimeout(() => location.reload(), 1000);
    } else {
      // Show error message
      showAlert(data.message || "Failed to update user", "error");
    }
  })
  .catch(error => {
    console.error('Error updating user:', error);
    
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
    // Show error message
    showAlert("Failed to update user. Please try again.", "error");
  });
}
