package com.example.lazyhr.controller.web;

import com.example.lazyhr.constants.ApiMessages;
import com.example.lazyhr.model.User;
import com.example.lazyhr.model.Attendance;
import com.example.lazyhr.model.LeaveRequest;
import com.example.lazyhr.service.UserService;
import com.example.lazyhr.service.AttendanceService;
import com.example.lazyhr.service.LeaveService;
import com.example.lazyhr.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/")
public class DashboardController {

    @Autowired
    private UserService userService;

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private LeaveService leaveService;

    @Autowired
    private AttendanceRepository attendanceRepository;

    /**
     * Get the current authenticated user
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String username = authentication.getName();
            if (!"anonymousUser".equals(username)) {
                return userService.findByUsername(username);
            }
        }
        return null;
    }

    /**
     * Dashboard home page
     */
    @GetMapping({ "", "/", "/dashboard" })
    public String dashboard(Model model) {
        try {
            // Get current authenticated user
            User currentUser = getCurrentUser();
            if (currentUser != null) {
                model.addAttribute("user", currentUser);

                // Get today's attendance
                Optional<Attendance> todayAttendance = attendanceService.getTodayAttendance(currentUser.getId());
                model.addAttribute("todayAttendance", todayAttendance.orElse(null));

                // Check if user is clocked in
                boolean isClockedIn = false;
                try {
                    isClockedIn = attendanceService.isUserClockedIn(currentUser.getId());
                } catch (Exception e) {
                    // If there's an error checking clock-in status, default to false
                    isClockedIn = false;
                }
                model.addAttribute("isClockedIn", isClockedIn);

                // Get recent attendance (last 7 days)
                LocalDate oneWeekAgo = LocalDate.now().minusDays(7);
                List<Attendance> recentAttendance = attendanceService.getAttendanceByUser(
                        currentUser.getId(), oneWeekAgo, LocalDate.now());
                model.addAttribute("recentAttendance", recentAttendance);

                // Get recent leave requests
                List<LeaveRequest> recentLeaves = leaveService.getUserLeaveRequests(currentUser.getId());
                if (recentLeaves.size() > 5) {
                    recentLeaves = recentLeaves.subList(0, 5);
                }
                model.addAttribute("recentLeaves", recentLeaves);

                // Get leave balance
                LeaveService.LeaveBalanceSummary leaveBalance = leaveService.getLeaveBalanceSummary(
                        currentUser.getId(), LocalDate.now().getYear());
                model.addAttribute("leaveBalance", leaveBalance);

                // Get pending leave requests count (for managers/admins)
                if (currentUser.getRole().name().equals("ADMIN") || currentUser.getRole().name().equals("MANAGER")) {
                    long pendingCount = leaveService.getPendingLeaveRequestsCount();
                    model.addAttribute("pendingLeaveCount", pendingCount);
                }
            }
        } catch (Exception e) {
            model.addAttribute(ApiMessages.ERROR, ApiMessages.ERROR_LOADING_DASHBOARD + e.getMessage());
        }

        return "dashboard";
    }

    /**
     * Attendance page
     */
    @GetMapping("/attendance")
    public String attendance(Model model, Principal principal, HttpServletResponse response) {
        // Prevent caching
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);

        User user = userService.findByUsername(principal.getName());

        // Monthly attendance (current month)
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endOfMonth = now;

        List<Attendance> monthlyAttendance = attendanceService.getAttendanceByUser(user.getId(), startOfMonth,
                endOfMonth);

        // Today's attendance
        Optional<Attendance> todayAttendance = attendanceService.getTodayAttendance(user.getId());
        List<Attendance> todayAllAttendances = attendanceService.getAllTodayAttendances(user.getId());

        // Active attendance (clocked in but not out)
        List<Attendance> activeAttendances = attendanceRepository.findActiveAttendances(user.getId());
        Attendance activeAttendance = activeAttendances.isEmpty() ? null : activeAttendances.get(0);

