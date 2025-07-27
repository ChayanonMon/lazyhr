package com.example.lazyhr.controller;

import com.example.lazyhr.model.LeaveRequest;
import com.example.lazyhr.model.LeaveStatus;
import com.example.lazyhr.service.LeaveService;
import com.example.lazyhr.service.UserService;
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
                    .ok(new ApiResponse("success", "Leave application submitted successfully", savedRequest));
        } catch (IllegalArgumentException | IllegalStateException e) {
            logger.warn("Validation error in leave application: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Unexpected error in leave application", e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to apply for leave: " + e.getMessage(), null));
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
            return ResponseEntity.ok(new ApiResponse("success", "Leave request approved", approvedRequest));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to approve leave: " + e.getMessage(), null));
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
            return ResponseEntity.ok(new ApiResponse("success", "Leave request rejected", rejectedRequest));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to reject leave: " + e.getMessage(), null));
        }
    }

    /**
     * Get user's leave requests
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserLeaves(@PathVariable Long userId) {
        try {
            List<LeaveRequest> leaveRequests = leaveService.getUserLeaveRequests(userId);
            return ResponseEntity.ok(new ApiResponse("success", "User leave requests retrieved", leaveRequests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to fetch leave requests: " + e.getMessage(), null));
        }
    }

    /**
     * Get leave requests by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getLeavesByStatus(@PathVariable LeaveStatus status) {
        try {
            List<LeaveRequest> leaveRequests = leaveService.getLeaveRequestsByStatus(status);
            return ResponseEntity.ok(new ApiResponse("success", "Leave requests retrieved by status", leaveRequests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to fetch leave requests: " + e.getMessage(), null));
        }
    }

    /**
     * Get pending leave requests
     */
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingLeaves() {
        try {
            List<LeaveRequest> pendingRequests = leaveService.getPendingLeaveRequests();
            return ResponseEntity.ok(new ApiResponse("success", "Pending leave requests retrieved", pendingRequests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to fetch pending requests: " + e.getMessage(), null));
        }
    }

    /**
     * Get leave request by ID
     */
    @GetMapping("/{leaveId}")
    public ResponseEntity<?> getLeaveById(@PathVariable Long leaveId) {
        try {
            LeaveRequest leaveRequest = leaveService.getLeaveRequestById(leaveId);
            return ResponseEntity.ok(new ApiResponse("success", "Leave request retrieved", leaveRequest));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to fetch leave request: " + e.getMessage(), null));
        }
    }

    /**
     * Get leave requests for a specific date
     */
    @GetMapping("/date/{timestamp}")
    public ResponseEntity<?> getLeavesByTimestamp(@PathVariable Long timestamp) {
        try {
            List<LeaveRequest> leaveRequests = leaveService.getLeaveRequestsForTimestamp(timestamp);
            return ResponseEntity.ok(new ApiResponse("success", "Leave requests for date retrieved", leaveRequests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to fetch leave requests: " + e.getMessage(), null));
        }
    }

    /**
     * Cancel leave request
     */
    @DeleteMapping("/{leaveId}/cancel")
    public ResponseEntity<?> cancelLeave(@PathVariable Long leaveId, @RequestParam Long userId) {
        try {
            leaveService.cancelLeaveRequest(leaveId, userId);
            return ResponseEntity.ok(new ApiResponse("success", "Leave request cancelled successfully", null));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to cancel leave request: " + e.getMessage(), null));
        }
    }

    /**
     * Get leave balance summary
     */
    @GetMapping("/balance/{userId}")
    public ResponseEntity<?> getLeaveBalance(@PathVariable Long userId, @RequestParam(defaultValue = "2024") int year) {
        try {
            LeaveService.LeaveBalanceSummary balance = leaveService.getLeaveBalanceSummary(userId, year);
            return ResponseEntity.ok(new ApiResponse("success", "Leave balance retrieved", balance));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to fetch leave balance: " + e.getMessage(), null));
        }
    }

    /**
     * Get leave statistics
     */
    @GetMapping("/stats/pending-count")
    public ResponseEntity<?> getPendingCount() {
        try {
            long pendingCount = leaveService.getPendingLeaveRequestsCount();
            return ResponseEntity.ok(new ApiResponse("success", "Pending leave requests count", pendingCount));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to fetch pending count: " + e.getMessage(), null));
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
