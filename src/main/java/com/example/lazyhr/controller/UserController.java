package com.example.lazyhr.controller;

import com.example.lazyhr.model.User;
import com.example.lazyhr.model.Role;
import com.example.lazyhr.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Create new user
     */
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserDto userDto) {
        try {
            // Convert DTO to entity
            User user = new User();
            user.setUsername(userDto.getUsername());
            user.setPassword(userDto.getPassword());
            user.setEmail(userDto.getEmail());
            
            // Optional fields - only set if provided
            if (userDto.getFirstName() != null && !userDto.getFirstName().trim().isEmpty()) {
                user.setFirstName(userDto.getFirstName());
            }
            if (userDto.getLastName() != null && !userDto.getLastName().trim().isEmpty()) {
                user.setLastName(userDto.getLastName());
            }
            if (userDto.getDepartment() != null && !userDto.getDepartment().trim().isEmpty()) {
                user.setDepartment(userDto.getDepartment());
            }
            if (userDto.getPosition() != null && !userDto.getPosition().trim().isEmpty()) {
                user.setPosition(userDto.getPosition());
            }
            if (userDto.getHireDate() != null) {
                user.setHireDate(userDto.getHireDate());
            }
            if (userDto.getSalary() != null) {
                user.setSalary(userDto.getSalary());
            }
            
            user.setEmployeeId(userDto.getEmployeeId());
            user.setRole(userDto.getRole() != null ? userDto.getRole() : Role.EMPLOYEE);

            User savedUser = userService.createUser(user);
            return ResponseEntity.ok(new ApiResponse("success", "User created successfully", savedUser));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to create user: " + e.getMessage(), null));
        }
    }

    /**
     * Get all active users
     */
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getAllActiveUsers();
            return ResponseEntity.ok(new ApiResponse("success", "Users retrieved successfully", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to fetch users: " + e.getMessage(), null));
        }
    }

    /**
     * Get user by ID
     */
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        try {
            User user = userService.findById(userId);
            return ResponseEntity.ok(new ApiResponse("success", "User retrieved successfully", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to fetch user: " + e.getMessage(), null));
        }
    }

    /**
     * Get user by username
     */
    @GetMapping("/username/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        try {
            User user = userService.findByUsername(username);
            return ResponseEntity.ok(new ApiResponse("success", "User retrieved successfully", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to fetch user: " + e.getMessage(), null));
        }
    }

    /**
     * Update user
     */
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody UserDto userDto) {
        try {
            User user = userService.findById(userId);

            // Update optional fields - only if provided and not empty
            if (userDto.getFirstName() != null && !userDto.getFirstName().trim().isEmpty()) {
                user.setFirstName(userDto.getFirstName());
            }
            if (userDto.getLastName() != null && !userDto.getLastName().trim().isEmpty()) {
                user.setLastName(userDto.getLastName());
            }
            if (userDto.getEmail() != null && !userDto.getEmail().trim().isEmpty()) {
                user.setEmail(userDto.getEmail());
            }
            if (userDto.getDepartment() != null && !userDto.getDepartment().trim().isEmpty()) {
                user.setDepartment(userDto.getDepartment());
            }
            if (userDto.getPosition() != null && !userDto.getPosition().trim().isEmpty()) {
                user.setPosition(userDto.getPosition());
            }
            if (userDto.getHireDate() != null) {
                user.setHireDate(userDto.getHireDate());
            }
            if (userDto.getSalary() != null) {
                user.setSalary(userDto.getSalary());
            }
            if (userDto.getRole() != null) {
                user.setRole(userDto.getRole());
            }
            if (userDto.getIsActive() != null) {
                user.setActive(userDto.getIsActive());
            }

            User updatedUser = userService.updateUser(user);
            return ResponseEntity.ok(new ApiResponse("success", "User updated successfully", updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to update user: " + e.getMessage(), null));
        }
    }

    /**
     * Deactivate user
     */
    @PostMapping("/{userId}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable Long userId) {
        try {
            userService.deactivateUser(userId);
            return ResponseEntity.ok(new ApiResponse("success", "User deactivated successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to deactivate user: " + e.getMessage(), null));
        }
    }

    /**
     * Activate user
     */
    @PostMapping("/{userId}/activate")
    public ResponseEntity<?> activateUser(@PathVariable Long userId) {
        try {
            userService.activateUser(userId);
            return ResponseEntity.ok(new ApiResponse("success", "User activated successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to activate user: " + e.getMessage(), null));
        }
    }

    /**
     * Search users
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String query) {
        try {
            List<User> users = userService.searchUsers(query);
            return ResponseEntity.ok(new ApiResponse("success", "Search results retrieved", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to search users: " + e.getMessage(), null));
        }
    }

    /**
     * Get users by department
     */
    @GetMapping("/department/{department}")
    public ResponseEntity<?> getUsersByDepartment(@PathVariable String department) {
        try {
            List<User> users = userService.getUsersByDepartment(department);
            return ResponseEntity.ok(new ApiResponse("success", "Users by department retrieved", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to fetch users by department: " + e.getMessage(), null));
        }
    }

    /**
     * Get users by role
     */
    @GetMapping("/role/{role}")
    public ResponseEntity<?> getUsersByRole(@PathVariable Role role) {
        try {
            List<User> users = userService.getUsersByRole(role);
            return ResponseEntity.ok(new ApiResponse("success", "Users by role retrieved", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to fetch users by role: " + e.getMessage(), null));
        }
    }

    /**
     * Update user password
     */
    @PostMapping("/{userId}/password")
    public ResponseEntity<?> updatePassword(@PathVariable Long userId, @RequestBody PasswordUpdateDto passwordDto) {
        try {
            userService.updatePassword(userId, passwordDto.getNewPassword());
            return ResponseEntity.ok(new ApiResponse("success", "Password updated successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to update password: " + e.getMessage(), null));
        }
    }

    /**
     * Check username availability
     */
    @GetMapping("/check-username/{username}")
    public ResponseEntity<?> checkUsernameAvailability(@PathVariable String username) {
        try {
            boolean available = userService.isUsernameAvailable(username);
            return ResponseEntity.ok(new ApiResponse("success", "Username availability checked", available));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to check username: " + e.getMessage(), null));
        }
    }

    /**
     * Check email availability
     */
    @GetMapping("/check-email/{email}")
    public ResponseEntity<?> checkEmailAvailability(@PathVariable String email) {
        try {
            boolean available = userService.isEmailAvailable(email);
            return ResponseEntity.ok(new ApiResponse("success", "Email availability checked", available));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to check email: " + e.getMessage(), null));
        }
    }

    /**
     * Get user statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats() {
        try {
            UserStats stats = new UserStats();
            stats.setTotalActiveUsers(userService.getActiveUserCount());
            stats.setAdminCount(userService.getActiveUserCountByRole(Role.ADMIN));
            stats.setManagerCount(userService.getActiveUserCountByRole(Role.MANAGER));
            stats.setEmployeeCount(userService.getActiveUserCountByRole(Role.EMPLOYEE));

            return ResponseEntity.ok(new ApiResponse("success", "User statistics retrieved", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("error", "Failed to fetch user stats: " + e.getMessage(), null));
        }
    }

    // Inner classes for DTOs and responses
    public static class UserDto {
        private String username;
        private String password;
        private String email;
        private String firstName;
        private String lastName;
        private String employeeId;
        private String department;
        private String position;
        private Long hireDate; // Unix timestamp in milliseconds
        private java.math.BigDecimal salary;
        private Role role;

        // Getters and setters
        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(String employeeId) {
            this.employeeId = employeeId;
        }

        public String getDepartment() {
            return department;
        }

        public void setDepartment(String department) {
            this.department = department;
        }

        public String getPosition() {
            return position;
        }

        public void setPosition(String position) {
            this.position = position;
        }

        public Long getHireDate() {
            return hireDate;
        }

        public void setHireDate(Long hireDate) {
            this.hireDate = hireDate;
        }

        public java.math.BigDecimal getSalary() {
            return salary;
        }

        public void setSalary(java.math.BigDecimal salary) {
            this.salary = salary;
        }

        public Role getRole() {
            return role;
        }

        public void setRole(Role role) {
            this.role = role;
        }

        private Boolean isActive;

        public Boolean getIsActive() {
            return isActive;
        }

        public void setIsActive(Boolean isActive) {
            this.isActive = isActive;
        }
    }

    public static class PasswordUpdateDto {
        private String newPassword;

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }

    public static class UserStats {
        private long totalActiveUsers;
        private long adminCount;
        private long managerCount;
        private long employeeCount;

        // Getters and setters
        public long getTotalActiveUsers() {
            return totalActiveUsers;
        }

        public void setTotalActiveUsers(long totalActiveUsers) {
            this.totalActiveUsers = totalActiveUsers;
        }

        public long getAdminCount() {
            return adminCount;
        }

        public void setAdminCount(long adminCount) {
            this.adminCount = adminCount;
        }

        public long getManagerCount() {
            return managerCount;
        }

        public void setManagerCount(long managerCount) {
            this.managerCount = managerCount;
        }

        public long getEmployeeCount() {
            return employeeCount;
        }

        public void setEmployeeCount(long employeeCount) {
            this.employeeCount = employeeCount;
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
