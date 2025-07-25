package com.example.lazyhr.controller;

import com.example.lazyhr.model.Attendance;
import com.example.lazyhr.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    /**
     * Clock in endpoint
     */
    @PostMapping("/clock-in")
    public ResponseEntity<?> clockIn(@RequestParam Long userId) {
        try {
            Attendance attendance = attendanceService.clockIn(userId);
            // Return simplified response to avoid circular reference
            return ResponseEntity.ok(new ApiResponse("success", "Successfully clocked in",
                    Map.of("id", attendance.getId(),
                            "clockInTime", attendance.getClockInTime(),
                            "attendanceDate", attendance.getAttendanceDate())));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to clock in: " + e.getMessage(), null));
        }
    }

    /**
     * Clock out endpoint
     */
    @PostMapping("/clock-out")
    public ResponseEntity<?> clockOut(@RequestParam Long userId) {
        try {
            Attendance attendance = attendanceService.clockOut(userId);
            // Return simplified response to avoid circular reference
            return ResponseEntity.ok(new ApiResponse("success", "Successfully clocked out",
                    Map.of("id", attendance.getId(),
                            "clockOutTime", attendance.getClockOutTime(),
                            "totalHours", attendance.getTotalHours(),
                            "attendanceDate", attendance.getAttendanceDate())));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to clock out: " + e.getMessage(), null));
        }
    }

    /**
     * Get today's attendance for user
     */
    @GetMapping("/today/{userId}")
    public ResponseEntity<?> getTodayAttendance(@PathVariable Long userId) {
        try {
            Optional<Attendance> attendance = attendanceService.getTodayAttendance(userId);
            if (attendance.isPresent()) {
                return ResponseEntity.ok(new ApiResponse("success", "Today's attendance found", attendance.get()));
            } else {
                return ResponseEntity.ok(new ApiResponse("success", "No attendance record for today", null));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to fetch today's attendance: " + e.getMessage(), null));
        }
    }

    /**
     * Get user attendance by date range
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserAttendance(
            @PathVariable Long userId,
            @RequestParam Long startTimestamp,
            @RequestParam Long endTimestamp) {

        try {
            List<Attendance> attendances = attendanceService.getAttendanceByUserTimestamp(userId, startTimestamp,
                    endTimestamp);
            return ResponseEntity.ok(new ApiResponse("success", "Attendance records retrieved", attendances));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to fetch attendance: " + e.getMessage(), null));
        }
    }

    /**
     * Get all attendance for today
     */
    @GetMapping("/today")
    public ResponseEntity<?> getTodayAttendances() {
        try {
            List<Attendance> attendances = attendanceService.getTodayAttendances();
            return ResponseEntity.ok(new ApiResponse("success", "Today's attendance records", attendances));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to fetch today's attendances: " + e.getMessage(), null));
        }
    }

    /**
     * Get user's attendance history
     */
    @GetMapping("/history/{userId}")
    public ResponseEntity<?> getUserAttendanceHistory(@PathVariable Long userId) {
        try {
            List<Attendance> attendances = attendanceService.getUserAttendanceHistory(userId);
            return ResponseEntity.ok(new ApiResponse("success", "Attendance history retrieved", attendances));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to fetch attendance history: " + e.getMessage(), null));
        }
    }

    /**
     * Check if user is currently clocked in
     */
    @GetMapping("/status/{userId}")
    public ResponseEntity<?> getAttendanceStatus(@PathVariable Long userId) {
        try {
            boolean isClockedIn = attendanceService.isUserClockedIn(userId);
            Optional<Attendance> activeAttendance = attendanceService.getActiveAttendance(userId);

            AttendanceStatus status = new AttendanceStatus();
            status.setUserId(userId);
            status.setClockedIn(isClockedIn);
            status.setActiveAttendance(activeAttendance.orElse(null));

            return ResponseEntity.ok(new ApiResponse("success", "Attendance status retrieved", status));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to fetch attendance status: " + e.getMessage(), null));
        }
    }

    /**
     * Update attendance notes
     */
    @PutMapping("/{attendanceId}/notes")
    public ResponseEntity<?> updateAttendanceNotes(@PathVariable Long attendanceId, @RequestBody String notes) {
        try {
            Attendance attendance = attendanceService.updateAttendanceNotes(attendanceId, notes);
            return ResponseEntity.ok(new ApiResponse("success", "Notes updated successfully", attendance));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to update notes: " + e.getMessage(), null));
        }
    }

    /**
     * Update break duration
     */
    @PutMapping("/{attendanceId}/break")
    public ResponseEntity<?> updateBreakDuration(@PathVariable Long attendanceId, @RequestParam Integer breakMinutes) {
        try {
            Attendance attendance = attendanceService.updateBreakDuration(attendanceId, breakMinutes);
            return ResponseEntity.ok(new ApiResponse("success", "Break duration updated successfully", attendance));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to update break duration: " + e.getMessage(), null));
        }
    }

    /**
     * Get attendance statistics
     */
    @GetMapping("/stats/today")
    public ResponseEntity<?> getTodayStats() {
        try {
            long todayCount = attendanceService.getTodayAttendanceCount();
            return ResponseEntity.ok(new ApiResponse("success", "Today's attendance count", todayCount));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to fetch stats: " + e.getMessage(), null));
        }
    }

    // Inner classes for response structure
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

    public static class AttendanceStatus {
        private Long userId;
        private boolean isClockedIn;
        private Attendance activeAttendance;

        // Getters and setters
        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public boolean isClockedIn() {
            return isClockedIn;
        }

        public void setClockedIn(boolean clockedIn) {
            isClockedIn = clockedIn;
        }

        public Attendance getActiveAttendance() {
            return activeAttendance;
        }

        public void setActiveAttendance(Attendance activeAttendance) {
            this.activeAttendance = activeAttendance;
        }
    }
}
