package com.example.lazyhr.constants;

/**
 * Constants for API response messages and other hardcoded strings
 */
public final class ApiMessages {

    // Private constructor to prevent instantiation
    private ApiMessages() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }

    // API Response Status
    public static final String SUCCESS = "success";
    public static final String ERROR = "error";

    // User Management Messages
    public static final String USER_CREATED_SUCCESSFULLY = "User created successfully";
    public static final String USER_UPDATED_SUCCESSFULLY = "User updated successfully";
    public static final String USER_RETRIEVED_SUCCESSFULLY = "User retrieved successfully";
    public static final String USERS_RETRIEVED_SUCCESSFULLY = "Users retrieved successfully";
    public static final String USER_ACTIVATED_SUCCESSFULLY = "User activated successfully";
    public static final String USER_DEACTIVATED_SUCCESSFULLY = "User deactivated successfully";
    public static final String PASSWORD_UPDATED_SUCCESSFULLY = "Password updated successfully";
    public static final String USERNAME_AVAILABILITY_CHECKED = "Username availability checked";
    public static final String EMAIL_AVAILABILITY_CHECKED = "Email availability checked";
    public static final String SEARCH_RESULTS_RETRIEVED = "Search results retrieved";
    public static final String USERS_BY_DEPARTMENT_RETRIEVED = "Users by department retrieved";
    public static final String USERS_BY_ROLE_RETRIEVED = "Users by role retrieved";
    public static final String USER_STATISTICS_RETRIEVED = "User statistics retrieved";

    // User Error Messages
    public static final String FAILED_TO_CREATE_USER = "Failed to create user: ";
    public static final String FAILED_TO_UPDATE_USER = "Failed to update user: ";
    public static final String FAILED_TO_FETCH_USER = "Failed to fetch user: ";
    public static final String FAILED_TO_FETCH_USERS = "Failed to fetch users: ";
    public static final String FAILED_TO_ACTIVATE_USER = "Failed to activate user: ";
    public static final String FAILED_TO_DEACTIVATE_USER = "Failed to deactivate user: ";
    public static final String FAILED_TO_UPDATE_PASSWORD = "Failed to update password: ";
    public static final String FAILED_TO_CHECK_USERNAME = "Failed to check username: ";
    public static final String FAILED_TO_CHECK_EMAIL = "Failed to check email: ";
    public static final String FAILED_TO_SEARCH_USERS = "Failed to search users: ";
    public static final String FAILED_TO_FETCH_USERS_BY_DEPARTMENT = "Failed to fetch users by department: ";
    public static final String FAILED_TO_FETCH_USERS_BY_ROLE = "Failed to fetch users by role: ";
    public static final String FAILED_TO_FETCH_USER_STATS = "Failed to fetch user stats: ";

    // Leave Management Messages
    public static final String LEAVE_APPLICATION_SUBMITTED_SUCCESSFULLY = "Leave application submitted successfully";
    public static final String LEAVE_REQUEST_APPROVED = "Leave request approved";
    public static final String LEAVE_REQUEST_REJECTED = "Leave request rejected";
    public static final String LEAVE_REQUEST_RETRIEVED = "Leave request retrieved";
    public static final String LEAVE_REQUEST_CANCELLED_SUCCESSFULLY = "Leave request cancelled successfully";
    public static final String USER_LEAVE_REQUESTS_RETRIEVED = "User leave requests retrieved";
    public static final String LEAVE_REQUESTS_RETRIEVED_BY_STATUS = "Leave requests retrieved by status";
    public static final String PENDING_LEAVE_REQUESTS_RETRIEVED = "Pending leave requests retrieved";
    public static final String LEAVE_REQUESTS_FOR_DATE_RETRIEVED = "Leave requests for date retrieved";
    public static final String LEAVE_BALANCE_RETRIEVED = "Leave balance retrieved";
    public static final String PENDING_LEAVE_REQUESTS_COUNT = "Pending leave requests count";

    // Leave Error Messages
    public static final String FAILED_TO_APPLY_FOR_LEAVE = "Failed to apply for leave: ";
    public static final String FAILED_TO_APPROVE_LEAVE = "Failed to approve leave: ";
    public static final String FAILED_TO_REJECT_LEAVE = "Failed to reject leave: ";
    public static final String FAILED_TO_FETCH_LEAVE_REQUEST = "Failed to fetch leave request: ";
    public static final String FAILED_TO_FETCH_LEAVE_REQUESTS = "Failed to fetch leave requests: ";
    public static final String FAILED_TO_FETCH_PENDING_REQUESTS = "Failed to fetch pending requests: ";
    public static final String FAILED_TO_CANCEL_LEAVE_REQUEST = "Failed to cancel leave request: ";
    public static final String FAILED_TO_FETCH_LEAVE_BALANCE = "Failed to fetch leave balance: ";
    public static final String FAILED_TO_FETCH_PENDING_COUNT = "Failed to fetch pending count: ";

    // Attendance Management Messages
    public static final String ATTENDANCE_CLOCKED_IN_SUCCESSFULLY = "Clocked in successfully";
    public static final String ATTENDANCE_CLOCKED_OUT_SUCCESSFULLY = "Clocked out successfully";
    public static final String ATTENDANCE_RETRIEVED_SUCCESSFULLY = "Attendance retrieved successfully";
    public static final String ATTENDANCE_RECORDS_RETRIEVED = "Attendance records retrieved";
    public static final String ATTENDANCE_SUMMARY_RETRIEVED = "Attendance summary retrieved";

    // Attendance Error Messages
    public static final String FAILED_TO_CLOCK_IN = "Failed to clock in: ";
    public static final String FAILED_TO_CLOCK_OUT = "Failed to clock out: ";
    public static final String FAILED_TO_FETCH_ATTENDANCE = "Failed to fetch attendance: ";
    public static final String FAILED_TO_FETCH_ATTENDANCE_RECORDS = "Failed to fetch attendance records: ";

    // Entity Validation Messages
    public static final String USER_NOT_FOUND = "User not found";
    public static final String LEAVE_REQUEST_NOT_FOUND = "Leave request not found";
    public static final String ATTENDANCE_NOT_FOUND = "Attendance not found";
    public static final String START_DATE_AFTER_END_DATE = "Start date cannot be after end date";
    public static final String CANNOT_APPLY_LEAVE_IN_PAST = "Cannot apply for leave in the past";
    public static final String LEAVE_REQUEST_NOT_PENDING = "Leave request is not in pending status";
    public static final String LEAVE_REQUEST_WRONG_USER = "Leave request does not belong to the user";
    public static final String ONLY_PENDING_REQUESTS_CAN_BE_CANCELLED = "Only pending leave requests can be cancelled";
    public static final String CANNOT_CANCEL_PAST_LEAVE = "Cannot cancel leave request that starts today or in the past";

    // General Error Messages
    public static final String ERROR_LOADING_DASHBOARD = "Error loading dashboard: ";
    public static final String ERROR_LOADING_LEAVE_PAGE = "Error loading leave page: ";
    public static final String ERROR_LOADING_USERS = "Error loading users: ";
    public static final String ERROR_LOADING_REPORTS = "Error loading reports: ";
    public static final String AN_ERROR_OCCURRED = "An error occurred";

    // Log Messages
    public static final String LEAVE_REQUEST_SAVED_SUCCESSFULLY = "Leave request saved successfully with ID: {}";
    public static final String VALIDATION_ERROR_IN_LEAVE_APPLICATION = "Validation error in leave application: {}";
    public static final String UNEXPECTED_ERROR_IN_LEAVE_APPLICATION = "Unexpected error in leave application";
    public static final String SAMPLE_USERS_CREATED_SUCCESSFULLY = "Sample users created successfully!";
    public static final String ERROR_CREATING_SAMPLE_USERS = "Error creating sample users: {}";

    // CSS Classes for Status Badges
    public static final String BADGE_SUCCESS = "badge-success";
    public static final String BADGE_WARNING = "badge-warning";
    public static final String BADGE_DANGER = "badge-danger";
    public static final String BADGE_SECONDARY = "badge-secondary";

    // Common Entity Names
    public static final String ENTITY_USER = "user";
    public static final String ENTITY_LEAVE_REQUEST = "leave_request";
    public static final String ENTITY_ATTENDANCE = "attendance";

    // Entity Exception Messages
    public static final String USERNAME_ALREADY_EXISTS = "Username already exists: ";
    public static final String EMAIL_ALREADY_EXISTS = "Email already exists: ";
    public static final String EMPLOYEE_ID_ALREADY_EXISTS = "Employee ID already exists: ";
    public static final String USER_NOT_FOUND_WITH_USERNAME = "User not found with username: ";
    public static final String USER_NOT_FOUND_WITH_ID = "User not found with ID: ";
    public static final String LEAVE_REQUEST_NOT_FOUND_WITH_ID = "Leave request not found with ID: ";
    public static final String APPROVER_NOT_FOUND_WITH_ID = "Approver not found with ID: ";
    public static final String ATTENDANCE_RECORD_NOT_FOUND_WITH_ID = "Attendance record not found with ID: ";
    public static final String USER_ACCOUNT_INACTIVE = "User account is inactive: ";
    public static final String NO_ACTIVE_CLOCK_IN_FOUND = "No active clock-in found for user. Please clock in first.";
    
    // Leave Business Logic Messages
    public static final String LEAVE_REQUEST_OVERLAPS = "Leave request overlaps with existing approved leave from ";
    public static final String TO = " to ";
    
    // Frontend Error Messages
    public static final String FAILED_TO_FETCH_TODAYS_ATTENDANCE = "Failed to fetch today's attendance: ";
    public static final String FAILED_TO_FETCH_TODAYS_ATTENDANCES = "Failed to fetch today's attendances: ";
    public static final String FAILED_TO_FETCH_ATTENDANCE_HISTORY = "Failed to fetch attendance history: ";
    public static final String FAILED_TO_FETCH_ATTENDANCE_STATUS = "Failed to fetch attendance status: ";
    public static final String FAILED_TO_UPDATE_NOTES = "Failed to update notes: ";
    public static final String FAILED_TO_UPDATE_BREAK_DURATION = "Failed to update break duration: ";
    public static final String FAILED_TO_FETCH_STATS = "Failed to fetch stats: ";

    // Security Configuration
    public static final String DEFAULT_SUCCESS_URL = "/dashboard";
    public static final String LOGOUT_SUCCESS_URL = "/login?logout";
}
