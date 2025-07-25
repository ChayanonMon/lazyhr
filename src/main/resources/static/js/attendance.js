// Update current time
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateString = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  document.getElementById("currentTime").textContent = timeString;
  document.getElementById("currentDate").textContent = dateString;
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
    alert(
      "User not found. Please refresh the page and ensure you are logged in."
    );
    return;
  }

  fetch(`/lazyhr/api/attendance/clock-in?userId=${userIdValue}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        alert("Clocked in successfully!");
        // Force reload without cache
        location.href = "/lazyhr/attendance?t=" + new Date().getTime();
      } else {
        alert("Error: " + (data.message || "Clock in failed"));
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error clocking in. Please try again.");
    });
}

// Clock out function
function clockOut() {
  if (!hasUserValue || !userIdValue || userIdValue === 0) {
    alert(
      "User not found. Please refresh the page and ensure you are logged in."
    );
    return;
  }

  fetch(`/lazyhr/api/attendance/clock-out?userId=${userIdValue}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        alert("Clocked out successfully!");
        // Force reload without cache
        location.href = "/lazyhr/attendance?t=" + new Date().getTime();
      } else {
        alert("Error: " + (data.message || "Clock out failed"));
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error clocking out. Please try again.");
    });
}

// Timestamp formatting utilities
function formatTimestamp(timestamp, format = "MMM dd, yyyy") {
  if (!timestamp) return "";
  const date = new Date(timestamp);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (format === "MMM dd, yyyy") {
    return (
      months[date.getMonth()] +
      " " +
      String(date.getDate()).padStart(2, "0") +
      ", " +
      date.getFullYear()
    );
  } else if (format === "EEEE") {
    return days[date.getDay()];
  } else if (format === "HH:mm:ss") {
    return (
      String(date.getHours()).padStart(2, "0") +
      ":" +
      String(date.getMinutes()).padStart(2, "0") +
      ":" +
      String(date.getSeconds()).padStart(2, "0")
    );
  } else if (format === "HH:mm") {
    return (
      String(date.getHours()).padStart(2, "0") +
      ":" +
      String(date.getMinutes()).padStart(2, "0")
    );
  }
  return date.toLocaleDateString();
}

// Format all timestamps on page load
function formatAllTimestamps() {
  // Format date fields
  document.querySelectorAll(".date-format").forEach((element) => {
    const timestamp = element.getAttribute("data-timestamp");
    if (timestamp) {
      element.textContent = formatTimestamp(
        parseInt(timestamp),
        "MMM dd, yyyy"
      );
    }
  });

  // Format day fields
  document.querySelectorAll(".day-format").forEach((element) => {
    const timestamp = element.getAttribute("data-timestamp");
    if (timestamp) {
      element.textContent = formatTimestamp(parseInt(timestamp), "EEEE");
    }
  });

  // Format time fields
  document.querySelectorAll(".time-format").forEach((element) => {
    const timestamp = element.getAttribute("data-timestamp");
    if (timestamp && timestamp !== "--:--:--" && timestamp !== "-") {
      element.textContent = formatTimestamp(
        parseInt(timestamp),
        "HH:mm:ss"
      );
    }
  });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Start time updates
  updateTime();
  setInterval(updateTime, 1000);
  
  // Format timestamps
  formatAllTimestamps();
});
