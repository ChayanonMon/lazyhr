package com.example.lazyhr.service;

import com.example.lazyhr.model.LeaveRequest;
import com.example.lazyhr.model.User;
import com.example.lazyhr.model.LeaveStatus;
import com.example.lazyhr.model.LeaveCategory;
import com.example.lazyhr.repository.LeaveRequestRepository;
import com.example.lazyhr.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
@Transactional
public class LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Apply for leave
     */
    public LeaveRequest applyLeave(LeaveRequest leaveRequest) {
        // Validate user exists
        User user = userRepository.findById(leaveRequest.getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        leaveRequest.setUser(user);

        // Validate dates
        if (leaveRequest.getStartDate() > leaveRequest.getEndDate()) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }

        long currentTime = System.currentTimeMillis();
        if (leaveRequest.getStartDate() < currentTime) {
            throw new IllegalArgumentException("Cannot apply for leave in the past");
        }

        // Check for overlapping approved leaves
        List<LeaveRequest> overlappingLeaves = leaveRequestRepository.findOverlappingLeavesTimestamp(
                user, leaveRequest.getStartDate(), leaveRequest.getEndDate());

        if (!overlappingLeaves.isEmpty()) {
            throw new IllegalStateException("Leave request overlaps with existing approved leave from " +
                    Instant.ofEpochMilli(overlappingLeaves.get(0).getStartDate()).toString() + " to " +
                    Instant.ofEpochMilli(overlappingLeaves.get(0).getEndDate()).toString());
        }

        // Calculate total days
        leaveRequest.calculateTotalDays();

        // Set initial status
        leaveRequest.setStatus(LeaveStatus.PENDING);

        return leaveRequestRepository.save(leaveRequest);
    }

    /**
     * Approve leave request
     */
    public LeaveRequest approveLeave(Long leaveId, Long approverId, String comments) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new EntityNotFoundException("Leave request not found with ID: " + leaveId));

        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new EntityNotFoundException("Approver not found with ID: " + approverId));

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new IllegalStateException("Leave request is not in pending status");
        }

        leaveRequest.setStatus(LeaveStatus.APPROVED);
        leaveRequest.setApprovedBy(approver);
        leaveRequest.setApprovedDate(System.currentTimeMillis());
        leaveRequest.setComments(comments);

        return leaveRequestRepository.save(leaveRequest);
    }

    /**
     * Reject leave request
     */
    public LeaveRequest rejectLeave(Long leaveId, Long approverId, String comments) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new EntityNotFoundException("Leave request not found with ID: " + leaveId));

        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new EntityNotFoundException("Approver not found with ID: " + approverId));

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new IllegalStateException("Leave request is not in pending status");
        }

        leaveRequest.setStatus(LeaveStatus.REJECTED);
        leaveRequest.setApprovedBy(approver);
        leaveRequest.setApprovedDate(System.currentTimeMillis());
        leaveRequest.setComments(comments);

        return leaveRequestRepository.save(leaveRequest);
    }

    /**
     * Get user's leave requests
     */
    @Transactional(readOnly = true)
    public List<LeaveRequest> getUserLeaveRequests(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        return leaveRequestRepository.findByUserOrderByAppliedDateDesc(user);
    }

    /**
     * Get leave requests by status
     */
    @Transactional(readOnly = true)
    public List<LeaveRequest> getLeaveRequestsByStatus(LeaveStatus status) {
        return leaveRequestRepository.findByStatusOrderByAppliedDateDesc(status);
    }

    /**
     * Get pending leave requests
     */
    @Transactional(readOnly = true)
    public List<LeaveRequest> getPendingLeaveRequests() {
        return leaveRequestRepository.findPendingLeaveRequests();
    }

    /**
     * Get leave request by ID
     */
    @Transactional(readOnly = true)
    public LeaveRequest getLeaveRequestById(Long id) {
        return leaveRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Leave request not found with ID: " + id));
    }

    /**
     * Get user's leave requests by status
     */
    @Transactional(readOnly = true)
    public List<LeaveRequest> getUserLeaveRequestsByStatus(Long userId, LeaveStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        return leaveRequestRepository.findByUserAndStatusOrderByAppliedDateDesc(user, status);
    }

    /**
     * Get leave requests for a specific date (timestamp version)
     */
    @Transactional(readOnly = true)
    public List<LeaveRequest> getLeaveRequestsForTimestamp(Long timestamp) {
        // Convert timestamp to LocalDate for repository call
        LocalDate date = Instant.ofEpochMilli(timestamp).atZone(ZoneId.systemDefault()).toLocalDate();
        return leaveRequestRepository.findLeaveRequestsForTimestamp(timestamp);
    }

    /**
     * Get leave requests for a specific date (deprecated - use timestamp version)
     */
    @Transactional(readOnly = true)
    @Deprecated
    public List<LeaveRequest> getLeaveRequestsForDate(LocalDate date) {
        long timestamp = date.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
        return leaveRequestRepository.findLeaveRequestsForDate(timestamp);
    }

    /**
     * Get total leave days used by user, category and year
     */
    @Transactional(readOnly = true)
    public Double getTotalLeaveDaysUsed(Long userId, LeaveCategory category, int year) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        // Convert year to timestamp range
        LocalDate yearStart = LocalDate.of(year, 1, 1);
        LocalDate yearEnd = LocalDate.of(year + 1, 1, 1); // Start of next year
        long yearStartTimestamp = yearStart.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
        long yearEndTimestamp = yearEnd.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();

        Double totalDays = leaveRequestRepository.getTotalLeaveDaysByUserAndCategoryAndYear(user, category,
                yearStartTimestamp, yearEndTimestamp);
        return totalDays != null ? totalDays : 0.0;
    }

    /**
     * Check if user has pending leave requests
     */
    @Transactional(readOnly = true)
    public boolean hasUserPendingLeaveRequests(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        List<LeaveRequest> pendingRequests = leaveRequestRepository.findByUserAndStatusOrderByAppliedDateDesc(user,
                LeaveStatus.PENDING);
        return !pendingRequests.isEmpty();
    }

    /**
     * Get leave statistics
     */
    @Transactional(readOnly = true)
    public long getPendingLeaveRequestsCount() {
        return leaveRequestRepository.countPendingLeaveRequests();
    }

    /**
     * Get leave requests by department and status
     */
    @Transactional(readOnly = true)
    public List<LeaveRequest> getLeaveRequestsByDepartmentAndStatus(String department, LeaveStatus status) {
        return leaveRequestRepository.findByDepartmentAndStatus(department, status);
    }

    /**
     * Cancel leave request (only if pending)
     */
    public void cancelLeaveRequest(Long leaveId, Long userId) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new EntityNotFoundException("Leave request not found with ID: " + leaveId));

        // Verify the leave request belongs to the user
        if (!leaveRequest.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Leave request does not belong to the user");
        }

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new IllegalStateException("Only pending leave requests can be cancelled");
        }

        // Check if the start date is still in the future
        long tomorrowTimestamp = System.currentTimeMillis() + (24 * 60 * 60 * 1000); // Add 24 hours
        if (leaveRequest.getStartDate() < tomorrowTimestamp) {
            throw new IllegalStateException("Cannot cancel leave request that starts today or in the past");
        }

        leaveRequestRepository.delete(leaveRequest);
    }

    /**
     * Get leave balance summary for user
     */
    @Transactional(readOnly = true)
    public LeaveBalanceSummary getLeaveBalanceSummary(Long userId, int year) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        LeaveBalanceSummary summary = new LeaveBalanceSummary();

        // Calculate used days for each category
        Double annualUsed = getTotalLeaveDaysUsed(userId, LeaveCategory.ANNUAL, year);
        Double sickUsed = getTotalLeaveDaysUsed(userId, LeaveCategory.SICK, year);
        Double privateUsed = getTotalLeaveDaysUsed(userId, LeaveCategory.PRIVATE, year);
        Double specialUsed = getTotalLeaveDaysUsed(userId, LeaveCategory.SPECIAL_HOLIDAY, year);

        summary.setAnnualLeaveUsed(annualUsed);
        summary.setSickLeaveUsed(sickUsed);
        summary.setPrivateLeaveUsed(privateUsed);
        summary.setSpecialHolidayUsed(specialUsed);

        // Set allocated amounts (these could be configurable)
        summary.setAnnualLeaveAllocated(21.0);
        summary.setSickLeaveAllocated(14.0);
        summary.setPrivateLeaveAllocated(5.0);

        return summary;
    }

    // Inner class for leave balance summary
    public static class LeaveBalanceSummary {
        private Double annualLeaveAllocated;
        private Double annualLeaveUsed;
        private Double sickLeaveAllocated;
        private Double sickLeaveUsed;
        private Double privateLeaveAllocated;
        private Double privateLeaveUsed;
        private Double specialHolidayUsed;

        // Getters and setters
        public Double getAnnualLeaveAllocated() {
            return annualLeaveAllocated;
        }

        public void setAnnualLeaveAllocated(Double annualLeaveAllocated) {
            this.annualLeaveAllocated = annualLeaveAllocated;
        }

        public Double getAnnualLeaveUsed() {
            return annualLeaveUsed;
        }

        public void setAnnualLeaveUsed(Double annualLeaveUsed) {
            this.annualLeaveUsed = annualLeaveUsed;
        }

        public Double getAnnualLeaveRemaining() {
            return annualLeaveAllocated != null && annualLeaveUsed != null ? annualLeaveAllocated - annualLeaveUsed
                    : 0.0;
        }

        public Double getSickLeaveAllocated() {
            return sickLeaveAllocated;
        }

        public void setSickLeaveAllocated(Double sickLeaveAllocated) {
            this.sickLeaveAllocated = sickLeaveAllocated;
        }

        public Double getSickLeaveUsed() {
            return sickLeaveUsed;
        }

        public void setSickLeaveUsed(Double sickLeaveUsed) {
            this.sickLeaveUsed = sickLeaveUsed;
        }

        public Double getSickLeaveRemaining() {
            return sickLeaveAllocated != null && sickLeaveUsed != null ? sickLeaveAllocated - sickLeaveUsed : 0.0;
        }

        public Double getPrivateLeaveAllocated() {
            return privateLeaveAllocated;
        }

        public void setPrivateLeaveAllocated(Double privateLeaveAllocated) {
            this.privateLeaveAllocated = privateLeaveAllocated;
        }

        public Double getPrivateLeaveUsed() {
            return privateLeaveUsed;
        }

        public void setPrivateLeaveUsed(Double privateLeaveUsed) {
            this.privateLeaveUsed = privateLeaveUsed;
        }

        public Double getPrivateLeaveRemaining() {
            return privateLeaveAllocated != null && privateLeaveUsed != null ? privateLeaveAllocated - privateLeaveUsed
                    : 0.0;
        }

        public Double getSpecialHolidayUsed() {
            return specialHolidayUsed;
        }

        public void setSpecialHolidayUsed(Double specialHolidayUsed) {
            this.specialHolidayUsed = specialHolidayUsed;
        }
    }
}
