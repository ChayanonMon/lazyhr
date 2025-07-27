// Frontend JavaScript Constants
// This file contains all hardcoded strings used in the frontend JavaScript files

const Messages = {
    // User Management Messages
    USER_NOT_FOUND: "User not found",
    NO_USER_SELECTED_FOR_DELETION: "No user selected for deletion", 
    USER_DELETED_SUCCESSFULLY: "User deleted successfully",
    PASSWORD_RESET_EMAIL_SENT: "Password reset email sent successfully",
    PLEASE_FILL_REQUIRED_FIELDS: "Please fill in all required fields",
    USER_ADDED_SUCCESSFULLY: "User added successfully",
    USER_UPDATED_SUCCESSFULLY: "User updated successfully",
    FAILED_TO_UPDATE_USER: "Failed to update user. Please try again.",
    USERS_DATA_NOT_AVAILABLE: "Users data not available",
    
    // Attendance Messages
    USER_LOGIN_REQUIRED: "User not found. Please refresh the page and ensure you are logged in.",
    CLOCKED_IN_SUCCESSFULLY: "Clocked in successfully!",
    CLOCKED_OUT_SUCCESSFULLY: "Clocked out successfully!",
    CLOCK_IN_FAILED: "Clock in failed",
    CLOCK_OUT_FAILED: "Clock out failed",
    ERROR_CLOCKING_IN: "Error clocking in. Please try again.",
    ERROR_CLOCKING_OUT: "Error clocking out. Please try again.",
    SUCCESSFULLY_CLOCKED_IN: "Successfully clocked in!",
    SUCCESSFULLY_CLOCKED_OUT: "Successfully clocked out!",
    ERROR_CLOCKING_IN_PREFIX: "Error clocking in: ",
    ERROR_CLOCKING_OUT_PREFIX: "Error clocking out: ",
    
    // Leave Management Messages
    LEAVE_REQUEST_SUBMITTED: "Leave request submitted successfully!",
    LEAVE_APPLICATION_SUBMITTED: "Leave application submitted successfully!",
    LEAVE_REQUEST_CANCELLED: "Leave request cancelled successfully!",
    LEAVE_REQUEST_NOT_FOUND: "Leave request not found",
    FAILED_TO_LOAD_LEAVE_DETAILS: "Failed to load leave request details. Please try again.",
    ERROR_SUBMITTING_LEAVE: "Error submitting leave application: ",
    VIEW_LEAVE_DETAILS_PREFIX: "View leave details for ID: ",
    
    // UI Labels and Status
    NOT_AVAILABLE: "N/A",
    ACTIVE: "Active",
    INACTIVE: "Inactive", 
    EMPLOYEE: "EMPLOYEE",
    NEVER: "Never",
    EDIT_LEAVE_REQUEST: "Edit Leave Request",
    APPLY_FOR_LEAVE: "Apply for Leave",
    USERS: "users",
    DELETING: "Deleting...",
    
    // Error Prefixes
    ERROR_PREFIX: "Error: ",
    FAILED_TO_UPDATE_USER_PREFIX: "Failed to update user",
    
    // Console/Debug Messages
    USERS_DATA_LOADED: "Users data loaded:",
    USER_ID_LOADED: "User ID loaded:",
    SUBMITTING_LEAVE_REQUEST: "Submitting leave request with data:",
    RESPONSE_STATUS: "Response status:",
    RESPONSE_DATA: "Response data:",
    REFRESH_TABLE_RESPONSE: "Refresh table response:",
    UNEXPECTED_RESPONSE_FORMAT: "Unexpected response format:",
    ERROR_REFRESHING_TABLE: "Error refreshing table:",
    CANCEL_RESPONSE_STATUS: "Cancel response status:",
    CANCEL_RESPONSE_DATA: "Cancel response data:",
    ERROR_CANCELLING_LEAVE: "Error cancelling leave request:",
    UPDATING_REPORT: "Updating report with:",
    UPDATING_REAL_TIME_DATA: "Updating real-time data at",
    START_DATE_TIMESTAMP: "Start date timestamp:",
    END_DATE_TIMESTAMP: "End date timestamp:",
    
    // Action Types
    ACTIVATE: "activate",
    DEACTIVATE: "deactivate",
    
    // Default Values
    DEFAULT_TOTAL_DAYS: "0",
    EMPTY_STRING: "",
    EMPLOYEE_DEFAULT: "EMPLOYEE",
    EMPLOYEE_LOWERCASE: "employee",
    
    // User Management Specific Messages
    ARE_YOU_SURE_ACTIVATE: "Are you sure you want to activate this user?",
    ARE_YOU_SURE_DEACTIVATE: "Are you sure you want to deactivate this user?",
    RESET_PASSWORD_CONFIRM: "Reset password for {name}? A new temporary password will be sent to their email.",
    USER_ACTIVATED_SUCCESSFULLY: "User activated successfully",
    USER_DEACTIVATED_SUCCESSFULLY: "User deactivated successfully",
    ADDING_USER_SPINNER: '<i class="fas fa-spinner fa-spin me-1"></i>Adding User...',
    SAVING_CHANGES_SPINNER: '<i class="fas fa-spinner fa-spin me-1"></i>Saving Changes...',
    
    // Form Messages
    PLEASE_FILL_REQUIRED_FIELDS: "Please fill in all required fields",
    
    // Currency Symbol
    CURRENCY_DOLLAR: "$",
    QUESTION_MARKS: "??",
    
    // Console Messages
    USERS_DATA_NOT_AVAILABLE_CONSOLE: "Users data not available",
    ERROR_UPDATING_USER: "Error updating user:",
    
    // CSS Class Values  
    BADGE_CLASS: "badge",
    BG_SUCCESS: "bg-success",
    BG_DANGER: "bg-danger",
    
    // Event Types
    ON_VALUE: "on",
    
    // Alert Types
    ALERT_ERROR: "error",
    ALERT_SUCCESS: "success",
    ALERT_INFO: "info",
    ALERT_DANGER: "danger",
    
    // HTML Elements/Attributes
    INPUT_TYPE_SUBMIT: 'button[type="submit"]',
    
    // HTTP Response Messages
    SUCCESS_STATUS: "success",
    
    // Numeric Constants
    TIMEOUT_1000: 1000,
    TIMEOUT_1500: 1500,
    
    // Default Values
    DEFAULT_EMPLOYEE_ROLE: "EMPLOYEE",
    
    // Form Reset Messages
    FAILED_TO_SUBMIT_LEAVE_REQUEST: "Failed to submit leave request",
    
    // Table/UI Messages
    NO_LEAVE_REQUESTS_MESSAGE: "No leave requests found. Click \"Apply for Leave\" to create your first request.",
    
    // Status Messages
    PENDING_STATUS: "PENDING",
    PENDING_LOWERCASE: "pending",
    
    // Confirm Messages
    CONFIRM_CANCEL_LEAVE: "Are you sure you want to cancel this leave request?",
    
    // Server Response Messages
    CANCELLED_STATUS: "Cancelled",
    SERVER_RETURNED_STATUS: "Server returned status: ",
    UNKNOWN_ERROR_OCCURRED: "Unknown error occurred",
    
    // Locale Options
    EN_US_LOCALE: "en-US",
    
    // CSS Classes and HTML
    STATUS_CLASS_PREFIX: "status-",
    BADGE_BG_INFO: "badge bg-info",
    LEAVE_STATUS_CLASS: "leave-status",
    BTN_OUTLINE_PRIMARY: "btn btn-sm btn-outline-primary me-1",
    BTN_OUTLINE_DANGER: "btn btn-sm btn-outline-danger",
    BTN_OUTLINE_INFO: "btn btn-sm btn-outline-info",
    TABLE_SELECTOR: ".table tbody",
    TABLE_NO_DATA_HTML: `<tr>
        <td colspan="9" class="text-center text-muted py-4">
          <i class="fas fa-calendar-times fa-3x mb-3 d-block"></i>
          No leave requests found. Click "Apply for Leave" to create your first request.
        </td>
      </tr>`,
    MODAL_TITLE_SELECTOR: "#applyLeaveModal .modal-title",
    REASON_TRUNCATE_LENGTH: 50,
    REASON_TRUNCATE_SUFFIX: "...",
    
    // Date/Time Format Constants
    T_SEPARATOR: "T",
    T_INDEX: 0,
    NUMERIC_YEAR: "numeric",
    SHORT_MONTH: "short",
    TWO_DIGIT_DAY: "2-digit",
    TIMEZONE_UTC_SUFFIX: "T00:00:00.000Z",
    PAD_START_LENGTH: 2,
    PAD_START_STRING: "0",
    
    // Application/JSON Content Type
    ACCEPT_HEADER: "Accept",
    
    // Dashboard Format Messages
    NOT_RECORDED: "Not recorded",
    NO_RECORD: "No record",
    IN_PREFIX: "In: ",
    TIME_SEPARATOR: " - ",
    
    // CSS Selectors for Dashboard
    FORMAT_TIMESTAMP: ".format-timestamp",
    FORMAT_TIMESTAMP_SHORT: ".format-timestamp-short",
    FORMAT_TIME: ".format-time",
    ATTENDANCE_TIME_RANGE: ".attendance-time-range",
    
    // Data Attributes for Dashboard  
    DATA_CLOCK_IN: "data-clock-in",
    DATA_CLOCK_OUT: "data-clock-out",
    
    // Locale and Format Options
    SHORT_MONTH_OPTION: "short",
    NUMERIC_DAY_OPTION: "numeric",
    HOUR_2_DIGIT: "2-digit",
    MINUTE_2_DIGIT: "2-digit",
    
    // Display Options
    BLOCK_DISPLAY: "block",
    NONE_DISPLAY: "none",
    CUSTOM_VALUE: "custom",
    
    // Canvas Context
    CANVAS_2D: "2d",
    
    // Chart Types
    CHART_LINE: "line",
    CHART_DOUGHNUT: "doughnut", 
    CHART_BAR: "bar"
};

