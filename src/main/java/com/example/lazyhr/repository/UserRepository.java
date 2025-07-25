package com.example.lazyhr.repository;

import com.example.lazyhr.model.User;
import com.example.lazyhr.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByEmployeeId(String employeeId);

    List<User> findByIsActiveTrue();

    List<User> findByIsActiveTrueOrderByFirstNameAsc();

    List<User> findByDepartment(String department);

    List<User> findByRole(Role role);

    List<User> findByDepartmentAndIsActiveTrue(String department);

    @Query("SELECT u FROM User u WHERE u.isActive = true AND " +
            "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.employeeId) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<User> searchActiveUsers(@Param("search") String search);

    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    long countActiveUsers();

    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true AND u.role = :role")
    long countActiveUsersByRole(@Param("role") Role role);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByEmployeeId(String employeeId);
}
