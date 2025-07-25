package com.example.lazyhr.repository;

import com.example.lazyhr.model.Attendance;
import com.example.lazyhr.model.User;
import com.example.lazyhr.model.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    @Query("SELECT a FROM Attendance a WHERE a.user = :user AND a.attendanceDate = :timestamp ORDER BY a.clockInTime DESC")
    List<Attendance> findByUserAndAttendanceDate(@Param("user") User user, @Param("timestamp") Long timestamp);

    @Query("SELECT a FROM Attendance a WHERE a.user = :user AND a.attendanceDate = :timestamp ORDER BY a.clockInTime DESC")
    List<Attendance> findAllByUserAndAttendanceDate(@Param("user") User user, @Param("timestamp") Long timestamp);

    @Query("SELECT a FROM Attendance a WHERE a.user = :user AND a.attendanceDate >= :startTimestamp AND a.attendanceDate <= :endTimestamp ORDER BY a.attendanceDate DESC")
    List<Attendance> findByUserAndAttendanceDateBetween(@Param("user") User user,
            @Param("startTimestamp") Long startTimestamp, @Param("endTimestamp") Long endTimestamp);

    @Query("SELECT a FROM Attendance a WHERE a.attendanceDate >= :startTimestamp AND a.attendanceDate <= :endTimestamp ORDER BY a.attendanceDate DESC")
    List<Attendance> findByAttendanceDateBetween(@Param("startTimestamp") Long startTimestamp,
            @Param("endTimestamp") Long endTimestamp);

    List<Attendance> findByUserOrderByAttendanceDateDesc(User user);

    @Query("SELECT a FROM Attendance a WHERE a.attendanceDate = :timestamp ORDER BY a.createdAt DESC")
    List<Attendance> findByAttendanceDateOrderByCreatedAtDesc(@Param("timestamp") Long timestamp);

    @Query("SELECT a FROM Attendance a WHERE a.user.id = :userId AND a.clockOutTime IS NULL ORDER BY a.clockInTime DESC")
    List<Attendance> findActiveAttendances(@Param("userId") Long userId);

    @Query("SELECT a FROM Attendance a WHERE a.attendanceDate = :timestamp AND a.clockOutTime IS NULL")
    List<Attendance> findActiveClockedInAttendances(@Param("timestamp") Long timestamp);

    @Query("SELECT a FROM Attendance a WHERE a.user = :user AND a.attendanceDate >= :startTimestamp AND a.attendanceDate <= :endTimestamp ORDER BY a.attendanceDate DESC")
    List<Attendance> findByUserAndDateRange(@Param("user") User user,
            @Param("startTimestamp") Long startTimestamp,
            @Param("endTimestamp") Long endTimestamp);

    // Timestamp-based query for Unix timestamp fields
    @Query("SELECT a FROM Attendance a WHERE a.user = :user AND a.attendanceDate >= :startTimestamp AND a.attendanceDate <= :endTimestamp ORDER BY a.attendanceDate DESC")
    List<Attendance> findByUserAndTimestampRange(@Param("user") User user,
            @Param("startTimestamp") Long startTimestamp,
            @Param("endTimestamp") Long endTimestamp);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.user = :user AND a.attendanceDate >= :startTimestamp AND a.attendanceDate <= :endTimestamp AND a.status = :status")
    long countByUserAndDateRangeAndStatus(@Param("user") User user,
            @Param("startTimestamp") Long startTimestamp,
            @Param("endTimestamp") Long endTimestamp,
            @Param("status") AttendanceStatus status);

    @Query("SELECT a FROM Attendance a WHERE a.attendanceDate = :timestamp AND a.user.isActive = true ORDER BY a.clockInTime DESC")
    List<Attendance> findTodayAttendances(@Param("timestamp") Long timestamp);

    @Query("SELECT a FROM Attendance a WHERE a.user.department = :department AND a.attendanceDate >= :startTimestamp AND a.attendanceDate <= :endTimestamp")
    List<Attendance> findByDepartmentAndDateRange(@Param("department") String department,
            @Param("startTimestamp") Long startTimestamp,
            @Param("endTimestamp") Long endTimestamp);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.attendanceDate = :timestamp AND a.clockInTime IS NOT NULL")
    long countClockedInToday(@Param("timestamp") Long timestamp);

    @Query("SELECT SUM(a.overtimeHours) FROM Attendance a WHERE a.user = :user AND a.attendanceDate >= :startTimestamp AND a.attendanceDate <= :endTimestamp")
    Double getTotalOvertimeHours(@Param("user") User user,
            @Param("startTimestamp") Long startTimestamp,
            @Param("endTimestamp") Long endTimestamp);
}