const ApiEndpoints = {
    CLOCK_IN: "/lazyhr/api/attendance/clock-in?userId=",
    CLOCK_OUT: "/lazyhr/api/attendance/clock-out?userId=",
    LEAVE_APPLY: "/lazyhr/api/leave/apply",
    LEAVE_USER: "/lazyhr/api/leave/user/",
    LEAVE_CANCEL: "/lazyhr/api/leave/",
    LEAVE_UPDATE: "/lazyhr/api/leave/",
    LEAVE_CANCEL_WITH_USER_ID: (id, userId) => `/lazyhr/api/leave/${id}/cancel?userId=${userId}`,
    USERS_UPDATE: (userId) => `/lazyhr/api/users/${userId}`
};

const HttpMethods = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE"
};

const ContentTypes = {
    APPLICATION_JSON: "application/json"
};

const LeavePeriods = {
    AM: "AM",
    PM: "PM"
};

const EventTypes = {
    CHANGE: "change",
    SUBMIT: "submit",
    HIDDEN_BS_MODAL: "hidden.bs.modal",
    DOM_CONTENT_LOADED: "DOMContentLoaded",
    CLICK: "click"
};

const UrlParams = {
    ATTENDANCE_REFRESH: "/lazyhr/attendance?t=",
    TIMESTAMP_PARAM: () => new Date().getTime()
};

