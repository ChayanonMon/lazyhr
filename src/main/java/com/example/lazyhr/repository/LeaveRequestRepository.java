package com.example.lazyhr.repository;

import com.example.lazyhr.model.LeaveRequest;
import com.example.lazyhr.model.User;
import com.example.lazyhr.model.LeaveStatus;
import com.example.lazyhr.model.LeaveCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByUserOrderByAppliedDateDesc(User user);

    List<LeaveRequest> findByStatusOrderByAppliedDateDesc(LeaveStatus status);

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.user = :user AND lr.startDate >= :startTimestamp AND lr.startDate <= :endTimestamp ORDER BY lr.appliedDate DESC")
    List<LeaveRequest> findByUserAndStartDateBetween(@Param("user") User user,
            @Param("startTimestamp") Long startTimestamp, @Param("endTimestamp") Long endTimestamp);

    List<LeaveRequest> findByUserAndStatusOrderByAppliedDateDesc(User user, LeaveStatus status);

    List<LeaveRequest> findByLeaveCategoryAndStatusOrderByAppliedDateDesc(LeaveCategory category, LeaveStatus status);

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.startDate <= :endTimestamp AND lr.endDate >= :startTimestamp AND lr.user = :user AND lr.status = 'APPROVED'")
    List<LeaveRequest> findOverlappingLeaves(@Param("user") User user,
            @Param("startTimestamp") Long startTimestamp,
            @Param("endTimestamp") Long endTimestamp);

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.status = 'PENDING' ORDER BY lr.appliedDate ASC")
    List<LeaveRequest> findPendingLeaveRequests();

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.user.department = :department AND lr.status = :status ORDER BY lr.appliedDate DESC")
    List<LeaveRequest> findByDepartmentAndStatus(@Param("department") String department,
            @Param("status") LeaveStatus status);

    @Query("SELECT COUNT(lr) FROM LeaveRequest lr WHERE lr.user = :user AND lr.leaveCategory = :category AND lr.status = 'APPROVED' AND lr.startDate >= :yearStartTimestamp AND lr.startDate < :yearEndTimestamp")
    long countApprovedLeavesByUserAndCategoryAndYear(@Param("user") User user,
            @Param("category") LeaveCategory category,
            @Param("yearStartTimestamp") Long yearStartTimestamp,
            @Param("yearEndTimestamp") Long yearEndTimestamp);

    @Query("SELECT SUM(lr.totalDays) FROM LeaveRequest lr WHERE lr.user = :user AND lr.leaveCategory = :category AND lr.status = 'APPROVED' AND lr.startDate >= :yearStartTimestamp AND lr.startDate < :yearEndTimestamp")
    Double getTotalLeaveDaysByUserAndCategoryAndYear(@Param("user") User user,
            @Param("category") LeaveCategory category,
            @Param("yearStartTimestamp") Long yearStartTimestamp,
            @Param("yearEndTimestamp") Long yearEndTimestamp);

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.startDate = :timestamp OR (lr.startDate <= :timestamp AND lr.endDate >= :timestamp)")
    List<LeaveRequest> findLeaveRequestsForDate(@Param("timestamp") Long timestamp);

    // Timestamp-based queries for Unix timestamp fields
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.startDate <= :endTimestamp AND lr.endDate >= :startTimestamp AND lr.user = :user AND lr.status = 'APPROVED'")
    List<LeaveRequest> findOverlappingLeavesTimestamp(@Param("user") User user,
            @Param("startTimestamp") Long startTimestamp,
            @Param("endTimestamp") Long endTimestamp);

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.startDate = :timestamp OR (lr.startDate <= :timestamp AND lr.endDate >= :timestamp)")
    List<LeaveRequest> findLeaveRequestsForTimestamp(@Param("timestamp") Long timestamp);

    @Query("SELECT COUNT(lr) FROM LeaveRequest lr WHERE lr.status = 'PENDING'")
    long countPendingLeaveRequests();

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.user.id IN :userIds AND lr.status = :status ORDER BY lr.appliedDate DESC")
    List<LeaveRequest> findByUserIdsAndStatus(@Param("userIds") List<Long> userIds,
            @Param("status") LeaveStatus status);
}
