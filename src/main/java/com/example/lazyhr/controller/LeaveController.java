package com.example.lazyhr.controller;

import com.example.lazyhr.model.LeaveRequest;
import com.example.lazyhr.model.LeaveStatus;
import com.example.lazyhr.service.LeaveService;
import com.example.lazyhr.service.UserService;
import com.example.lazyhr.constants.ApiMessages;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave")
@CrossOrigin(origins = "*")
public class LeaveController {

    private static final Logger logger = LoggerFactory.getLogger(LeaveController.class);

    @Autowired
    private LeaveService leaveService;

    @Autowired
    private UserService userService;

    /**
     * Apply for leave
     */
    @PostMapping("/apply")
    public ResponseEntity<?> applyLeave(@RequestBody LeaveRequestDto leaveRequestDto) {
        try {
            logger.debug("Received leave request: {}", leaveRequestDto);
            logger.debug("User ID: {}, Category: {}, Period: {}", 
                    leaveRequestDto.getUserId(), 
                    leaveRequestDto.getLeaveCategory(), 
                    leaveRequestDto.getLeavePeriod());

            // Convert DTO to entity
            LeaveRequest leaveRequest = new LeaveRequest();
            leaveRequest.setUser(userService.findById(leaveRequestDto.getUserId()));
            leaveRequest.setLeaveCategory(leaveRequestDto.getLeaveCategory());
            leaveRequest.setLeavePeriod(leaveRequestDto.getLeavePeriod());
            leaveRequest.setStartDate(leaveRequestDto.getStartDate());
            leaveRequest.setEndDate(leaveRequestDto.getEndDate());
            leaveRequest.setReason(leaveRequestDto.getReason());

            logger.info("Applying leave request for user ID: {}", leaveRequestDto.getUserId());
            LeaveRequest savedRequest = leaveService.applyLeave(leaveRequest);
            logger.info("Leave request saved successfully with ID: {}", savedRequest.getId());

            return ResponseEntity
                    .ok(new ApiResponse(ApiMessages.SUCCESS, ApiMessages.LEAVE_APPLICATION_SUBMITTED_SUCCESSFULLY, savedRequest));
        } catch (IllegalArgumentException | IllegalStateException e) {
            logger.warn(ApiMessages.VALIDATION_ERROR_IN_LEAVE_APPLICATION, e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(ApiMessages.ERROR, e.getMessage(), null));
        } catch (Exception e) {
            logger.error(ApiMessages.UNEXPECTED_ERROR_IN_LEAVE_APPLICATION, e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(ApiMessages.ERROR, ApiMessages.FAILED_TO_APPLY_FOR_LEAVE + e.getMessage(), null));
        }
    }

    /**
     * Approve leave request
     */
    @PostMapping("/{leaveId}/approve")
    public ResponseEntity<?> approveLeave(
            @PathVariable Long leaveId,
            @RequestParam Long approverId,
            @RequestParam(required = false) String comments) {

        try {
            LeaveRequest approvedRequest = leaveService.approveLeave(leaveId, approverId, comments);
            return ResponseEntity.ok(new ApiResponse(ApiMessages.SUCCESS, ApiMessages.LEAVE_REQUEST_APPROVED, approvedRequest));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(ApiMessages.ERROR, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(ApiMessages.ERROR, ApiMessages.FAILED_TO_APPROVE_LEAVE + e.getMessage(), null));
        }
    }

    /**
     * Reject leave request
     */
    @PostMapping("/{leaveId}/reject")
    public ResponseEntity<?> rejectLeave(
            @PathVariable Long leaveId,
            @RequestParam Long approverId,
            @RequestParam(required = false) String comments) {

        try {
            LeaveRequest rejectedRequest = leaveService.rejectLeave(leaveId, approverId, comments);
            return ResponseEntity.ok(new ApiResponse(ApiMessages.SUCCESS, ApiMessages.LEAVE_REQUEST_REJECTED, rejectedRequest));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(ApiMessages.ERROR, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(ApiMessages.ERROR, ApiMessages.FAILED_TO_REJECT_LEAVE + e.getMessage(), null));
        }
    }

    /**
     * Get user's leave requests
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserLeaves(@PathVariable Long userId) {
        try {
            List<LeaveRequest> leaveRequests = leaveService.getUserLeaveRequests(userId);
            return ResponseEntity.ok(new ApiResponse(ApiMessages.SUCCESS, ApiMessages.USER_LEAVE_REQUESTS_RETRIEVED, leaveRequests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(ApiMessages.ERROR, ApiMessages.FAILED_TO_FETCH_LEAVE_REQUESTS + e.getMessage(), null));
        }
    }

    /**
     * Get leave requests by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getLeavesByStatus(@PathVariable LeaveStatus status) {
        try {
            List<LeaveRequest> leaveRequests = leaveService.getLeaveRequestsByStatus(status);
            return ResponseEntity.ok(new ApiResponse(ApiMessages.SUCCESS, ApiMessages.LEAVE_REQUESTS_RETRIEVED_BY_STATUS, leaveRequests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(ApiMessages.ERROR, ApiMessages.FAILED_TO_FETCH_LEAVE_REQUESTS + e.getMessage(), null));
        }
    }

    /**
     * Get pending leave requests
     */
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingLeaves() {
        try {
            List<LeaveRequest> pendingRequests = leaveService.getPendingLeaveRequests();
            return ResponseEntity.ok(new ApiResponse(ApiMessages.SUCCESS, ApiMessages.PENDING_LEAVE_REQUESTS_RETRIEVED, pendingRequests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(ApiMessages.ERROR, ApiMessages.FAILED_TO_FETCH_PENDING_REQUESTS + e.getMessage(), null));
        }
    }

    /**
     * Get leave request by ID
     */
    @GetMapping("/{leaveId}")
    public ResponseEntity<?> getLeaveById(@PathVariable Long leaveId) {
        try {
            LeaveRequest leaveRequest = leaveService.getLeaveRequestById(leaveId);
            return ResponseEntity.ok(new ApiResponse(ApiMessages.SUCCESS, ApiMessages.LEAVE_REQUEST_RETRIEVED, leaveRequest));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(ApiMessages.ERROR, ApiMessages.FAILED_TO_FETCH_LEAVE_REQUEST + e.getMessage(), null));
        }
    }

