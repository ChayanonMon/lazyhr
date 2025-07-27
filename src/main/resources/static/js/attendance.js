// Update current time
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString(Messages.EN_US_LOCALE, LocaleOptions.TIME_OPTIONS);
  const dateString = now.toLocaleDateString(Messages.EN_US_LOCALE, LocaleOptions.DATE_OPTIONS);

  document.getElementById(DomElements.CURRENT_TIME).textContent = timeString;
  document.getElementById(DomElements.CURRENT_DATE).textContent = dateString;
}

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
  if (!hasUserValue || !userIdValue || userIdValue === 0) {
    alert(Messages.USER_LOGIN_REQUIRED);
    return;
  }

  fetch(`${ApiEndpoints.CLOCK_IN}${userIdValue}`, {
    method: HttpMethods.POST,
    headers: {
      "Content-Type": ContentTypes.APPLICATION_JSON,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === HttpStatus.SUCCESS) {
        alert(Messages.CLOCKED_IN_SUCCESSFULLY);
        // Force reload without cache
        location.href = `${UrlParams.ATTENDANCE_REFRESH}${UrlParams.TIMESTAMP_PARAM()}`;
      } else {
        alert(Messages.ERROR_PREFIX + (data.message || Messages.CLOCK_IN_FAILED));
      }
    })
    .catch((error) => {
      console.error(Messages.ERROR_PREFIX, error);
      alert(Messages.ERROR_CLOCKING_IN);
    });
}

// Clock out function
function clockOut() {
  if (!hasUserValue || !userIdValue || userIdValue === 0) {
    alert(Messages.USER_LOGIN_REQUIRED);
    return;
  }

  fetch(`${ApiEndpoints.CLOCK_OUT}${userIdValue}`, {
    method: HttpMethods.POST,
    headers: {
      "Content-Type": ContentTypes.APPLICATION_JSON,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === HttpStatus.SUCCESS) {
        alert(Messages.CLOCKED_OUT_SUCCESSFULLY);
        // Force reload without cache
        location.href = `${UrlParams.ATTENDANCE_REFRESH}${UrlParams.TIMESTAMP_PARAM()}`;
      } else {
        alert(Messages.ERROR_PREFIX + (data.message || Messages.CLOCK_OUT_FAILED));
      }
    })
    .catch((error) => {
      console.error(Messages.ERROR_PREFIX, error);
      alert(Messages.ERROR_CLOCKING_OUT);
    });
}

// Timestamp formatting utilities
function formatTimestamp(timestamp, format = DateTimeFormats.MMM_DD_YYYY) {
  if (!timestamp) return "";
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
  // Start time updates
  updateTime();
  setInterval(updateTime, 1000);
  
  // Format timestamps
  formatAllTimestamps();
});
