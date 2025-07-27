package com.example.lazyhr.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "leave_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;
    
    @Column(name = "leave_category", nullable = false)
    @Enumerated(EnumType.STRING)
    private LeaveCategory leaveCategory;
    
    @Column(name = "start_date", nullable = false)
    private Long startDate; // Unix timestamp in milliseconds
    
    @Column(name = "end_date", nullable = false)
    private Long endDate; // Unix timestamp in milliseconds
    
    @Column(name = "leave_period", nullable = false)
    @Enumerated(EnumType.STRING)
    private LeavePeriod leavePeriod;
    
    @Column(name = "total_days", nullable = false, precision = 3, scale = 1)
    private BigDecimal totalDays;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeaveStatus status = LeaveStatus.PENDING;
    
    @Column(name = "applied_date")
    private Long appliedDate; // Unix timestamp in milliseconds
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;
    
    @Column(name = "approved_date")
    private Long approvedDate; // Unix timestamp in milliseconds
    
    @Column(columnDefinition = "TEXT")
    private String comments;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private Long createdAt; // Unix timestamp in milliseconds
    
    @Column(name = "updated_at")
    private Long updatedAt; // Unix timestamp in milliseconds
    
    // Helper methods
    public void calculateTotalDays() {
        if (startDate != null && endDate != null) {
            // Convert timestamps to LocalDate for calculation
            LocalDate start = Instant.ofEpochMilli(startDate).atZone(ZoneId.systemDefault()).toLocalDate();
            LocalDate end = Instant.ofEpochMilli(endDate).atZone(ZoneId.systemDefault()).toLocalDate();
            
            long daysBetween = ChronoUnit.DAYS.between(start, end) + 1;
            
            if (leavePeriod == LeavePeriod.FULL_DAY) {
                this.totalDays = BigDecimal.valueOf(daysBetween);
            } else {
                // AM or PM is half day
                this.totalDays = BigDecimal.valueOf(daysBetween * 0.5);
            }
        }
    }
    
    public boolean isPending() {
        return status == LeaveStatus.PENDING;
    }
    
    public boolean isApproved() {
        return status == LeaveStatus.APPROVED;
    }
    
    public boolean isRejected() {
        return status == LeaveStatus.REJECTED;
    }
    
    public String getFormattedDateRange() {
        if (startDate != null && endDate != null) {
            LocalDate start = Instant.ofEpochMilli(startDate).atZone(ZoneId.systemDefault()).toLocalDate();
            LocalDate end = Instant.ofEpochMilli(endDate).atZone(ZoneId.systemDefault()).toLocalDate();
            
            if (start.equals(end)) {
                return start.toString() + " (" + leavePeriod + ")";
            } else {
                return start + " to " + end + " (" + leavePeriod + ")";
            }
        }
        return "N/A";
    }
    
    public String getStatusBadgeClass() {
        switch (status) {
            case PENDING: return "badge-warning";
            case APPROVED: return "badge-success";
            case REJECTED: return "badge-danger";
            default: return "badge-secondary";
        }
    }
    
    // JPA lifecycle methods for timestamp handling
    @PrePersist
    protected void onCreate() {
        long now = System.currentTimeMillis();
        createdAt = now;
        updatedAt = now;
        if (appliedDate == null) {
            appliedDate = now;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = System.currentTimeMillis();
    }
}
