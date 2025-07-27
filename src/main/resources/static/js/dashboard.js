// Global user data
let userId = 1;

// Initialize user data from HTML template
function initializeUserData(userIdValue) {
  userId = userIdValue || 1;
}

// Clock In functionality
function initializeClockInButton() {
  const clockInBtn = document.getElementById(DomElements.CLOCK_IN_BTN);
  if (clockInBtn) {
    clockInBtn.addEventListener(EventTypes.CLICK, function () {
      ApiUtils.clockIn(userId);
    });
  }
}

// Clock Out functionality
function initializeClockOutButton() {
  const clockOutBtn = document.getElementById(DomElements.CLOCK_OUT_BTN);
  if (clockOutBtn) {
    clockOutBtn.addEventListener(EventTypes.CLICK, function () {
      ApiUtils.clockOut(userId);
    });
  }
}

// Leave application form
function initializeLeaveForm() {
  const leaveForm = document.getElementById(DomElements.LEAVE_FORM);
  if (leaveForm) {
    leaveForm.addEventListener(EventTypes.SUBMIT, function (e) {
      e.preventDefault();

      const leaveData = {
        userId: userId,
        leaveCategory: document.getElementById(DomElements.LEAVE_CATEGORY).value,
        leavePeriod: document.getElementById(DomElements.LEAVE_PERIOD).value,
        startDate: document.getElementById(DomElements.START_DATE).value,
        endDate: document.getElementById(DomElements.END_DATE).value,
        reason: document.getElementById(DomElements.REASON).value,
      };

      ApiUtils.makeRequest(ApiEndpoints.LEAVE_APPLY, {
        method: HttpMethods.POST,
        body: JSON.stringify(leaveData)
      })
      .then(data => {
        ApiUtils.handleResponse(data,
          () => {
            NotificationSystem.showSuccess(Messages.LEAVE_APPLICATION_SUBMITTED);
            document.getElementById(DomElements.LEAVE_FORM).reset();
            ModalUtils.hide(DomElements.LEAVE_MODAL);
            location.reload();
          },
          (error) => NotificationSystem.showError(Messages.ERROR_PREFIX + error)
        );
      })
      .catch(error => {
        NotificationSystem.showError(Messages.ERROR_SUBMITTING_LEAVE + error.message);
      });
    });
  }
}

// Timestamp utility functions
function formatTimestamp(timestamp) {
  if (!timestamp) return "";
  const date = new Date(parseInt(timestamp));
  return date.toLocaleDateString();
}

function formatTimestampShort(timestamp) {
  if (!timestamp) return "";
  const date = new Date(parseInt(timestamp));
  return date.toLocaleDateString(Messages.EN_US_LOCALE, {
    month: Messages.SHORT_MONTH_OPTION,
    day: Messages.NUMERIC_DAY_OPTION,
  });
}

function formatTime(timestamp) {
  if (!timestamp) return Messages.NOT_RECORDED;
  const date = new Date(parseInt(timestamp));
  return date.toLocaleTimeString(Messages.EN_US_LOCALE, {
    hour12: false,
    hour: Messages.HOUR_2_DIGIT,
    minute: Messages.MINUTE_2_DIGIT,
  });
}

function formatAttendanceTimeRange(clockInTimestamp, clockOutTimestamp) {
  if (!clockInTimestamp) return Messages.NO_RECORD;
  if (clockInTimestamp && clockOutTimestamp) {
    return (
      formatTime(clockInTimestamp) + Messages.TIME_SEPARATOR + formatTime(clockOutTimestamp)
    );
  } else {
    return Messages.IN_PREFIX + formatTime(clockInTimestamp);
  }
}

function dateToTimestamp(dateString) {
  if (!dateString) return null;
  return new Date(dateString).getTime();
}

// Initialize timestamp formatting on page load
function initializeTimestampFormatting() {
  // Format timestamp elements
  document
    .querySelectorAll(CssSelectors.FORMAT_TIMESTAMP)
    .forEach(function (element) {
      const timestamp = element.getAttribute(DataAttributes.TIMESTAMP);
      if (timestamp) {
        element.textContent = formatTimestamp(timestamp);
      }
    });

  document
    .querySelectorAll(CssSelectors.FORMAT_TIMESTAMP_SHORT)
    .forEach(function (element) {
      const timestamp = element.getAttribute(DataAttributes.TIMESTAMP);
      if (timestamp) {
        element.textContent = formatTimestampShort(timestamp);
      }
    });

  document.querySelectorAll(CssSelectors.FORMAT_TIME).forEach(function (element) {
    const timestamp = element.getAttribute(DataAttributes.TIMESTAMP);
    if (timestamp) {
      element.textContent = formatTime(timestamp);
    }
  });

  document
    .querySelectorAll(CssSelectors.ATTENDANCE_TIME_RANGE)
    .forEach(function (element) {
      const clockIn = element.getAttribute(Messages.DATA_CLOCK_IN);
      const clockOut = element.getAttribute(Messages.DATA_CLOCK_OUT);
      element.textContent = formatAttendanceTimeRange(clockIn, clockOut);
    });
}

// Handle leave application form submission with timestamp conversion
function initializeLeaveApplicationForm() {
  const leaveForm = document.querySelector(CssSelectors.LEAVE_APPLICATION_FORM);
  if (leaveForm) {
    leaveForm.addEventListener(EventTypes.SUBMIT, function (e) {
      e.preventDefault();

      const startDateInput = leaveForm.querySelector(CssSelectors.START_DATE_SELECTOR);
      const endDateInput = leaveForm.querySelector(CssSelectors.END_DATE_SELECTOR);

      if (startDateInput && startDateInput.value) {
        const startTimestamp = dateToTimestamp(startDateInput.value);
        if (startTimestamp) {
          startDateInput.value = startTimestamp;
        }
      }

      if (endDateInput && endDateInput.value) {
        const endTimestamp = dateToTimestamp(endDateInput.value);
        if (endTimestamp) {
          endDateInput.value = endTimestamp;
        }
      }

      // Continue with original form submission
      leaveForm.submit();
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener(EventTypes.DOM_CONTENT_LOADED, function () {
  initializeClockInButton();
  initializeClockOutButton();
  initializeLeaveForm();
  initializeTimestampFormatting();
  initializeLeaveApplicationForm();
});
