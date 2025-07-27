// Common Utility Functions for LazyHR Frontend
// This file contains reusable functions and components used across multiple pages

/**
 * Notification/Alert System
 */
const NotificationSystem = {
  /**
   * Show a styled alert notification
   * @param {string} message - The message to display
   * @param {string} type - The type of alert (success, error, info, warning)
   * @param {number} duration - How long to show the alert (default: 5000ms)
   */
  showAlert: function(message, type = Messages.ALERT_INFO, duration = 5000) {
    // Create alert element
    const alertDiv = document.createElement(CssStyles.DIV_ELEMENT);
    alertDiv.className = `alert alert-${type === Messages.ALERT_ERROR ? Messages.ALERT_DANGER : type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = CssStyles.ALERT_POSITION;
    
    const iconClass = this._getIconClass(type);
    
    alertDiv.innerHTML = `
      <i class="fas fa-${iconClass} me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertDiv);

    // Auto remove after specified duration
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, duration);
  },

  /**
   * Get appropriate icon class for alert type
   * @private
   */
  _getIconClass: function(type) {
    switch(type) {
      case Messages.ALERT_SUCCESS: return IconClasses.CHECK_CIRCLE;
      case Messages.ALERT_ERROR: return IconClasses.EXCLAMATION_CIRCLE;
      default: return IconClasses.INFO_CIRCLE;
    }
  },

  /**
   * Show success notification
   */
  showSuccess: function(message, duration) {
    this.showAlert(message, Messages.ALERT_SUCCESS, duration);
  },

  /**
   * Show error notification
   */
  showError: function(message, duration) {
    this.showAlert(message, Messages.ALERT_ERROR, duration);
  },

  /**
   * Show info notification
   */
  showInfo: function(message, duration) {
    this.showAlert(message, Messages.ALERT_INFO, duration);
  }
};

/**
 * Date and Time Utilities
 */
const DateTimeUtils = {
  /**
   * Format a date value for display
   * @param {*} dateValue - Date value (timestamp, string, or Date object)
   * @returns {string|null} Formatted date string or null
   */
  formatDate: function(dateValue) {
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
  },

  /**
   * Format date for HTML date input (YYYY-MM-DD)
   * @param {*} dateValue - Date value to format
   * @returns {string} Formatted date string for input
   */
  formatDateForInput: function(dateValue) {
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
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(Messages.PAD_START_LENGTH, Messages.PAD_START_STRING);
      const day = String(date.getDate()).padStart(Messages.PAD_START_LENGTH, Messages.PAD_START_STRING);
      
      return `${year}-${month}-${day}`;
    } catch (e) {
      return Messages.EMPTY_STRING;
    }
  },

  /**
   * Convert date string to timestamp
   * @param {string} dateString - Date string in YYYY-MM-DD format
   * @returns {number} Timestamp in milliseconds
   */
  dateToTimestamp: function(dateString) {
    return new Date(dateString + Messages.TIMEZONE_UTC_SUFFIX).getTime();
  },

  /**
   * Format timestamp for display
   * @param {number} timestamp - Timestamp in milliseconds
   * @param {string} format - Format type
   * @returns {string} Formatted timestamp
   */
  formatTimestamp: function(timestamp, format = DateTimeFormats.MMM_DD_YYYY) {
    if (!timestamp) return Messages.EMPTY_STRING;
    const date = new Date(timestamp);

    if (format === DateTimeFormats.MMM_DD_YYYY) {
      return (
        DateTimeData.MONTHS[date.getMonth()] +
        " " +
        String(date.getDate()).padStart(Messages.PAD_START_LENGTH, Messages.PAD_START_STRING) +
        ", " +
        date.getFullYear()
      );
    } else if (format === DateTimeFormats.EEEE) {
      return DateTimeData.DAYS[date.getDay()];
    } else if (format === DateTimeFormats.HH_MM_SS) {
      return (
        String(date.getHours()).padStart(Messages.PAD_START_LENGTH, Messages.PAD_START_STRING) +
        ":" +
        String(date.getMinutes()).padStart(Messages.PAD_START_LENGTH, Messages.PAD_START_STRING) +
        ":" +
        String(date.getSeconds()).padStart(Messages.PAD_START_LENGTH, Messages.PAD_START_STRING)
      );
    } else if (format === DateTimeFormats.HH_MM) {
      return (
        String(date.getHours()).padStart(Messages.PAD_START_LENGTH, Messages.PAD_START_STRING) +
        ":" +
        String(date.getMinutes()).padStart(Messages.PAD_START_LENGTH, Messages.PAD_START_STRING)
      );
    }
    
    return date.toLocaleDateString();
  },

  /**
   * Update current time display
   */
  updateCurrentTime: function() {
    const now = new Date();
    const timeString = now.toLocaleTimeString(Messages.EN_US_LOCALE, LocaleOptions.TIME_OPTIONS);
    const dateString = now.toLocaleDateString(Messages.EN_US_LOCALE, LocaleOptions.DATE_OPTIONS);

    const timeElement = document.getElementById(DomElements.CURRENT_TIME);
    const dateElement = document.getElementById(DomElements.CURRENT_DATE);
    
    if (timeElement) timeElement.textContent = timeString;
    if (dateElement) dateElement.textContent = dateString;
  },

  /**
   * Format timestamps in table elements
   */
  formatTimestampsInTable: function() {
    // Find all elements with the format-timestamp class
    const timestampElements = document.querySelectorAll(CssSelectors.FORMAT_TIMESTAMP);
    
    timestampElements.forEach(element => {
      const timestamp = element.getAttribute(DataAttributes.TIMESTAMP);
      if (timestamp && timestamp !== Messages.NOT_AVAILABLE && !isNaN(timestamp)) {
        const formattedDate = this.formatDate(parseInt(timestamp));
        if (formattedDate) {
          element.textContent = formattedDate;
        }
      }
    });
  }
};

