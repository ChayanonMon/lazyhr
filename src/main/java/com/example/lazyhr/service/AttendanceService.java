package com.example.lazyhr.service;

import com.example.lazyhr.model.Attendance;
import com.example.lazyhr.model.User;
import com.example.lazyhr.model.AttendanceStatus;
import com.example.lazyhr.repository.AttendanceRepository;
import com.example.lazyhr.repository.UserRepository;
import com.example.lazyhr.constants.ApiMessages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Clock in user for today
     */
    public Attendance clockIn(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ApiMessages.USER_NOT_FOUND_WITH_ID + userId));

        long currentTime = System.currentTimeMillis();
        // Get start of today in milliseconds
        LocalDate today = LocalDate.now();
        long todayTimestamp = today.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();

        // Create a new attendance record for each clock-in
        Attendance attendance = new Attendance();
        attendance.setUser(user);
        attendance.setAttendanceDate(todayTimestamp);
        attendance.setClockInTime(currentTime);
        attendance.setStatus(AttendanceStatus.PRESENT);

        return attendanceRepository.save(attendance);
    }

    /**
     * Clock out user
     */
    public Attendance clockOut(Long userId) {
        // Get the most recent active attendance record
        List<Attendance> activeAttendances = attendanceRepository.findActiveAttendances(userId);
        if (activeAttendances.isEmpty()) {
            throw new IllegalStateException(ApiMessages.NO_ACTIVE_CLOCK_IN_FOUND);
        }

        Attendance attendance = activeAttendances.get(0);
        attendance.setClockOutTime(System.currentTimeMillis());
        attendance.calculateTotalHours(); // This method calculates total and overtime hours

        return attendanceRepository.save(attendance);
    }

    /**
     * Get today's attendance for user (most recent one)
     */
    @Transactional(readOnly = true)
    public Optional<Attendance> getTodayAttendance(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ApiMessages.USER_NOT_FOUND_WITH_ID + userId));

        long todayTimestamp = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
        List<Attendance> todayAttendances = attendanceRepository.findByUserAndAttendanceDate(user, todayTimestamp);

        // Return the most recent attendance record (first in the ordered list)
        return todayAttendances.isEmpty() ? Optional.empty() : Optional.of(todayAttendances.get(0));
    }

    /**
     * Get all today's attendance records for user
     */
    @Transactional(readOnly = true)
    public List<Attendance> getAllTodayAttendances(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ApiMessages.USER_NOT_FOUND_WITH_ID + userId));

        long todayTimestamp = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
        return attendanceRepository.findAllByUserAndAttendanceDate(user, todayTimestamp);
    }

    /**
     * Get attendance by user and date range (timestamp version)
     */
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceByUserTimestamp(Long userId, Long startTimestamp, Long endTimestamp) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ApiMessages.USER_NOT_FOUND_WITH_ID + userId));

        return attendanceRepository.findByUserAndTimestampRange(user, startTimestamp, endTimestamp);
    }

    /**
     * Get attendance by user and date range (deprecated - use timestamp version)
     */
    @Transactional(readOnly = true)
    @Deprecated
    public List<Attendance> getAttendanceByUser(Long userId, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ApiMessages.USER_NOT_FOUND_WITH_ID + userId));

        long startTimestamp = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
        long endTimestamp = endDate.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
        return attendanceRepository.findByUserAndDateRange(user, startTimestamp, endTimestamp);
    }

    /**
     * Get all attendance for a specific date
     */
    @Transactional(readOnly = true)
    public List<Attendance> getTodayAttendances() {
        long todayTimestamp = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
        return attendanceRepository.findTodayAttendances(todayTimestamp);
    }

    /**
     * Get attendance by date range
     */
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceByDateRange(LocalDate startDate, LocalDate endDate) {
        long startTimestamp = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
        long endTimestamp = endDate.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
        return attendanceRepository.findByAttendanceDateBetween(startTimestamp, endTimestamp);
    }

    /**
     * Get user's attendance history
     */
    @Transactional(readOnly = true)
    public List<Attendance> getUserAttendanceHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ApiMessages.USER_NOT_FOUND_WITH_ID + userId));

        return attendanceRepository.findByUserOrderByAttendanceDateDesc(user);
    }

    /**
     * Check if user is currently clocked in
     */
    @Transactional(readOnly = true)
    public boolean isUserClockedIn(Long userId) {
        List<Attendance> activeAttendances = attendanceRepository.findActiveAttendances(userId);
        return !activeAttendances.isEmpty();
    }

    /**
     * Get active attendance for user
     */
    @Transactional(readOnly = true)
    public Optional<Attendance> getActiveAttendance(Long userId) {
        List<Attendance> activeAttendances = attendanceRepository.findActiveAttendances(userId);
        return activeAttendances.isEmpty() ? Optional.empty() : Optional.of(activeAttendances.get(0));
    }

    /**
     * Update attendance notes
     */
    public Attendance updateAttendanceNotes(Long attendanceId, String notes) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new EntityNotFoundException(ApiMessages.ATTENDANCE_RECORD_NOT_FOUND_WITH_ID + attendanceId));

        attendance.setNotes(notes);
        return attendanceRepository.save(attendance);
    }

    /**
     * Update break duration
     */
    public Attendance updateBreakDuration(Long attendanceId, Integer breakMinutes) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new EntityNotFoundException(ApiMessages.ATTENDANCE_RECORD_NOT_FOUND_WITH_ID + attendanceId));

        attendance.setBreakDurationMinutes(breakMinutes);
        if (attendance.isClockedOut()) {
            attendance.calculateTotalHours();
        }

        return attendanceRepository.save(attendance);
    }

    /**
     * Get attendance statistics
     */
    @Transactional(readOnly = true)
    public long getTodayAttendanceCount() {
        long todayTimestamp = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
        return attendanceRepository.countClockedInToday(todayTimestamp);
    }

    /**
     * Get user's total overtime hours for period
     */
    @Transactional(readOnly = true)
    public Double getUserOvertimeHours(Long userId, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException(ApiMessages.USER_NOT_FOUND_WITH_ID + userId));

        long startTimestamp = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
        long endTimestamp = endDate.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
        Double overtime = attendanceRepository.getTotalOvertimeHours(user, startTimestamp, endTimestamp);
        return overtime != null ? overtime : 0.0;
    }

    /**
     * Get attendance by department and date range
     */
    @Transactional(readOnly = true)
    public List<Attendance> getAttendanceByDepartment(String department, LocalDate startDate, LocalDate endDate) {
        long startTimestamp = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
        long endTimestamp = endDate.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
        return attendanceRepository.findByDepartmentAndDateRange(department, startTimestamp, endTimestamp);
    }

    /**
     * Mark attendance as late
     */
    public Attendance markAsLate(Long attendanceId) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new EntityNotFoundException(ApiMessages.ATTENDANCE_RECORD_NOT_FOUND_WITH_ID + attendanceId));

        attendance.setStatus(AttendanceStatus.LATE);
        return attendanceRepository.save(attendance);
    }

    /**
     * Mark attendance as half day
     */
    public Attendance markAsHalfDay(Long attendanceId) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new EntityNotFoundException(ApiMessages.ATTENDANCE_RECORD_NOT_FOUND_WITH_ID + attendanceId));

        attendance.setStatus(AttendanceStatus.HALF_DAY);
        return attendanceRepository.save(attendance);
    }
}
