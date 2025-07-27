// Global user data
let userId = null;

// Initialize user data from HTML template
function initializeUserData(userIdValue) {
  userId = userIdValue;
  console.log(Messages.USER_ID_LOADED, userId);
}

// Calculate total days when dates change
function calculateTotalDays() {
  const startDate = document.getElementById(DomElements.START_DATE).value;
  const endDate = document.getElementById(DomElements.END_DATE).value;
  const leavePeriod = document.getElementById(DomElements.LEAVE_PERIOD).value;

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end >= start) {
      const timeDiff = end.getTime() - start.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

      let totalDays = dayDiff;
      if (leavePeriod === LeavePeriods.AM || leavePeriod === LeavePeriods.PM) {
        totalDays = dayDiff * 0.5;
      }

      document.getElementById(DomElements.TOTAL_DAYS).textContent = totalDays;
    } else {
      document.getElementById(DomElements.TOTAL_DAYS).textContent = Messages.DEFAULT_TOTAL_DAYS;
    }
  }
}

// Initialize date inputs and event listeners
function initializeDateInputs() {
  // Add event listeners
  const startDateEl = document.getElementById(DomElements.START_DATE);
  const endDateEl = document.getElementById(DomElements.END_DATE);
  const leavePeriodEl = document.getElementById(DomElements.LEAVE_PERIOD);

  if (startDateEl) {
    startDateEl.addEventListener(EventTypes.CHANGE, calculateTotalDays);
    startDateEl.addEventListener(EventTypes.CHANGE, function () {
      if (endDateEl) {
        endDateEl.min = this.value;
      }
      calculateTotalDays();
    });
  }

  if (endDateEl) {
    endDateEl.addEventListener(EventTypes.CHANGE, calculateTotalDays);
  }

  if (leavePeriodEl) {
    leavePeriodEl.addEventListener(EventTypes.CHANGE, calculateTotalDays);
  }

  // Set minimum date to today
  const today = new Date().toISOString().split(Messages.T_SEPARATOR)[Messages.T_INDEX];
  if (startDateEl) startDateEl.min = today;
  if (endDateEl) endDateEl.min = today;
}

// Reset form when modal is closed
function initializeModalEvents() {
  const modal = document.getElementById(DomElements.APPLY_LEAVE_MODAL);
  if (modal) {
    modal.addEventListener(EventTypes.HIDDEN_BS_MODAL, resetForm);
  }
}

// Form submission
function initializeLeaveForm() {
  const leaveForm = document.getElementById(DomElements.LEAVE_FORM);
  if (leaveForm) {
    leaveForm.addEventListener(EventTypes.SUBMIT, function (e) {
      e.preventDefault();

      // Use common form utilities
      const data = FormUtils.getFormData(this);

      // Add calculated total days and userId
      data.totalDays = parseFloat(
        document.getElementById(DomElements.TOTAL_DAYS).textContent
      );
      data.userId = userId;

      // Convert dates to Unix timestamps (milliseconds) using common utilities
      if (data.startDate) {
        data.startDate = DateTimeUtils.dateToTimestamp(data.startDate);
      }
      if (data.endDate) {
        data.endDate = DateTimeUtils.dateToTimestamp(data.endDate);
      }

      // Debug: Log the data being sent
      console.log(Messages.SUBMITTING_LEAVE_REQUEST, data);

      const isEdit = data.leaveId && data.leaveId !== "";
      const url = isEdit
        ? `${ApiEndpoints.LEAVE_UPDATE}${data.leaveId}/update`
        : ApiEndpoints.LEAVE_APPLY;

      // Use common API utilities
      ApiUtils.makeRequest(url, {
        method: isEdit ? HttpMethods.PUT : HttpMethods.POST,
        body: JSON.stringify(data)
      })
      .then(responseData => {
        console.log(Messages.RESPONSE_DATA, responseData);
        ApiUtils.handleResponse(responseData,
          (successData) => {
            // Success handler
            NotificationSystem.showSuccess(Messages.LEAVE_REQUEST_SUBMITTED);
            // Close modal using common utilities
            ModalUtils.hide(DomElements.APPLY_LEAVE_MODAL);
            // Clear form
            resetForm();
            // Refresh the leave requests table
            refreshLeaveRequestsTable();
          },
          (errorMessage) => {
            // Error handler
            NotificationSystem.showError(Messages.ERROR_PREFIX + (errorMessage || Messages.FAILED_TO_SUBMIT_LEAVE_REQUEST));
          }
        );
      })
      .catch((error) => {
        console.error(Messages.ERROR_PREFIX, error);
        NotificationSystem.showError(Messages.ERROR_SUBMITTING_LEAVE + error.message);
      });
    });
  }
}