/**
 * API Utilities
 */
const ApiUtils = {
  /**
   * Make a standardized API call
   * @param {string} url - API endpoint URL
   * @param {object} options - Request options
   * @returns {Promise} Promise that resolves to response data
   */
  makeRequest: async function(url, options = {}) {
    const defaultOptions = {
      method: HttpMethods.GET,
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      }
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  /**
   * Handle API response with standard success/error logic
   * @param {object} data - Response data
   * @param {function} onSuccess - Success callback
   * @param {function} onError - Error callback
   */
  handleResponse: function(data, onSuccess, onError) {
    if (data.status === Messages.SUCCESS_STATUS) {
      if (onSuccess) onSuccess(data);
    } else {
      const errorMessage = data.message || Messages.UNKNOWN_ERROR_OCCURRED;
      if (onError) {
        onError(errorMessage);
      } else {
        NotificationSystem.showError(errorMessage);
      }
    }
  },

  /**
   * Clock in API call
   * @param {number} userId - User ID
   * @returns {Promise}
   */
  clockIn: async function(userId) {
    if (!userId || userId === 0) {
      NotificationSystem.showError(Messages.USER_LOGIN_REQUIRED);
      return;
    }

    try {
      const data = await this.makeRequest(`${ApiEndpoints.CLOCK_IN}${userId}`, {
        method: HttpMethods.POST
      });

      this.handleResponse(data, 
        () => {
          NotificationSystem.showSuccess(Messages.CLOCKED_IN_SUCCESSFULLY);
          setTimeout(() => {
            location.href = `${UrlParams.ATTENDANCE_REFRESH}${UrlParams.TIMESTAMP_PARAM()}`;
          }, 1000);
        },
        (error) => NotificationSystem.showError(Messages.ERROR_PREFIX + error)
      );
    } catch (error) {
      NotificationSystem.showError(Messages.ERROR_CLOCKING_IN);
    }
  },

  /**
   * Clock out API call
   * @param {number} userId - User ID
   * @returns {Promise}
   */
  clockOut: async function(userId) {
    if (!userId || userId === 0) {
      NotificationSystem.showError(Messages.USER_LOGIN_REQUIRED);
      return;
    }

    try {
      const data = await this.makeRequest(`${ApiEndpoints.CLOCK_OUT}${userId}`, {
        method: HttpMethods.POST
      });

      this.handleResponse(data, 
        () => {
          NotificationSystem.showSuccess(Messages.CLOCKED_OUT_SUCCESSFULLY);
          setTimeout(() => {
            location.href = `${UrlParams.ATTENDANCE_REFRESH}${UrlParams.TIMESTAMP_PARAM()}`;
          }, 1000);
        },
        (error) => NotificationSystem.showError(Messages.ERROR_PREFIX + error)
      );
    } catch (error) {
      NotificationSystem.showError(Messages.ERROR_CLOCKING_OUT);
    }
  }
};

/**
 * Form Utilities
 */
const FormUtils = {
  /**
   * Show loading state on submit button
   * @param {HTMLElement} button - Submit button element
   * @param {string} loadingText - Text to show while loading
   */
  showLoadingState: function(button, loadingText) {
    if (!button) return;
    
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = loadingText;
    button.disabled = true;
  },

  /**
   * Reset button from loading state
   * @param {HTMLElement} button - Submit button element
   */
  resetLoadingState: function(button) {
    if (!button) return;
    
    button.innerHTML = button.dataset.originalText || button.innerHTML;
    button.disabled = false;
    delete button.dataset.originalText;
  },

  /**
   * Get form data as object
   * @param {HTMLFormElement} form - Form element
   * @returns {object} Form data as key-value pairs
   */
  getFormData: function(form) {
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
  },

  /**
   * Validate required fields
   * @param {object} data - Form data object
   * @param {array} requiredFields - Array of required field names
   * @returns {boolean} True if all required fields are filled
   */
  validateRequiredFields: function(data, requiredFields) {
    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === '') {
        NotificationSystem.showError(Messages.PLEASE_FILL_REQUIRED_FIELDS);
        return false;
      }
    }
    return true;
  }
};

