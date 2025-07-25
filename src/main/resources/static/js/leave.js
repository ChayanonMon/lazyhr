// Global user data
let userId = null;

// Initialize user data from HTML template
function initializeUserData(userIdValue) {
  userId = userIdValue;
  console.log("User ID loaded:", userId);
}

// Calculate total days when dates change
function calculateTotalDays() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const leavePeriod = document.getElementById("leavePeriod").value;

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end >= start) {
      const timeDiff = end.getTime() - start.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

      let totalDays = dayDiff;
      if (leavePeriod === "AM" || leavePeriod === "PM") {
        totalDays = dayDiff * 0.5;
      }

      document.getElementById("totalDays").textContent = totalDays;
    } else {
      document.getElementById("totalDays").textContent = "0";
    }
  }
}

// Initialize date inputs and event listeners
function initializeDateInputs() {
  // Add event listeners
  const startDateEl = document.getElementById("startDate");
  const endDateEl = document.getElementById("endDate");
  const leavePeriodEl = document.getElementById("leavePeriod");

  if (startDateEl) {
    startDateEl.addEventListener("change", calculateTotalDays);
    startDateEl.addEventListener("change", function () {
      if (endDateEl) {
        endDateEl.min = this.value;
      }
      calculateTotalDays();
    });
  }

  if (endDateEl) {
    endDateEl.addEventListener("change", calculateTotalDays);
  }

  if (leavePeriodEl) {
    leavePeriodEl.addEventListener("change", calculateTotalDays);
  }

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];
  if (startDateEl) startDateEl.min = today;
  if (endDateEl) endDateEl.min = today;
}

// Reset form when modal is closed
function initializeModalEvents() {
  const modal = document.getElementById("applyLeaveModal");
  if (modal) {
    modal.addEventListener("hidden.bs.modal", resetForm);
  }
}

// Form submission
function initializeLeaveForm() {
  const leaveForm = document.getElementById("leaveForm");
  if (leaveForm) {
    leaveForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Add calculated total days and userId
      data.totalDays = parseFloat(
        document.getElementById("totalDays").textContent
      );
      data.userId = userId;

      // Convert dates to Unix timestamps (milliseconds)
      if (data.startDate) {
        data.startDate = dateToTimestamp(data.startDate);
      }
      if (data.endDate) {
        data.endDate = dateToTimestamp(data.endDate);
      }

      // Debug: Log the data being sent
      console.log("Submitting leave request with data:", data);

      const isEdit = data.leaveId && data.leaveId !== "";
      const url = isEdit
        ? `/lazyhr/api/leave/${data.leaveId}/update`
        : "/lazyhr/api/leave/apply";

      fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          console.log("Response status:", response.status);
          return response.json();
        })
        .then((data) => {
          console.log("Response data:", data);
          if (data.status === "success") {
            alert("Leave request submitted successfully!");
            // Close modal
            const modal = bootstrap.Modal.getInstance(
              document.getElementById("applyLeaveModal")
            );
            if (modal) {
              modal.hide();
            }
            // Clear form
            document.getElementById("leaveForm").reset();
            document.getElementById("totalDays").textContent = "0";
            // Refresh the leave requests table
            refreshLeaveRequestsTable();
          } else {
            alert(
              "Error: " + (data.message || "Failed to submit leave request")
            );
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert(
            "Failed to submit leave request. Please try again: " +
              error.message
          );
        });
    });
  }
}

// Refresh leave requests table
function refreshLeaveRequestsTable() {
  fetch("/lazyhr/api/leave/user/" + userId)
    .then((response) => response.json())
    .then((data) => {
      console.log("Refresh table response:", data);

      // Handle different response formats
      const leaveRequests = data.data || data || [];

      // If it's an array directly
      if (Array.isArray(leaveRequests)) {
        updateLeaveRequestsTable(leaveRequests);
      }
      // If success status with data property
      else if (data.status === "success" && Array.isArray(data.data)) {
        updateLeaveRequestsTable(data.data);
      }
      // If data is in a content property
      else if (data.content && Array.isArray(data.content)) {
        updateLeaveRequestsTable(data.content);
      } else {
        console.error("Unexpected response format:", data);
        location.reload(); // Fallback
      }
    })
    .catch((error) => {
      console.error("Error refreshing table:", error);
      // Fallback to page reload if API fails
      location.reload();
    });
}