const CssClasses = {
    ROLE_BADGE: "role-badge",
    STATUS_BADGE: "status-badge",
    BADGE_SUCCESS: "badge-success",
    BADGE_SECONDARY: "badge-secondary"
};

const HttpStatus = {
    SUCCESS: "success",
    ERROR: "error"
};

const DateTimeFormats = {
    MMM_DD_YYYY: "MMM dd, yyyy",
    EEEE: "EEEE",
    HH_MM_SS: "HH:mm:ss",
    HH_MM: "HH:mm",
    TIME_NOT_AVAILABLE: "--:--:--",
    DATE_NOT_AVAILABLE: "-"
};

const DateTimeData = {
    MONTHS: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    DAYS: [
        "Sunday", "Monday", "Tuesday", "Wednesday", 
        "Thursday", "Friday", "Saturday"
    ]
};

const LocaleOptions = {
    TIME_OPTIONS: {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    },
    DATE_OPTIONS: {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    },
    DATE_FORMAT_OPTIONS: {
        year: "numeric",
        month: "short",
        day: "numeric"
    },
    LOCALE_EN_US: "en-US"
};

const DomElements = {
    CURRENT_TIME: "currentTime",
    CURRENT_DATE: "currentDate",
    VIEW_USER_MODAL: "viewUserModal",
    EDIT_USER_MODAL: "editUserModal", 
    DELETE_USER_MODAL: "deleteUserModal",
    CONFIRM_DELETE_BTN: "confirmDeleteBtn",
    DELETE_USER_NAME: "deleteUserName",
    VIEW_USER_ID: "viewUserId",
    VIEW_EMPLOYEE_ID: "viewEmployeeId",
    VIEW_FIRST_NAME: "viewFirstName",
    VIEW_LAST_NAME: "viewLastName",
    VIEW_USERNAME: "viewUsername",
    VIEW_EMAIL: "viewEmail",
    VIEW_DEPARTMENT: "viewDepartment",
    VIEW_POSITION: "viewPosition",
    VIEW_ROLE: "viewRole",
    VIEW_STATUS: "viewStatus",
    VIEW_HIRE_DATE: "viewHireDate",
    VIEW_LAST_LOGIN: "viewLastLogin",
    VIEW_SALARY: "viewSalary",
    VIEW_USER_AVATAR: "viewUserAvatar",
    
    // Edit User Modal Elements
    EDIT_USER_ID: "editUserId",
    EDIT_FIRST_NAME: "editFirstName",
    EDIT_LAST_NAME: "editLastName",
    EDIT_USERNAME: "editUsername",
    EDIT_EMAIL: "editEmail",
    EDIT_EMPLOYEE_ID: "editEmployeeId",
    EDIT_ROLE: "editRole",
    EDIT_DEPARTMENT: "editDepartment",
    EDIT_POSITION: "editPosition",
    EDIT_HIRE_DATE: "editHireDate",
    EDIT_SALARY: "editSalary",
    EDIT_IS_ACTIVE: "editIsActive",
    
    // Filter Elements
    SEARCH_INPUT: "searchInput",
    ROLE_FILTER: "roleFilter",
    STATUS_FILTER: "statusFilter",
    USERS_TABLE: "usersTable",
    
    // Form Elements
    ADD_USER_FORM: "addUserForm",
    EDIT_USER_FORM: "editUserForm",
    ADD_USER_MODAL: "addUserModal",
    
    // Leave Management Elements
    START_DATE: "startDate",
    END_DATE: "endDate",
    LEAVE_PERIOD: "leavePeriod",
    TOTAL_DAYS: "totalDays",
    APPLY_LEAVE_MODAL: "applyLeaveModal",
    LEAVE_FORM: "leaveForm",
    LEAVE_ID: "leaveId",
    LEAVE_CATEGORY: "leaveCategory",
    REASON: "reason",
    
    // Dashboard Elements
    CLOCK_IN_BTN: "clockInBtn",
    CLOCK_OUT_BTN: "clockOutBtn",
    LEAVE_MODAL: "leaveModal",
    LEAVE_APPLICATION_FORM: "leaveApplicationForm",
    
    // Reports Elements
    ATTENDANCE_CHART: "attendanceChart",
    LEAVE_CHART: "leaveChart", 
    DEPARTMENT_CHART: "departmentChart",
    DATE_RANGE: "dateRange",
    CUSTOM_DATE_RANGE: "customDateRange",
    REPORT_TYPE: "reportType",
    DEPARTMENT: "department",
    EMPLOYEE: "employee",
    ATTENDANCE_RATE: "attendanceRate",
    LEAVE_UTILIZATION: "leaveUtilization"
};