/**
 * Modal Utilities
 */
const ModalUtils = {
  /**
   * Show a Bootstrap modal
   * @param {string} modalId - ID of the modal element
   */
  show: function(modalId) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  },

  /**
   * Hide a Bootstrap modal
   * @param {string} modalId - ID of the modal element
   */
  hide: function(modalId) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  },

  /**
   * Get Bootstrap modal instance
   * @param {string} modalId - ID of the modal element
   * @returns {object|null} Bootstrap modal instance
   */
  getInstance: function(modalId) {
    const modalElement = document.getElementById(modalId);
    return modalElement ? bootstrap.Modal.getInstance(modalElement) : null;
  }
};

/**
 * Common Initialization Functions
 */
const CommonInit = {
  /**
   * Initialize tooltips
   */
  initializeTooltips: function() {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll(Bootstrap.TOOLTIP_SELECTOR)
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  },

  /**
   * Initialize common page functionality
   */
  initializePage: function() {
    this.initializeTooltips();
    DateTimeUtils.formatTimestampsInTable();
  }
};

/**
 * User Utilities
 */
const UserUtils = {
  /**
   * Get user initials from first and last name
   * @param {string} firstName - First name
   * @param {string} lastName - Last name
   * @returns {string} User initials
   */
  getInitials: function(firstName, lastName) {
    const first = firstName ? firstName.charAt(0).toUpperCase() : Messages.EMPTY_STRING;
    const last = lastName ? lastName.charAt(0).toUpperCase() : Messages.EMPTY_STRING;
    return first + last || Messages.QUESTION_MARKS;
  },

  /**
   * Find user by ID in users array
   * @param {number} userId - User ID to find
   * @param {array} usersArray - Array of users (optional, defaults to global users)
   * @returns {object|null} User object or null if not found
   */
  findUserById: function(userId, usersArray = null) {
    const usersList = usersArray || (typeof users !== JavaScriptTypes.UNDEFINED ? users : null);
    
    if (!usersList) {
      console.error(Messages.USERS_DATA_NOT_AVAILABLE_CONSOLE);
      return null;
    }

    return usersList.find(user => user.id == userId);
  }
};

/**
 * Table Utilities
 */
const TableUtils = {
  /**
   * Generic table filter function
   * @param {string} tableId - ID of the table element
   * @param {string} searchInputId - ID of the search input
   * @param {array} filterIds - Array of filter element IDs
   * @param {function} customFilter - Custom filter function (optional)
   */
  filterTable: function(tableId, searchInputId, filterIds = [], customFilter = null) {
    const searchTerm = document.getElementById(searchInputId)?.value.toLowerCase() || '';
    const table = document.getElementById(tableId);
    
    if (!table) return;
    
    const tbody = table.getElementsByTagName(TableStructure.TBODY_TAG)[0];
    if (!tbody) return;
    
    const rows = tbody.getElementsByTagName(TableStructure.TR_TAG);
    const filters = {};
    
    // Get filter values
    filterIds.forEach(filterId => {
      const filterElement = document.getElementById(filterId);
      if (filterElement) {
        filters[filterId] = filterElement.value;
      }
    });

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      let shouldShow = true;

      if (customFilter) {
        shouldShow = customFilter(row, searchTerm, filters);
      } else {
        // Default filter logic - search in all text content
        const rowText = row.textContent.toLowerCase();
        shouldShow = rowText.includes(searchTerm);
      }

      row.style.display = shouldShow ? TableStructure.DISPLAY_BLOCK : TableStructure.DISPLAY_NONE;
    }
  }
};

// Export utilities for global use
window.NotificationSystem = NotificationSystem;
window.DateTimeUtils = DateTimeUtils;
window.ApiUtils = ApiUtils;
window.FormUtils = FormUtils;
window.ModalUtils = ModalUtils;
window.CommonInit = CommonInit;
window.UserUtils = UserUtils;
window.TableUtils = TableUtils;

// Legacy compatibility - keep the old showAlert function
window.showAlert = NotificationSystem.showAlert.bind(NotificationSystem);
window.formatDate = DateTimeUtils.formatDate.bind(DateTimeUtils);
window.formatDateForInput = DateTimeUtils.formatDateForInput.bind(DateTimeUtils);
window.getInitials = UserUtils.getInitials.bind(UserUtils);
window.findUserById = UserUtils.findUserById.bind(UserUtils);
window.formatTimestampsInTable = DateTimeUtils.formatTimestampsInTable.bind(DateTimeUtils);
