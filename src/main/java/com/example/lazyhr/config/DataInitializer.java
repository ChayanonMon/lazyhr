package com.example.lazyhr.config;

import com.example.lazyhr.model.*;
import com.example.lazyhr.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {
        // Check if users already exist
        if (userService.getActiveUserCount() == 0) {
            initializeUsers();
        }
    }

    private void initializeUsers() {
        try {
            // Create Admin User
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setEmail("admin@lazyhr.com");
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setEmployeeId("EMP001");
            admin.setDepartment("IT");
            admin.setPosition("System Administrator");
            admin.setHireDate(LocalDate.of(2020, 1, 1).atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli());
            admin.setSalary(new BigDecimal("75000"));
            admin.setRole(Role.ADMIN);
            admin.setActive(true);
            userService.createUser(admin);

            // Create Manager User
            User manager = new User();
            manager.setUsername("manager");
            manager.setPassword("manager123");
            manager.setEmail("manager@lazyhr.com");
            manager.setFirstName("John");
            manager.setLastName("Manager");
            manager.setEmployeeId("EMP002");
            manager.setDepartment("HR");
            manager.setPosition("HR Manager");
            manager.setHireDate(
                    LocalDate.of(2021, 3, 15).atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli());
            manager.setSalary(new BigDecimal("65000"));
            manager.setRole(Role.MANAGER);
            manager.setActive(true);
            userService.createUser(manager);

            // Create Employee Users
            User employee1 = new User();
            employee1.setUsername("jdoe");
            employee1.setPassword("password123");
            employee1.setEmail("john.doe@lazyhr.com");
            employee1.setFirstName("John");
            employee1.setLastName("Doe");
            employee1.setEmployeeId("EMP003");
            employee1.setDepartment("Development");
            employee1.setPosition("Software Developer");
            employee1.setHireDate(
                    LocalDate.of(2022, 6, 1).atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli());
            employee1.setSalary(new BigDecimal("55000"));
            employee1.setRole(Role.EMPLOYEE);
            employee1.setActive(true);
            userService.createUser(employee1);

            User employee2 = new User();
            employee2.setUsername("asmith");
            employee2.setPassword("password123");
            employee2.setEmail("alice.smith@lazyhr.com");
            employee2.setFirstName("Alice");
            employee2.setLastName("Smith");
            employee2.setEmployeeId("EMP004");
            employee2.setDepartment("Marketing");
            employee2.setPosition("Marketing Specialist");
            employee2.setHireDate(
                    LocalDate.of(2023, 2, 20).atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli());
            employee2.setSalary(new BigDecimal("45000"));
            employee2.setRole(Role.EMPLOYEE);
            employee2.setActive(true);
            userService.createUser(employee2);

            User employee3 = new User();
            employee3.setUsername("bwilson");
            employee3.setPassword("password123");
            employee3.setEmail("bob.wilson@lazyhr.com");
            employee3.setFirstName("Bob");
            employee3.setLastName("Wilson");
            employee3.setEmployeeId("EMP005");
            employee3.setDepartment("Finance");
            employee3.setPosition("Financial Analyst");
            employee3.setHireDate(
                    LocalDate.of(2023, 9, 10).atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli());
            employee3.setSalary(new BigDecimal("50000"));
            employee3.setRole(Role.EMPLOYEE);
            employee3.setActive(true);
            userService.createUser(employee3);

            // Create some inactive users for testing
            User inactiveEmployee1 = new User();
            inactiveEmployee1.setUsername("alice.smith");
            inactiveEmployee1.setPassword("password123");
            inactiveEmployee1.setEmail("smith.alice@lazyhr.com");
            inactiveEmployee1.setFirstName("Alice");
            inactiveEmployee1.setLastName("Smith");
            inactiveEmployee1.setEmployeeId("EMP006");
            inactiveEmployee1.setDepartment("Marketing");
            inactiveEmployee1.setPosition("Marketing Specialist");
            inactiveEmployee1.setHireDate(
                    LocalDate.of(2022, 6, 15).atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli());
            inactiveEmployee1.setSalary(new BigDecimal("55000"));
            inactiveEmployee1.setRole(Role.EMPLOYEE);
            inactiveEmployee1.setActive(false); // Inactive user
            userService.createUser(inactiveEmployee1);

            User inactiveEmployee2 = new User();
            inactiveEmployee2.setUsername("mike.davis");
            inactiveEmployee2.setPassword("password123");
            inactiveEmployee2.setEmail("mike.davis@lazyhr.com");
            inactiveEmployee2.setFirstName("Mike");
            inactiveEmployee2.setLastName("Davis");
            inactiveEmployee2.setEmployeeId("EMP007");
            inactiveEmployee2.setDepartment("Sales");
            inactiveEmployee2.setPosition("Sales Representative");
            inactiveEmployee2.setHireDate(
                    LocalDate.of(2021, 8, 20).atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli());
            inactiveEmployee2.setSalary(new BigDecimal("48000"));
            inactiveEmployee2.setRole(Role.EMPLOYEE);
            inactiveEmployee2.setActive(false); // Inactive user
            userService.createUser(inactiveEmployee2);

            System.out.println("Sample users created successfully!");
            System.out.println("Admin credentials: admin / admin123");
            System.out.println("Manager credentials: manager / manager123");
            System.out.println("Employee credentials: jdoe / password123");

        } catch (Exception e) {
            System.err.println("Error creating sample users: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
