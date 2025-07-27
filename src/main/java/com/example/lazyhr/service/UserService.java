package com.example.lazyhr.service;

import com.example.lazyhr.model.User;
import com.example.lazyhr.model.Role;
import com.example.lazyhr.repository.UserRepository;
import com.example.lazyhr.constants.ApiMessages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Create a new user with encoded password
     */
    public User createUser(User user) {
        // Check if username, email, or employee ID already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException(ApiMessages.USERNAME_ALREADY_EXISTS + user.getUsername());
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException(ApiMessages.EMAIL_ALREADY_EXISTS + user.getEmail());
        }
        if (userRepository.existsByEmployeeId(user.getEmployeeId())) {
            throw new IllegalArgumentException(ApiMessages.EMPLOYEE_ID_ALREADY_EXISTS + user.getEmployeeId());
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Set default role if not specified
        if (user.getRole() == null) {
            user.setRole(Role.EMPLOYEE);
        }

        return userRepository.save(user);
    }

    /**
     * Find user by username
     */
    @Transactional(readOnly = true)
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException(ApiMessages.USER_NOT_FOUND_WITH_USERNAME + username));
    }

    /**
     * Find user by ID
     */
    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(ApiMessages.USER_NOT_FOUND_WITH_ID + id));
    }

    /**
     * Find user by employee ID
     */
    @Transactional(readOnly = true)
    public Optional<User> findByEmployeeId(String employeeId) {
        return userRepository.findByEmployeeId(employeeId);
    }

    /**
     * Get all active users
     */
    @Transactional(readOnly = true)
    public List<User> getAllActiveUsers() {
        return userRepository.findByIsActiveTrueOrderByFirstNameAsc();
    }

    /**
     * Get all users (including inactive)
     */
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Update user information
     */
    public User updateUser(User user) {
        User existingUser = findById(user.getId());

        // Update fields
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setEmail(user.getEmail());
        existingUser.setDepartment(user.getDepartment());
        existingUser.setPosition(user.getPosition());
        existingUser.setHireDate(user.getHireDate());
        existingUser.setSalary(user.getSalary());
        existingUser.setRole(user.getRole());

        return userRepository.save(existingUser);
    }

    /**
     * Update user password
     */
    public void updatePassword(Long userId, String newPassword) {
        User user = findById(userId);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /**
     * Deactivate user
     */
    public void deactivateUser(Long userId) {
        User user = findById(userId);
        user.setActive(false);
        userRepository.save(user);
    }

    /**
     * Activate user
     */
    public void activateUser(Long userId) {
        User user = findById(userId);
        user.setActive(true);
        userRepository.save(user);
    }

    /**
     * Search users by name or employee ID
     */
    @Transactional(readOnly = true)
    public List<User> searchUsers(String searchTerm) {
        return userRepository.searchActiveUsers(searchTerm);
    }

    /**
     * Get users by department
     */
    @Transactional(readOnly = true)
    public List<User> getUsersByDepartment(String department) {
        return userRepository.findByDepartmentAndIsActiveTrue(department);
    }

    /**
     * Get users by role
     */
    @Transactional(readOnly = true)
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    /**
     * Get user statistics
     */
    @Transactional(readOnly = true)
    public long getActiveUserCount() {
        return userRepository.countActiveUsers();
    }

    /**
     * Get active users count by role
     */
    @Transactional(readOnly = true)
    public long getActiveUserCountByRole(Role role) {
        return userRepository.countActiveUsersByRole(role);
    }

    /**
     * Check if username is available
     */
    @Transactional(readOnly = true)
    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }

    /**
     * Check if email is available
     */
    @Transactional(readOnly = true)
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }

    /**
     * Check if employee ID is available
     */
    @Transactional(readOnly = true)
    public boolean isEmployeeIdAvailable(String employeeId) {
        return !userRepository.existsByEmployeeId(employeeId);
    }
}