// Function to update the leave requests table
function updateLeaveRequestsTable(leaveRequests) {
  const tbody = document.querySelector(".table tbody");
  if (!leaveRequests || leaveRequests.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="text-center text-muted py-4">
          <i class="fas fa-calendar-times fa-3x mb-3 d-block"></i>
          No leave requests found. Click "Apply for Leave" to create your first request.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = leaveRequests
    .map((leave) => {
      const statusClass =
        "status-" + (leave.status || "pending").toLowerCase();
      const appliedDate = new Date(leave.appliedDate).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }
      );
      const startDate = new Date(leave.startDate).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }
      );
      const endDate = new Date(leave.endDate).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }
      );

      return `
        <tr>
          <td>${appliedDate}</td>
          <td><span class="badge bg-info">${leave.leaveCategory}</span></td>
          <td>${leave.leavePeriod}</td>
          <td>${startDate}</td>
          <td>${endDate}</td>
          <td>${leave.totalDays}</td>
          <td><span class="leave-status ${statusClass}">${leave.status}</span></td>
          <td>${
            leave.reason.length > 50
              ? leave.reason.substring(0, 50) + "..."
              : leave.reason
          }</td>
          <td>
            ${
              leave.status === "PENDING"
                ? `
                  <button class="btn btn-sm btn-outline-primary me-1" onclick="editLeave(${leave.id})">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" onclick="cancelLeave(${leave.id})">
                    <i class="fas fa-times"></i>
                  </button>
                `
                : ""
            }
            <button class="btn btn-sm btn-outline-info" onclick="viewLeave(${
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
  alert("View leave details for ID: " + id);
}

function editLeave(id) {
  // Fetch leave request details
  fetch("/lazyhr/api/leave/" + id)
    .then((response) => response.json())
    .then((data) => {
      const leave = data.data || data;
      if (!leave) {
        alert("Leave request not found");
        return;
      }

      // Update modal title
      document.querySelector(
        "#applyLeaveModal .modal-title"
      ).textContent = "Edit Leave Request";

      // Populate form fields
      document.getElementById("leaveId").value = leave.id;
      document.getElementById("leaveCategory").value = leave.leaveCategory;
      document.getElementById("leavePeriod").value = leave.leavePeriod;
      document.getElementById("startDate").value = leave.startDate;
      document.getElementById("endDate").value = leave.endDate;
      document.getElementById("reason").value = leave.reason;

      // Calculate total days
      calculateTotalDays();

      // Show modal
      const modal = new bootstrap.Modal(
        document.getElementById("applyLeaveModal")
      );
      modal.show();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to load leave request details. Please try again.");
    });
}

function resetForm() {
  const leaveForm = document.getElementById("leaveForm");
  if (leaveForm) {
    leaveForm.reset();
  }
  
  const leaveIdEl = document.getElementById("leaveId");
  if (leaveIdEl) {
    leaveIdEl.value = "";
  }
  
  const totalDaysEl = document.getElementById("totalDays");
  if (totalDaysEl) {
    totalDaysEl.textContent = "0";
  }
  
  const modalTitle = document.querySelector("#applyLeaveModal .modal-title");
  if (modalTitle) {
    modalTitle.textContent = "Apply for Leave";
  }
}

function cancelLeave(id) {
  if (confirm("Are you sure you want to cancel this leave request?")) {
    fetch(`/lazyhr/api/leave/${id}/cancel?userId=${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        console.log("Cancel response status:", response.status);
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
          throw new Error("Server returned status: " + response.status);
        }
        return response.text().then((text) => {
          // Try to parse as JSON if there's content, otherwise return empty object
          return text ? JSON.parse(text) : {};
        });
      })
      .then((data) => {
        console.log("Cancel response data:", data);
        // Check both status and response.ok since server might return 200 with error status
        if (
          data.status === "success" ||
          data.message === "Cancelled" ||
          data.cancelled
        ) {
          alert("Leave request cancelled successfully!");
          // Use our refresh function instead of full page reload
          refreshLeaveRequestsTable();
        } else {
          throw new Error(data.message || "Unknown error occurred");
        }
      })
      .catch((error) => {
        console.error("Error cancelling leave request:", error);
        alert("Error: " + error.message);
      });
  }
}

// Timestamp formatting utility
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

  if (format === "MMM dd, yyyy") {
    return (
      months[date.getMonth()] +
      " " +
      String(date.getDate()).padStart(2, "0") +
      ", " +
      date.getFullYear()
    );
  }
  return date.toLocaleDateString();
}

// Format all timestamps on page load
function formatAllTimestamps() {
  document.querySelectorAll(".timestamp-format").forEach((element) => {
    const timestamp = element.getAttribute("data-timestamp");
    if (timestamp) {
      element.textContent = formatTimestamp(parseInt(timestamp));
    }
  });
}

// Convert date string (YYYY-MM-DD) to Unix timestamp in milliseconds
function dateToTimestamp(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString + "T00:00:00.000Z");
  return date.getTime();
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  initializeDateInputs();
  initializeModalEvents();
  initializeLeaveForm();
  formatAllTimestamps();
});
