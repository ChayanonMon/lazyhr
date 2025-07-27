// Global variables for user data (will be initialized from HTML)
let userIdValue = 0;
let hasUserValue = false;

// Initialize user data from HTML template
function initializeUserData(userId, hasUser) {
  userIdValue = userId || 0;
  hasUserValue = hasUser || false;
}

// Clock in function
function clockIn() {
  ApiUtils.clockIn(userIdValue);
}

// Clock out function
function clockOut() {
  ApiUtils.clockOut(userIdValue);
}

// Timestamp formatting utilities - now using common utilities
function formatTimestamp(timestamp, format = DateTimeFormats.MMM_DD_YYYY) {
  return DateTimeUtils.formatTimestamp(timestamp, format);
}

// Format all timestamps on page load
function formatAllTimestamps() {
  // Format date fields
  document.querySelectorAll(CssSelectors.DATE_FORMAT).forEach((element) => {
    const timestamp = element.getAttribute(DataAttributes.TIMESTAMP);
    if (timestamp) {
      element.textContent = formatTimestamp(
        parseInt(timestamp),
        DateTimeFormats.MMM_DD_YYYY
      );
    }
  });

  // Format day fields
  document.querySelectorAll(CssSelectors.DAY_FORMAT).forEach((element) => {
    const timestamp = element.getAttribute(DataAttributes.TIMESTAMP);
    if (timestamp) {
      element.textContent = formatTimestamp(parseInt(timestamp), DateTimeFormats.EEEE);
    }
  });

  // Format time fields
  document.querySelectorAll(CssSelectors.TIME_FORMAT).forEach((element) => {
    const timestamp = element.getAttribute(DataAttributes.TIMESTAMP);
    if (timestamp && timestamp !== DateTimeFormats.TIME_NOT_AVAILABLE && timestamp !== DateTimeFormats.DATE_NOT_AVAILABLE) {
      element.textContent = formatTimestamp(
        parseInt(timestamp),
        DateTimeFormats.HH_MM_SS
      );
    }
  });
}

// Initialize everything when DOM is loaded
document.addEventListener(EventTypes.DOM_CONTENT_LOADED, function() {
  // Initialize common page functionality
  CommonInit.initializePage();
  
  // Start time updates
  DateTimeUtils.updateCurrentTime();
  setInterval(DateTimeUtils.updateCurrentTime, 1000);
  
  // Format timestamps
  formatAllTimestamps();
});
