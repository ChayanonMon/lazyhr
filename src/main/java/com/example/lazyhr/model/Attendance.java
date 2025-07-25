package com.example.lazyhr.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;
    
    @Column(name = "attendance_date", nullable = false)
    private Long attendanceDate; // Unix timestamp in milliseconds
    
    @Column(name = "clock_in_time")
    private Long clockInTime; // Unix timestamp in milliseconds
    
    @Column(name = "clock_out_time")
    private Long clockOutTime; // Unix timestamp in milliseconds
    
    @Column(name = "break_duration_minutes")
    private Integer breakDurationMinutes = 0;
    
    @Column(name = "total_hours", precision = 4, scale = 2)
    private BigDecimal totalHours;
    
    @Column(name = "overtime_hours", precision = 4, scale = 2)
    private BigDecimal overtimeHours = BigDecimal.ZERO;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceStatus status = AttendanceStatus.PRESENT;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Helper methods
    public boolean isClockedIn() {
        return clockInTime != null && clockOutTime == null;
    }
    
    public boolean isClockedOut() {
        return clockInTime != null && clockOutTime != null;
    }
    
    public void calculateTotalHours() {
        if (clockInTime != null && clockOutTime != null) {
            long durationMillis = clockOutTime - clockInTime;
            long totalMinutes = (durationMillis / (1000 * 60)) - (breakDurationMinutes != null ? breakDurationMinutes : 0);
            this.totalHours = BigDecimal.valueOf(totalMinutes)
                    .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
            
            // Calculate overtime (assuming 8 hours is standard work day)
            BigDecimal standardHours = BigDecimal.valueOf(8);
            if (this.totalHours.compareTo(standardHours) > 0) {
                this.overtimeHours = this.totalHours.subtract(standardHours);
            } else {
                this.overtimeHours = BigDecimal.ZERO;
            }
        }
    }
    
    public String getFormattedWorkingHours() {
        if (totalHours != null) {
            return totalHours + " hours";
        }
        return "N/A";
    }
}