const Bootstrap = {
    TOOLTIP_SELECTOR: '[data-bs-toggle="tooltip"]'
};

const HtmlContent = {
    DELETING_SPINNER: '<i class="fas fa-spinner fa-spin me-1"></i>Deleting...',
    ADDING_USER_SPINNER: '<i class="fas fa-spinner fa-spin me-1"></i>Adding User...',
    SAVING_CHANGES_SPINNER: '<i class="fas fa-spinner fa-spin me-1"></i>Saving Changes...'
};

const CssStyles = {
    ALERT_POSITION: "top: 20px; right: 20px; z-index: 9999; min-width: 300px;",
    DIV_ELEMENT: "div"
};

const IconClasses = {
    CHECK_CIRCLE: "check-circle",
    EXCLAMATION_CIRCLE: "exclamation-circle", 
    INFO_CIRCLE: "info-circle"
};

const JavaScriptTypes = {
    UNDEFINED: "undefined",
    NUMBER: "number",
    STRING: "string"
};

const CssSelectors = {
    DATE_FORMAT: ".date-format",
    DAY_FORMAT: ".day-format",
    TIME_FORMAT: ".time-format",
    TIMESTAMP_FORMAT: ".timestamp-format",
    FORMAT_TIMESTAMP: ".format-timestamp",
    FORMAT_TIMESTAMP_SHORT: ".format-timestamp-short",
    FORMAT_TIME: ".format-time",
    ATTENDANCE_TIME_RANGE: ".attendance-time-range",
    LEAVE_APPLICATION_FORM: "#leaveApplicationForm",
    START_DATE_SELECTOR: "#startDate",
    END_DATE_SELECTOR: "#endDate",
    SUBMIT_BUTTON: 'button[type="submit"]'
};

const DataAttributes = {
    TIMESTAMP: "data-timestamp"
};

const TableStructure = {
    TBODY_TAG: "tbody",
    TR_TAG: "tr", 
    TD_TAG: "td",
    NAME_COLUMN_INDEX: 1,
    EMPLOYEE_ID_COLUMN_INDEX: 2,
    EMAIL_COLUMN_INDEX: 3,
    ROLE_COLUMN_INDEX: 6,
    STATUS_COLUMN_INDEX: 8,
    DISPLAY_NONE: "none",
    DISPLAY_BLOCK: "",
    STATUS_ACTIVE_TEXT: "Active",
    STATUS_TRUE: "true",
    STATUS_FALSE: "false"
};

// Export for use in other files (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Messages, ApiEndpoints, UrlParams, CssClasses, HttpStatus };
}