// Refresh leave requests table
function refreshLeaveRequestsTable() {
  ApiUtils.makeRequest(ApiEndpoints.LEAVE_USER + userId)
    .then((data) => {
      console.log(Messages.REFRESH_TABLE_RESPONSE, data);

      // Handle different response formats
      const leaveRequests = data.data || data || [];

      // If it's an array directly
      if (Array.isArray(leaveRequests)) {
        updateLeaveRequestsTable(leaveRequests);
      }
      // If success status with data property
      else if (data.status === HttpStatus.SUCCESS && Array.isArray(data.data)) {
        updateLeaveRequestsTable(data.data);
      }
      // If data is in a content property
      else if (data.content && Array.isArray(data.content)) {
        updateLeaveRequestsTable(data.content);
      } else {
        console.error(Messages.UNEXPECTED_RESPONSE_FORMAT, data);
        location.reload(); // Fallback
      }
    })
    .catch((error) => {
      console.error(Messages.ERROR_REFRESHING_TABLE, error);
      // Fallback to page reload if API fails
      location.reload();
    });
}

// Function to update the leave requests table
function updateLeaveRequestsTable(leaveRequests) {
  const tbody = document.querySelector(Messages.TABLE_SELECTOR);
  if (!leaveRequests || leaveRequests.length === 0) {
    tbody.innerHTML = Messages.TABLE_NO_DATA_HTML;
    return;
  }

  tbody.innerHTML = leaveRequests
    .map((leave) => {
      const statusClass =
        Messages.STATUS_CLASS_PREFIX + (leave.status || Messages.PENDING_LOWERCASE).toLowerCase();
      
      // Use common date formatting utilities
      const appliedDate = DateTimeUtils.formatDate(leave.appliedDate);
      const startDate = DateTimeUtils.formatDate(leave.startDate);
      const endDate = DateTimeUtils.formatDate(leave.endDate);

      return `
        <tr>
          <td>${appliedDate}</td>
          <td><span class="${Messages.BADGE_BG_INFO}">${leave.leaveCategory}</span></td>
          <td>${leave.leavePeriod}</td>
          <td>${startDate}</td>
          <td>${endDate}</td>
          <td>${leave.totalDays}</td>
          <td><span class="${Messages.LEAVE_STATUS_CLASS} ${statusClass}">${leave.status}</span></td>
          <td>${
            leave.reason.length > Messages.REASON_TRUNCATE_LENGTH
              ? leave.reason.substring(0, Messages.REASON_TRUNCATE_LENGTH) + Messages.REASON_TRUNCATE_SUFFIX
              : leave.reason
          }</td>
          <td>
            ${
              leave.status === Messages.PENDING_STATUS
                ? `
                  <button class="${Messages.BTN_OUTLINE_PRIMARY}" onclick="editLeave(${leave.id})">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="${Messages.BTN_OUTLINE_DANGER}" onclick="cancelLeave(${leave.id})">
                    <i class="fas fa-times"></i>
                  </button>
                `
                : ""
            }
            <button class="${Messages.BTN_OUTLINE_INFO}" onclick="viewLeave(${
              leave.id
            })">
              <i class="fas fa-eye"></i>
            </button>
          </td>
        </tr>
      `;
    })
    .join("");
}