        // Set attributes expected by template
        model.addAttribute("user", user);
        model.addAttribute("hasUser", user != null);
        model.addAttribute("monthlyAttendance", monthlyAttendance);
        model.addAttribute("todayAttendance", todayAttendance.orElse(null));
        model.addAttribute("todayAttendances", todayAllAttendances); // Template expects this name
        model.addAttribute("activeAttendance", activeAttendance); // Template expects this name
        model.addAttribute("hasActiveAttendance", !activeAttendances.isEmpty());
        model.addAttribute("isClockedIn", !activeAttendances.isEmpty()); // Template expects this name
        model.addAttribute("timestamp", System.currentTimeMillis()); // For cache busting

        return "attendance";
    }

    /**
     * Leave management page
     */
    @GetMapping("/leave")
    public String leave(Model model) {
        try {
            // Get current authenticated user
            User currentUser = getCurrentUser();
            if (currentUser != null) {
                model.addAttribute("user", currentUser);

                // Get user's leave requests
                List<LeaveRequest> userLeaves = leaveService.getUserLeaveRequests(currentUser.getId());
                model.addAttribute("leaveRequests", userLeaves); // Changed from userLeaves to leaveRequests

                // Get leave balance
                LeaveService.LeaveBalanceSummary leaveBalance = leaveService.getLeaveBalanceSummary(
                        currentUser.getId(), LocalDate.now().getYear());
                model.addAttribute("leaveBalance", leaveBalance);

                // If user is manager/admin, get pending requests
                if (currentUser.getRole().name().equals("ADMIN") || currentUser.getRole().name().equals("MANAGER")) {
                    List<LeaveRequest> pendingLeaves = leaveService.getPendingLeaveRequests();
                    model.addAttribute("pendingLeaves", pendingLeaves);
                }
            }
        } catch (Exception e) {
            model.addAttribute(ApiMessages.ERROR, ApiMessages.ERROR_LOADING_LEAVE_PAGE + e.getMessage());
        }

        return "leave";
    }

    /**
     * User management page (Admin only)
     */
    @GetMapping("/users")
    public String users(Model model) {
        try {
            // Get current authenticated user
            User currentUser = getCurrentUser();
            if (currentUser != null) {
                model.addAttribute("user", currentUser);

                // Get all users
                List<User> allUsers = userService.getAllUsers();
                model.addAttribute("users", allUsers);

                // Add user statistics
                long totalUsers = allUsers.size();
                long activeUsers = allUsers.stream().mapToLong(u -> u.isActive() ? 1 : 0).sum();
                long adminCount = allUsers.stream().mapToLong(u -> "ADMIN".equals(u.getRole().name()) ? 1 : 0).sum();
                long managerCount = allUsers.stream().mapToLong(u -> "MANAGER".equals(u.getRole().name()) ? 1 : 0)
                        .sum();

                model.addAttribute("totalUsers", totalUsers);
                model.addAttribute("activeUsers", activeUsers);
                model.addAttribute("adminCount", adminCount);
                model.addAttribute("managerCount", managerCount);
            }
        } catch (Exception e) {
            model.addAttribute(ApiMessages.ERROR, ApiMessages.ERROR_LOADING_USERS + e.getMessage());
        }

        return "users";
    }

    /**
     * Reports page
     */
    @GetMapping("/reports")
    public String reports(Model model) {
        try {
            // Get current authenticated user
            User currentUser = getCurrentUser();
            if (currentUser != null) {
                model.addAttribute("user", currentUser);

                // Get today's attendance summary
                List<Attendance> todayAttendances = attendanceService.getTodayAttendances();
                model.addAttribute("todayAttendances", todayAttendances);

                // Get today's attendance count
                long todayCount = attendanceService.getTodayAttendanceCount();
                model.addAttribute("todayAttendanceCount", todayCount);

                // Get pending leave requests
                List<LeaveRequest> pendingLeaves = leaveService.getPendingLeaveRequests();
                model.addAttribute("pendingLeaves", pendingLeaves);
            }
        } catch (Exception e) {
            model.addAttribute(ApiMessages.ERROR, ApiMessages.ERROR_LOADING_REPORTS + e.getMessage());
        }

        return "reports";
    }

    /**
     * Login page
     */
    @GetMapping("/login")
    public String login() {
        return "login";
    }

    /**
     * Error page
     */
    @GetMapping("/error")
    public String error(Model model) {
        model.addAttribute("errorMessage", ApiMessages.AN_ERROR_OCCURRED);
        return ApiMessages.ERROR;
    }
}
