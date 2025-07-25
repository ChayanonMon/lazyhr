// Chart instances
let attendanceChart, leaveChart, departmentChart;

// Initialize charts when page loads
function initializeCharts() {
  // Attendance Trend Chart
  const attendanceCtx = document
    .getElementById("attendanceChart")
    .getContext("2d");
  attendanceChart = new Chart(attendanceCtx, {
    type: "line",
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Attendance Rate (%)",
          data: [92, 94, 96, 95],
          borderColor: "#667eea",
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });

  // Leave Distribution Chart
  const leaveCtx = document.getElementById("leaveChart").getContext("2d");
  leaveChart = new Chart(leaveCtx, {
    type: "doughnut",
    data: {
      labels: [
        "Annual Leave",
        "Sick Leave",
        "Personal Leave",
        "Special Holiday",
      ],
      datasets: [
        {
          data: [45, 25, 20, 10],
          backgroundColor: ["#667eea", "#f093fb", "#4facfe", "#43e97b"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });

  // Department Performance Chart
  const departmentCtx = document
    .getElementById("departmentChart")
    .getContext("2d");
  departmentChart = new Chart(departmentCtx, {
    type: "bar",
    data: {
      labels: ["Engineering", "Sales", "Marketing", "HR", "Finance"],
      datasets: [
        {
          label: "Attendance Rate (%)",
          data: [97, 94, 92, 98, 95],
          backgroundColor: [
            "#667eea",
            "#f093fb",
            "#4facfe",
            "#43e97b",
            "#ff6b6b",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });
}

// Initialize date range change handler
function initializeDateRangeHandler() {
  const dateRangeEl = document.getElementById("dateRange");
  if (dateRangeEl) {
    dateRangeEl.addEventListener("change", function () {
      const customRange = document.getElementById("customDateRange");
      if (customRange) {
        customRange.style.display =
          this.value === "custom" ? "block" : "none";
      }
    });
  }
}

function updateReport() {
  const reportType = document.getElementById("reportType").value;
  const dateRange = document.getElementById("dateRange").value;
  const department = document.getElementById("department").value;
  const employee = document.getElementById("employee").value;

  // Here you would typically make an API call to fetch updated data
  console.log("Updating report with:", {
    reportType,
    dateRange,
    department,
    employee,
  });

  // Simulate data update
  updateChartData();
}

function updateChartData() {
  // Simulate updating chart data based on filters
  // In a real application, this would fetch data from your API

  // Update attendance chart
  if (attendanceChart) {
    attendanceChart.data.datasets[0].data = [
      Math.floor(Math.random() * 20) + 80,
      Math.floor(Math.random() * 20) + 80,
      Math.floor(Math.random() * 20) + 80,
      Math.floor(Math.random() * 20) + 80,
    ];
    attendanceChart.update();
  }

  // Update metrics
  const attendanceRateEl = document.getElementById("attendanceRate");
  if (attendanceRateEl) {
    attendanceRateEl.textContent = Math.floor(Math.random() * 10) + 90 + "%";
  }
  
  const leaveUtilizationEl = document.getElementById("leaveUtilization");
  if (leaveUtilizationEl) {
    leaveUtilizationEl.textContent = Math.floor(Math.random() * 20) + 60 + "%";
  }
}

function exportReport(format) {
  const reportType = document.getElementById("reportType").value;
  const dateRange = document.getElementById("dateRange").value;

  // In a real application, this would trigger a download
  alert(
    `Exporting ${reportType} report as ${format.toUpperCase()} for ${dateRange}`
  );

  // Example API call:
  // window.location.href = `/lazyhr/api/reports/export?type=${reportType}&range=${dateRange}&format=${format}`;
}

// Real-time updates (simulate)
function startRealTimeUpdates() {
  setInterval(function () {
    // Update real-time metrics
    const now = new Date();
    const timeString = now.toLocaleTimeString();

    // This would typically fetch real data from your API
    console.log("Updating real-time data at", timeString);
  }, 30000); // Update every 30 seconds
}

// Timestamp utility functions for date range conversion
function dateToTimestamp(dateString) {
  if (!dateString) return null;
  return new Date(dateString).getTime();
}

// Override the updateReport function to handle timestamp conversion
function initializeReportUpdates() {
  const originalUpdateReport = window.updateReport;
  window.updateReport = function () {
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");

    // Convert dates to timestamps for API calls if needed
    if (startDateInput && startDateInput.value) {
      const startTimestamp = dateToTimestamp(startDateInput.value);
      console.log("Start date timestamp:", startTimestamp);
    }

    if (endDateInput && endDateInput.value) {
      const endTimestamp = dateToTimestamp(endDateInput.value);
      console.log("End date timestamp:", endTimestamp);
    }

    // Call original function if it exists
    if (originalUpdateReport && typeof originalUpdateReport === "function") {
      originalUpdateReport();
    } else {
      updateReport();
    }
  };
}

// Initialize everything when DOM loads
document.addEventListener("DOMContentLoaded", function () {
  initializeCharts();
  initializeDateRangeHandler();
  initializeReportUpdates();
  startRealTimeUpdates();
});