    /**
     * Get leave requests for a specific date
     */
    @GetMapping("/date/{timestamp}")
    public ResponseEntity<?> getLeavesByTimestamp(@PathVariable Long timestamp) {
        try {
            List<LeaveRequest> leaveRequests = leaveService.getLeaveRequestsForTimestamp(timestamp);
            return ResponseEntity.ok(new ApiResponse(ApiMessages.SUCCESS, ApiMessages.LEAVE_REQUESTS_FOR_DATE_RETRIEVED, leaveRequests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(ApiMessages.ERROR, ApiMessages.FAILED_TO_FETCH_LEAVE_REQUESTS + e.getMessage(), null));
        }
    }

    /**
     * Cancel leave request
     */
    @DeleteMapping("/{leaveId}/cancel")
    public ResponseEntity<?> cancelLeave(@PathVariable Long leaveId, @RequestParam Long userId) {
        try {
            leaveService.cancelLeaveRequest(leaveId, userId);
            return ResponseEntity.ok(new ApiResponse(ApiMessages.SUCCESS, ApiMessages.LEAVE_REQUEST_CANCELLED_SUCCESSFULLY, null));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(ApiMessages.ERROR, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(ApiMessages.ERROR, ApiMessages.FAILED_TO_CANCEL_LEAVE_REQUEST + e.getMessage(), null));
        }
    }

    /**
     * Get leave balance summary
     */
    @GetMapping("/balance/{userId}")
    public ResponseEntity<?> getLeaveBalance(@PathVariable Long userId, @RequestParam(defaultValue = "2024") int year) {
        try {
            LeaveService.LeaveBalanceSummary balance = leaveService.getLeaveBalanceSummary(userId, year);
            return ResponseEntity.ok(new ApiResponse(ApiMessages.SUCCESS, ApiMessages.LEAVE_BALANCE_RETRIEVED, balance));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(ApiMessages.ERROR, ApiMessages.FAILED_TO_FETCH_LEAVE_BALANCE + e.getMessage(), null));
        }
    }

    /**
     * Get leave statistics
     */
    @GetMapping("/stats/pending-count")
    public ResponseEntity<?> getPendingCount() {
        try {
            long pendingCount = leaveService.getPendingLeaveRequestsCount();
            return ResponseEntity.ok(new ApiResponse(ApiMessages.SUCCESS, ApiMessages.PENDING_LEAVE_REQUESTS_COUNT, pendingCount));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(ApiMessages.ERROR, ApiMessages.FAILED_TO_FETCH_PENDING_COUNT + e.getMessage(), null));
        }
    }

    // Inner classes for DTOs and responses
    public static class LeaveRequestDto {
        private Long userId;
        private com.example.lazyhr.model.LeaveCategory leaveCategory;
        private com.example.lazyhr.model.LeavePeriod leavePeriod;
        private Long startDate; // Unix timestamp in milliseconds
        private Long endDate; // Unix timestamp in milliseconds
        private String reason;

        // Getters and setters
        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public com.example.lazyhr.model.LeaveCategory getLeaveCategory() {
            return leaveCategory;
        }

        public void setLeaveCategory(com.example.lazyhr.model.LeaveCategory leaveCategory) {
            this.leaveCategory = leaveCategory;
        }

        public com.example.lazyhr.model.LeavePeriod getLeavePeriod() {
            return leavePeriod;
        }

        public void setLeavePeriod(com.example.lazyhr.model.LeavePeriod leavePeriod) {
            this.leavePeriod = leavePeriod;
        }

        public Long getStartDate() {
            return startDate;
        }

        public void setStartDate(Long startDate) {
            this.startDate = startDate;
        }

        public Long getEndDate() {
            return endDate;
        }

        public void setEndDate(Long endDate) {
            this.endDate = endDate;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }

        @Override
        public String toString() {
            return "LeaveRequestDto{" +
                    "userId=" + userId +
                    ", leaveCategory=" + leaveCategory +
                    ", leavePeriod=" + leavePeriod +
                    ", startDate=" + startDate +
                    ", endDate=" + endDate +
                    ", reason='" + reason + '\'' +
                    '}';
        }
    }

    public static class ApiResponse {
        private String status;
        private String message;
        private Object data;

        public ApiResponse(String status, String message, Object data) {
            this.status = status;
            this.message = message;
            this.data = data;
        }

        // Getters and setters
        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public Object getData() {
            return data;
        }

        public void setData(Object data) {
            this.data = data;
        }
    }
}
