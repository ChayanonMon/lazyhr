// Global user data
let userId = 1;

// Initialize user data from HTML template
function initializeUserData(userIdValue) {
  userId = userIdValue || 1;
}

// Clock In functionality
function initializeClockInButton() {
  const clockInBtn = document.getElementById("clockInBtn");
  if (clockInBtn) {
    clockInBtn.addEventListener("click", function () {
      fetch("/lazyhr/api/attendance/clock-in?userId=" + userId, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            alert("Successfully clocked in!");
            location.reload();
          } else {
            alert("Error: " + data.message);
          }
        })
        .catch((error) => {
          alert("Error clocking in: " + error.message);
        });
    });
  }
}

// Clock Out functionality
function initializeClockOutButton() {
  const clockOutBtn = document.getElementById("clockOutBtn");
  if (clockOutBtn) {
    clockOutBtn.addEventListener("click", function () {
      fetch("/lazyhr/api/attendance/clock-out?userId=" + userId, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            alert("Successfully clocked out!");
            location.reload();
          } else {
            alert("Error: " + data.message);
          }
        })
        .catch((error) => {
          alert("Error clocking out: " + error.message);
        });
    });
  }
}

// Leave application form
function initializeLeaveForm() {
  const leaveForm = document.getElementById("leaveForm");
  if (leaveForm) {
    leaveForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const leaveData = {
        userId: userId,
        leaveCategory: document.getElementById("leaveCategory").value,
        leavePeriod: document.getElementById("leavePeriod").value,
        startDate: document.getElementById("startDate").value,
        endDate: document.getElementById("endDate").value,
        reason: document.getElementById("reason").value,
      };

      fetch("/lazyhr/api/leave/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leaveData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            alert("Leave application submitted successfully!");
            document.getElementById("leaveForm").reset();
            bootstrap.Modal.getInstance(
              document.getElementById("leaveModal")
            ).hide();
            location.reload();
          } else {
            alert("Error: " + data.message);
          }
        })
        .catch((error) => {
          alert("Error submitting leave application: " + error.message);
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
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatTime(timestamp) {
  if (!timestamp) return "Not recorded";
  const date = new Date(parseInt(timestamp));
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAttendanceTimeRange(clockInTimestamp, clockOutTimestamp) {
  if (!clockInTimestamp) return "No record";
  if (clockInTimestamp && clockOutTimestamp) {
    return (
      formatTime(clockInTimestamp) + " - " + formatTime(clockOutTimestamp)
    );
  } else {
    return "In: " + formatTime(clockInTimestamp);
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
    .querySelectorAll(".format-timestamp")
    .forEach(function (element) {
      const timestamp = element.getAttribute("data-timestamp");
      if (timestamp) {
        element.textContent = formatTimestamp(timestamp);
      }
    });

  document
    .querySelectorAll(".format-timestamp-short")
    .forEach(function (element) {
      const timestamp = element.getAttribute("data-timestamp");
      if (timestamp) {
        element.textContent = formatTimestampShort(timestamp);
      }
    });

  document.querySelectorAll(".format-time").forEach(function (element) {
    const timestamp = element.getAttribute("data-timestamp");
    if (timestamp) {
      element.textContent = formatTime(timestamp);
    }
  });

  document
    .querySelectorAll(".attendance-time-range")
    .forEach(function (element) {
      const clockIn = element.getAttribute("data-clock-in");
      const clockOut = element.getAttribute("data-clock-out");
      element.textContent = formatAttendanceTimeRange(clockIn, clockOut);
    });
}

// Handle leave application form submission with timestamp conversion
function initializeLeaveApplicationForm() {
  const leaveForm = document.querySelector("#leaveApplicationForm");
  if (leaveForm) {
    leaveForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const startDateInput = leaveForm.querySelector("#startDate");
      const endDateInput = leaveForm.querySelector("#endDate");

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
document.addEventListener("DOMContentLoaded", function () {
  initializeClockInButton();
  initializeClockOutButton();
  initializeLeaveForm();
  initializeTimestampFormatting();
  initializeLeaveApplicationForm();
});
