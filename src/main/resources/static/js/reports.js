// Chart instances
let attendanceChart, leaveChart, departmentChart;

// Initialize charts when page loads
function initializeCharts() {
  // Attendance Trend Chart
  const attendanceCtx = document
    .getElementById(DomElements.ATTENDANCE_CHART)
    .getContext(Messages.CANVAS_2D);
  attendanceChart = new Chart(attendanceCtx, {
    type: Messages.CHART_LINE,
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
  const leaveCtx = document.getElementById(DomElements.LEAVE_CHART).getContext(Messages.CANVAS_2D);
  leaveChart = new Chart(leaveCtx, {
    type: Messages.CHART_DOUGHNUT,
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
    .getElementById(DomElements.DEPARTMENT_CHART)
    .getContext(Messages.CANVAS_2D);
  departmentChart = new Chart(departmentCtx, {
    type: Messages.CHART_BAR,
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
  const dateRangeEl = document.getElementById(DomElements.DATE_RANGE);
  if (dateRangeEl) {
    dateRangeEl.addEventListener(EventTypes.CHANGE, function () {
      const customRange = document.getElementById(DomElements.CUSTOM_DATE_RANGE);
      if (customRange) {
        customRange.style.display =
          this.value === Messages.CUSTOM_VALUE ? Messages.BLOCK_DISPLAY : Messages.NONE_DISPLAY;
      }
    });
  }
}

function updateReport() {
  const reportType = document.getElementById(DomElements.REPORT_TYPE).value;
  const dateRange = document.getElementById(DomElements.DATE_RANGE).value;
  const department = document.getElementById(DomElements.DEPARTMENT).value;
  const employee = document.getElementById(DomElements.EMPLOYEE).value;

  // Here you would typically make an API call to fetch updated data
  console.log(Messages.UPDATING_REPORT, {
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
  const attendanceRateEl = document.getElementById(DomElements.ATTENDANCE_RATE);
  if (attendanceRateEl) {
    attendanceRateEl.textContent = Math.floor(Math.random() * 10) + 90 + "%";
  }
  
  const leaveUtilizationEl = document.getElementById(DomElements.LEAVE_UTILIZATION);
  if (leaveUtilizationEl) {
    leaveUtilizationEl.textContent = Math.floor(Math.random() * 20) + 60 + "%";
  }
}

function exportReport(format) {
  const reportType = document.getElementById(DomElements.REPORT_TYPE).value;
  const dateRange = document.getElementById(DomElements.DATE_RANGE).value;

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
    console.log(Messages.UPDATING_REAL_TIME_DATA, timeString);
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
    const startDateInput = document.getElementById(DomElements.START_DATE);
    const endDateInput = document.getElementById(DomElements.END_DATE);

    // Convert dates to timestamps for API calls if needed
    if (startDateInput && startDateInput.value) {
      const startTimestamp = dateToTimestamp(startDateInput.value);
      console.log(Messages.START_DATE_TIMESTAMP, startTimestamp);
    }

    if (endDateInput && endDateInput.value) {
      const endTimestamp = dateToTimestamp(endDateInput.value);
      console.log(Messages.END_DATE_TIMESTAMP, endTimestamp);
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
document.addEventListener(EventTypes.DOM_CONTENT_LOADED, function () {
  initializeCharts();
  initializeDateRangeHandler();
  initializeReportUpdates();
  startRealTimeUpdates();
});