// Action functions
function viewLeave(id) {
  // Implementation for viewing leave details
  alert(Messages.VIEW_LEAVE_DETAILS_PREFIX + id);
}

function editLeave(id) {
  // Fetch leave request details using common API utilities
  ApiUtils.makeRequest(ApiEndpoints.LEAVE_CANCEL + id)
    .then((data) => {
      const leave = data.data || data;
      if (!leave) {
        NotificationSystem.showError(Messages.LEAVE_REQUEST_NOT_FOUND);
        return;
      }

      // Update modal title
      document.querySelector(
        Messages.MODAL_TITLE_SELECTOR
      ).textContent = Messages.EDIT_LEAVE_REQUEST;

      // Populate form fields using common date utilities
      document.getElementById(DomElements.LEAVE_ID).value = leave.id;
      document.getElementById(DomElements.LEAVE_CATEGORY).value = leave.leaveCategory;
      document.getElementById(DomElements.LEAVE_PERIOD).value = leave.leavePeriod;
      document.getElementById(DomElements.START_DATE).value = DateTimeUtils.formatDateForInput(leave.startDate);
      document.getElementById(DomElements.END_DATE).value = DateTimeUtils.formatDateForInput(leave.endDate);
      document.getElementById(DomElements.REASON).value = leave.reason;

      // Calculate total days
      calculateTotalDays();

      // Show modal using common utilities
      ModalUtils.show(DomElements.APPLY_LEAVE_MODAL);
    })
    .catch((error) => {
      console.error(Messages.ERROR_PREFIX, error);
      NotificationSystem.showError(Messages.FAILED_TO_LOAD_LEAVE_DETAILS);
    });
}

function resetForm() {
  const leaveForm = document.getElementById(DomElements.LEAVE_FORM);
  if (leaveForm) {
    leaveForm.reset();
  }
  
  const leaveIdEl = document.getElementById(DomElements.LEAVE_ID);
  if (leaveIdEl) {
    leaveIdEl.value = "";
  }
  
  const totalDaysEl = document.getElementById(DomElements.TOTAL_DAYS);
  if (totalDaysEl) {
    totalDaysEl.textContent = Messages.DEFAULT_TOTAL_DAYS;
  }
  
  const modalTitle = document.querySelector(Messages.MODAL_TITLE_SELECTOR);
  if (modalTitle) {
    modalTitle.textContent = Messages.APPLY_FOR_LEAVE;
  }
}

function cancelLeave(id) {
  if (confirm(Messages.CONFIRM_CANCEL_LEAVE)) {
    // Use common API utilities for the DELETE request
    ApiUtils.makeRequest(ApiEndpoints.LEAVE_CANCEL_WITH_USER_ID(id, userId), {
      method: HttpMethods.DELETE,
      headers: {
        [Messages.ACCEPT_HEADER]: ContentTypes.APPLICATION_JSON,
      }
    })
    .then((data) => {
      console.log(Messages.CANCEL_RESPONSE_DATA, data);
      // Check for successful cancellation
      if (
        data.status === HttpStatus.SUCCESS ||
        data.message === Messages.CANCELLED_STATUS ||
        data.cancelled
      ) {
        NotificationSystem.showSuccess(Messages.LEAVE_REQUEST_CANCELLED);
        // Use our refresh function instead of full page reload
        refreshLeaveRequestsTable();
      } else {
        throw new Error(data.message || Messages.UNKNOWN_ERROR_OCCURRED);
      }
    })
    .catch((error) => {
      console.error(Messages.ERROR_CANCELLING_LEAVE, error);
      NotificationSystem.showError(Messages.ERROR_PREFIX + error.message);
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener(EventTypes.DOM_CONTENT_LOADED, function() {
  // Use common initialization
  CommonInit.initializePage();
  
  // Initialize leave-specific functionality
  initializeDateInputs();
  initializeModalEvents();
  initializeLeaveForm();
});
