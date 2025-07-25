# LazyHR - Employee Attendance and Leave Management System

A comprehensive HR management system built with Spring Boot that follows the **Model-View-Controller (MVC)** architecture pattern. Features **Unix timestamp-based date handling** for better mobile client compatibility and timezone-independent operations.

## Key Features

### 🕒 Unix Timestamp Architecture
- **Timezone-independent**: All date/time fields use Unix timestamps (milliseconds)
- **Mobile-friendly**: Better compatibility with mobile and web clients
- **Consistent formatting**: JavaScript utilities for client-side timestamp handling
- **Database efficiency**: Long integer storage for optimal performance

### 🔐 Authentication & Authorization
- Role-based access control (Admin, Manager, Employee)
- Spring Security integration
- BCrypt password encoding
- Session-based authentication

### ⏰ Attendance Management
- Clock-in/Clock-out functionality with timestamp precision
- Real-time attendance tracking
- Attendance history and reports
- Break duration tracking
- Attendance status monitoring

### 📅 Leave Management
- Multiple leave categories (Annual, Sick, Private, Special Holiday)
- Leave periods (AM, PM, Full Day)
- Leave balance tracking with yearly allocations
- Comprehensive approval workflow
- Date-based leave queries using timestamps

### 👥 User Management
- Employee registration and management
- Department and role assignment
- User search and filtering by various criteria
- Username and email availability checking
- Password management

## MVC Architecture Overview

### Model Layer (Data & Business Logic)
The Model layer consists of:
- **Entity Classes** (`model` package): Define data structure with Unix timestamp fields
- **Repository Interfaces** (`repository` package): Handle data access with timestamp-based queries
- **Service Classes** (`service` package): Contain business logic and timestamp conversions

### View Layer (Presentation)
The View layer includes:
- **Thymeleaf Templates** (`src/main/resources/templates/`): HTML pages with server-side rendering
- **JavaScript Utilities**: Client-side timestamp formatting and date handling
- **Static Resources**: CSS, JavaScript, and other assets

### Controller Layer (Request Handling)
The Controller layer contains:
- **REST Controllers** (`controller` package): Handle API requests with timestamp parameters
- **Web Controllers** (`controller.web` package): Handle web page requests

## Project Structure

```
src/main/java/com/example/lazyhr/
├── model/                      # MODEL LAYER
│   ├── User.java              # User entity with timestamp fields
│   ├── Attendance.java        # Attendance entity with timestamp fields
│   ├── LeaveRequest.java      # Leave request entity with timestamp fields
│   ├── Role.java              # User role enum
│   ├── AttendanceStatus.java  # Attendance status enum
│   ├── LeaveCategory.java     # Leave category enum
│   ├── LeavePeriod.java       # Leave period enum
│   └── LeaveStatus.java       # Leave status enum
├── repository/                 # DATA ACCESS LAYER
│   ├── UserRepository.java
│   ├── AttendanceRepository.java
│   └── LeaveRequestRepository.java
├── service/                    # BUSINESS LOGIC LAYER
│   ├── UserService.java
│   ├── AttendanceService.java
│   └── LeaveService.java
├── controller/                 # CONTROLLER LAYER
│   ├── UserController.java           # REST API for users
│   ├── AttendanceController.java     # REST API for attendance
│   ├── LeaveController.java          # REST API for leave
│   └── web/
│       └── DashboardController.java  # Web pages controller
├── config/                     # CONFIGURATION
│   ├── SecurityConfig.java
│   └── DataInitializer.java
└── LazyhrApplication.java      # Main application class

src/main/resources/
├── templates/                  # VIEW LAYER (Thymeleaf)
│   ├── dashboard.html         # Main dashboard with timestamp formatting
│   ├── users.html             # User management interface
│   ├── leave.html             # Leave management interface
│   ├── reports.html           # Reports and analytics
│   ├── login.html             # Login page
│   └── error.html             # Error handling
├── static/                     # STATIC RESOURCES
│   ├── css/                   # External stylesheets
│   │   ├── common.css         # Shared styles across all pages
│   │   ├── attendance.css     # Attendance page specific styles
│   │   ├── dashboard.css      # Dashboard page specific styles
│   │   ├── leave.css          # Leave management specific styles
│   │   ├── login.css          # Login page specific styles
│   │   ├── reports.css        # Reports page specific styles
│   │   └── users.css          # Users management specific styles
│   ├── js/                    # JavaScript utilities
│   │   ├── attendance.js      # Attendance page functionality
│   │   ├── dashboard.js       # Dashboard page functionality
│   │   ├── leave.js           # Leave management functionality
│   │   ├── reports.js         # Reports and charts functionality
│   │   └── users.js           # Users management functionality
│   └── images/                # Images and assets
└── application.properties      # Configuration

│   ├── SecurityConfig.java
│   └── DataInitializer.java
└── LazyhrApplication.java      # Main application class

src/main/resources/
├── templates/                  # VIEW LAYER (Thymeleaf)
│   ├── dashboard.html
│   ├── login.html
│   └── error.html
└── application.properties      # Configuration
```

## Key Features

### 🔐 Authentication & Authorization
- Role-based access control (Admin, Manager, Employee)
- Spring Security integration
- BCrypt password encoding

### ⏰ Attendance Management
- Clock-in/Clock-out functionality
- Real-time attendance tracking
- Overtime calculation
- Attendance history and reports

### 📅 Leave Management
- Multiple leave categories (Annual, Sick, Private, Special Holiday)
- Leave periods (AM, PM, Full Day)
- Leave balance tracking
- Approval workflow

### 👥 User Management
- Employee registration and management
- Department and role assignment
- User search and filtering

## Technology Stack

- **Backend**: Spring Boot 3.x, Spring Security, Spring Data JPA
- **Frontend**: Thymeleaf, Bootstrap 5, Font Awesome
- **Database**: H2 (development), MySQL/PostgreSQL (production)
- **Build Tool**: Gradle
- **Java Version**: 17

## Quick Start

### 1. Clone and Build
```bash
git clone <repository-url>
cd lazyhr
./gradlew clean build
```

### 2. Run the Application
```bash
./gradlew bootRun
```

### 3. Access the Application
- **Web Interface**: http://localhost:8080/lazyhr
- **H2 Console**: http://localhost:8080/lazyhr/h2-console

### 4. Demo Credentials
| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Manager | manager | manager123 |
| Employee | jdoe | password123 |

## API Endpoints

All endpoints use **Unix timestamps** (milliseconds) for date/time parameters and responses.

### User Management (12 endpoints)
- `GET /api/users` - Get all active users
- `POST /api/users` - Create new user
- `GET /api/users/{userId}` - Get user by ID
- `PUT /api/users/{userId}` - Update user
- `GET /api/users/username/{username}` - Get user by username
- `GET /api/users/search?query={query}` - Search users
- `GET /api/users/department/{department}` - Get users by department
- `GET /api/users/role/{role}` - Get users by role
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/check-username/{username}` - Check username availability
- `GET /api/users/check-email/{email}` - Check email availability
- `POST /api/users/{userId}/activate` - Activate user
- `POST /api/users/{userId}/deactivate` - Deactivate user
- `POST /api/users/{userId}/password` - Update user password

### Leave Management (11 endpoints)
- `POST /api/leave/apply` - Apply for leave (with timestamp dates)
- `GET /api/leave/user/{userId}` - Get user's leave requests
- `GET /api/leave/{leaveId}` - Get leave request by ID
- `GET /api/leave/pending` - Get all pending leave requests
- `GET /api/leave/status/{status}` - Get leave requests by status
- `GET /api/leave/date/{timestamp}` - Get leave requests for specific date
- `GET /api/leave/balance/{userId}?year={year}` - Get leave balance summary
- `GET /api/leave/stats/pending-count` - Get pending leave count
- `POST /api/leave/{leaveId}/approve` - Approve leave request
- `POST /api/leave/{leaveId}/reject` - Reject leave request
- `DELETE /api/leave/{leaveId}/cancel` - Cancel leave request

### Attendance Management (10 endpoints)
- `POST /api/attendance/clock-in?userId={id}` - Clock in
- `POST /api/attendance/clock-out?userId={id}` - Clock out
- `GET /api/attendance/today/{userId}` - Get today's attendance for user
- `GET /api/attendance/today` - Get all today's attendance records
- `GET /api/attendance/user/{userId}?startTimestamp={start}&endTimestamp={end}` - Get attendance by date range
- `GET /api/attendance/history/{userId}` - Get complete attendance history
- `GET /api/attendance/status/{userId}` - Check if user is currently clocked in
- `GET /api/attendance/stats/today` - Get today's attendance statistics
- `PUT /api/attendance/{attendanceId}/notes` - Update attendance notes
- `PUT /api/attendance/{attendanceId}/break?breakMinutes={minutes}` - Update break duration

### Example API Requests

#### Apply for Leave (with Unix timestamps)
```bash
POST /api/leave/apply
Content-Type: application/json

{
  "userId": 1,
  "leaveCategory": "ANNUAL",
  "leavePeriod": "FULL_DAY",
  "startDate": 1721865600000,  // Unix timestamp in milliseconds
  "endDate": 1722038400000,    // Unix timestamp in milliseconds
  "reason": "Family vacation"
}
```

#### Get Attendance by Date Range
```bash
GET /api/attendance/user/1?startTimestamp=1721865600000&endTimestamp=1722038400000
```

#### Create User (with Unix timestamp hire date)
```bash
POST /api/users
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "employeeId": "EMP001",
  "department": "Engineering",
  "position": "Developer",
  "hireDate": 1609459200000,   // Unix timestamp in milliseconds
  "salary": 50000.00,
  "role": "EMPLOYEE"
}
```

## MVC Implementation Details

### Model Layer Examples

#### Entity with Unix Timestamp Fields
```java
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Enumerated(EnumType.STRING)
    private Role role;
    
    // Unix timestamp fields for timezone-independent date handling
    private Long hireDate;        // Hire date as Unix timestamp (milliseconds)
    private Long createdAt;       // Creation timestamp
    private Long updatedAt;       // Last update timestamp
    
    // ... other fields
}
```

#### Leave Request Entity with Timestamps
```java
@Entity
@Table(name = "leave_requests")
public class LeaveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    // All date fields use Unix timestamps
    private Long startDate;       // Leave start date (milliseconds)
    private Long endDate;         // Leave end date (milliseconds)
    private Long appliedDate;     // When leave was applied
    private Long approvedDate;    // When leave was approved/rejected
    
    @Enumerated(EnumType.STRING)
    private LeaveStatus status;
    
    // ... other fields
}
```

#### Repository with Timestamp-based Queries
```java
@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    
    // Find leave requests by user
    List<LeaveRequest> findByUserIdOrderByAppliedDateDesc(Long userId);
    
    // Find leave requests by date range using timestamps
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.startDate <= :endTimestamp AND lr.endDate >= :startTimestamp")
    List<LeaveRequest> findByTimestampRange(@Param("startTimestamp") Long startTimestamp, 
                                           @Param("endTimestamp") Long endTimestamp);
    
    // Find leave requests for specific timestamp
    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.startDate <= :timestamp AND lr.endDate >= :timestamp")
    List<LeaveRequest> findByTimestamp(@Param("timestamp") Long timestamp);
    
    // Count pending requests in date range
    @Query("SELECT COUNT(lr) FROM LeaveRequest lr WHERE lr.status = 'PENDING' AND lr.startDate >= :startTimestamp AND lr.endDate <= :endTimestamp")
    long countPendingInRange(@Param("startTimestamp") Long startTimestamp, 
                            @Param("endTimestamp") Long endTimestamp);
}
```

#### Attendance Repository with Timestamp Queries
```java
@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    // Find attendance by user and timestamp range
    @Query("SELECT a FROM Attendance a WHERE a.user.id = :userId AND a.attendanceDate >= :startTimestamp AND a.attendanceDate <= :endTimestamp ORDER BY a.attendanceDate DESC")
    List<Attendance> findByUserIdAndTimestampRange(@Param("userId") Long userId,
                                                   @Param("startTimestamp") Long startTimestamp,
                                                   @Param("endTimestamp") Long endTimestamp);
    
    // Find today's attendance for user
    @Query("SELECT a FROM Attendance a WHERE a.user.id = :userId AND a.attendanceDate >= :startOfDay AND a.attendanceDate < :endOfDay")
    Optional<Attendance> findTodayAttendance(@Param("userId") Long userId,
                                           @Param("startOfDay") Long startOfDay,
                                           @Param("endOfDay") Long endOfDay);
}
```

### Service Layer Examples

#### Business Logic with Timestamp Handling
```java
@Service
@Transactional
public class AttendanceService {
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private UserService userService;
    
    public Attendance clockIn(Long userId) {
        User user = userService.findById(userId);
        
        // Get current timestamp
        long currentTimestamp = System.currentTimeMillis();
        
        // Calculate start and end of day for today
        long startOfDay = getStartOfDay(currentTimestamp);
        long endOfDay = getEndOfDay(currentTimestamp);
        
        // Check if already clocked in today
        Optional<Attendance> existingAttendance = attendanceRepository
            .findTodayAttendance(userId, startOfDay, endOfDay);
            
        if (existingAttendance.isPresent() && existingAttendance.get().getClockInTime() != null) {
            throw new IllegalStateException("User already clocked in today");
        }
        
        // Create new attendance record
        Attendance attendance = new Attendance();
        attendance.setUser(user);
        attendance.setAttendanceDate(startOfDay);  // Date as timestamp
        attendance.setClockInTime(currentTimestamp); // Exact clock-in time
        attendance.setStatus(AttendanceStatus.PRESENT);
        
        return attendanceRepository.save(attendance);
    }
    
    public List<Attendance> getAttendanceByUserTimestamp(Long userId, Long startTimestamp, Long endTimestamp) {
        return attendanceRepository.findByUserIdAndTimestampRange(userId, startTimestamp, endTimestamp);
    }
    
    // Utility method to get start of day timestamp
    private long getStartOfDay(long timestamp) {
        return timestamp - (timestamp % (24 * 60 * 60 * 1000));
    }
    
    // Utility method to get end of day timestamp  
    private long getEndOfDay(long timestamp) {
        return getStartOfDay(timestamp) + (24 * 60 * 60 * 1000) - 1;
    }
}
```

#### Leave Service with Timestamp Logic
```java
@Service
@Transactional
public class LeaveService {
    
    @Autowired
    private LeaveRequestRepository leaveRequestRepository;
    
    public LeaveRequest applyLeave(LeaveRequest leaveRequest) {
        // Set application timestamp
        leaveRequest.setAppliedDate(System.currentTimeMillis());
        leaveRequest.setStatus(LeaveStatus.PENDING);
        
        // Validate timestamp range
        if (leaveRequest.getStartDate() >= leaveRequest.getEndDate()) {
            throw new IllegalArgumentException("End date must be after start date");
        }
        
        // Calculate total days using timestamps
        long daysDifference = (leaveRequest.getEndDate() - leaveRequest.getStartDate()) / (1000 * 60 * 60 * 24);
        leaveRequest.setTotalDays((double) daysDifference);
        
        return leaveRequestRepository.save(leaveRequest);
    }
    
    public List<LeaveRequest> getLeaveRequestsForTimestamp(Long timestamp) {
        return leaveRequestRepository.findByTimestamp(timestamp);
    }
}
```

### Controller Layer Examples

#### REST API Controller with Timestamp Parameters
```java
@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {
    
    @Autowired
    private AttendanceService attendanceService;
    
    @PostMapping("/clock-in")
    public ResponseEntity<?> clockIn(@RequestParam Long userId) {
        try {
            Attendance attendance = attendanceService.clockIn(userId);
            return ResponseEntity.ok(new ApiResponse("success", "Successfully clocked in", attendance));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse("error", e.getMessage(), null));
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserAttendance(
            @PathVariable Long userId,
            @RequestParam Long startTimestamp,
            @RequestParam Long endTimestamp) {
        try {
            List<Attendance> attendances = attendanceService
                .getAttendanceByUserTimestamp(userId, startTimestamp, endTimestamp);
            return ResponseEntity.ok(new ApiResponse("success", "Attendance records retrieved", attendances));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse("error", "Failed to fetch attendance", null));
        }
    }
}
```

#### Leave Controller with Timestamp Handling
```java
@RestController
@RequestMapping("/api/leave")
public class LeaveController {
    
    @PostMapping("/apply")
    public ResponseEntity<?> applyLeave(@RequestBody LeaveRequestDto leaveRequestDto) {
        try {
            // Convert DTO with timestamp fields to entity
            LeaveRequest leaveRequest = new LeaveRequest();
            leaveRequest.setStartDate(leaveRequestDto.getStartDate()); // Unix timestamp
            leaveRequest.setEndDate(leaveRequestDto.getEndDate());     // Unix timestamp
            // ... other mappings
            
            LeaveRequest savedRequest = leaveService.applyLeave(leaveRequest);
            return ResponseEntity.ok(new ApiResponse("success", "Leave application submitted", savedRequest));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse("error", e.getMessage(), null));
        }
    }
    
    @GetMapping("/date/{timestamp}")
    public ResponseEntity<?> getLeavesByTimestamp(@PathVariable Long timestamp) {
        try {
            List<LeaveRequest> leaveRequests = leaveService.getLeaveRequestsForTimestamp(timestamp);
            return ResponseEntity.ok(new ApiResponse("success", "Leave requests for date retrieved", leaveRequests));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse("error", "Failed to fetch leave requests", null));
        }
    }
}
```

#### Web MVC Controller with Timestamp Data
```java
@Controller
@RequestMapping("/")
public class DashboardController {
    
    @GetMapping("/dashboard")
    public String dashboard(Model model, HttpServletRequest request) {
        // Get current user and prepare timestamp-based data
        User currentUser = getCurrentUser(request);
        model.addAttribute("user", currentUser);
        
        // Get recent attendance (last 7 days using timestamps)
        long sevenDaysAgo = System.currentTimeMillis() - (7 * 24 * 60 * 60 * 1000L);
        long now = System.currentTimeMillis();
        List<Attendance> recentAttendance = attendanceService
            .getAttendanceByUserTimestamp(currentUser.getId(), sevenDaysAgo, now);
        model.addAttribute("recentAttendance", recentAttendance);
        
        return "dashboard"; // Returns Thymeleaf template with timestamp data
    }
}

```

### View Layer Examples

#### Thymeleaf Template with Timestamp Formatting
```html
<div th:if="${user}">
    <h3 th:text="${user.firstName + ' ' + user.lastName}">User Name</h3>
    <span th:text="${user.employeeId}">EMP001</span>
    <p>Hire Date: <span th:text="${user.hireDate}" class="timestamp-display">Timestamp</span></p>
</div>

<div class="attendance-table">
    <tr th:each="attendance : ${recentAttendance}">
        <td th:text="${attendance.attendanceDate}" class="timestamp-display">Date</td>
        <td th:text="${attendance.clockInTime}" class="timestamp-display">Clock In</td>
        <td th:text="${attendance.clockOutTime}" class="timestamp-display">Clock Out</td>
        <td th:text="${attendance.status}">Status</td>
    </tr>
</div>

<!-- Leave requests with timestamp handling -->
<div th:each="leave : ${leaveRequests}">
    <p>Leave Period: 
       <span th:text="${leave.startDate}" class="timestamp-display">Start</span> - 
       <span th:text="${leave.endDate}" class="timestamp-display">End</span>
    </p>
    <p>Applied: <span th:text="${leave.appliedDate}" class="timestamp-display">Applied Date</span></p>
</div>
```

#### JavaScript Timestamp Utilities
```javascript
// Utility functions for timestamp formatting
function formatTimestamp(timestamp) {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString();
}

function formatDateTime(timestamp) {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
}

function formatTimeOnly(timestamp) {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString();
}

// Apply formatting to timestamp elements
document.addEventListener('DOMContentLoaded', function() {
    // Format all timestamp displays
    document.querySelectorAll('.timestamp-display').forEach(function(element) {
        const timestamp = parseInt(element.textContent);
        if (timestamp && !isNaN(timestamp)) {
            // Use appropriate formatting based on context
            if (element.closest('.time-only')) {
                element.textContent = formatTimeOnly(timestamp);
            } else if (element.closest('.datetime')) {
                element.textContent = formatDateTime(timestamp);
            } else {
                element.textContent = formatTimestamp(timestamp);
            }
        }
    });
});

// Date picker integration for forms
function initDatePickers() {
    $('.date-picker').datepicker({
        onSelect: function(dateText, inst) {
            // Convert selected date to Unix timestamp
            const selectedDate = new Date(dateText);
            const timestamp = selectedDate.getTime();
            
            // Store timestamp in hidden field
            const hiddenField = $(this).siblings('input[type="hidden"]');
            hiddenField.val(timestamp);
        }
    });
}
```

#### Enhanced Form Handling
```html
<!-- Leave application form with timestamp handling -->
<form id="leaveForm" method="post">
    <div class="form-group">
        <label for="startDate">Start Date:</label>
        <input type="date" id="startDate" name="startDatePicker" class="form-control">
        <input type="hidden" name="startDate" id="startDateTimestamp">
    </div>
    
    <div class="form-group">
        <label for="endDate">End Date:</label>
        <input type="date" id="endDate" name="endDatePicker" class="form-control">
        <input type="hidden" name="endDate" id="endDateTimestamp">
    </div>
    
    <script>
        // Convert date inputs to timestamps before submission
        document.getElementById('leaveForm').addEventListener('submit', function(e) {
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            
            if (startDate) {
                const startTimestamp = new Date(startDate).getTime();
                document.getElementById('startDateTimestamp').value = startTimestamp;
            }
            
            if (endDate) {
                const endTimestamp = new Date(endDate).getTime();
                document.getElementById('endDateTimestamp').value = endTimestamp;
            }
        });
    </script>
</form>
```

## Database Schema

### Core Tables with Unix Timestamp Fields

#### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(255),
    position VARCHAR(255),
    hire_date BIGINT,           -- Unix timestamp (milliseconds)
    salary DECIMAL(10,2),
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at BIGINT,          -- Unix timestamp (milliseconds)
    updated_at BIGINT           -- Unix timestamp (milliseconds)
);
```

#### Attendance Table
```sql
CREATE TABLE attendance (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    attendance_date BIGINT NOT NULL,    -- Date as Unix timestamp (start of day)
    clock_in_time BIGINT,               -- Exact clock-in time as Unix timestamp
    clock_out_time BIGINT,              -- Exact clock-out time as Unix timestamp
    total_hours DOUBLE,
    status VARCHAR(50),
    notes TEXT,
    break_minutes INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### Leave Requests Table
```sql
CREATE TABLE leave_requests (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    approved_by_id BIGINT,
    leave_category VARCHAR(50) NOT NULL,
    leave_period VARCHAR(50) NOT NULL,
    start_date BIGINT NOT NULL,         -- Leave start as Unix timestamp
    end_date BIGINT NOT NULL,           -- Leave end as Unix timestamp
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    applied_date BIGINT NOT NULL,       -- Application timestamp
    approved_date BIGINT,               -- Approval/rejection timestamp
    comments TEXT,
    total_days DOUBLE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (approved_by_id) REFERENCES users(id)
);
```

### Relationships & Indexing
- User → Attendance (One-to-Many)
- User → LeaveRequest (One-to-Many) 
- User → LeaveRequest (Many-to-One for approver)

#### Recommended Indexes for Timestamp Queries
```sql
-- Optimize attendance queries by user and date range
CREATE INDEX idx_attendance_user_date ON attendance(user_id, attendance_date);
CREATE INDEX idx_attendance_date_range ON attendance(attendance_date);

-- Optimize leave request queries by date range
CREATE INDEX idx_leave_date_range ON leave_requests(start_date, end_date);
CREATE INDEX idx_leave_user_date ON leave_requests(user_id, applied_date);

-- Optimize user queries
CREATE INDEX idx_user_active ON users(is_active);
CREATE INDEX idx_user_department ON users(department);
```

## Technology Stack

- **Backend**: Spring Boot 3.x, Spring Security, Spring Data JPA
- **Frontend**: Thymeleaf, Bootstrap 5, Font Awesome, JavaScript timestamp utilities
- **Database**: H2 (development), MySQL/PostgreSQL (production)
- **Date/Time**: Unix timestamps (Long) for timezone-independent operations
- **Build Tool**: Gradle
- **Java Version**: 17
- **API Documentation**: OpenAPI 3.0.3 specification

### Unix Timestamp Benefits
- **Timezone Independence**: No timezone conversion issues across different clients
- **Mobile Compatibility**: Better support for mobile applications and web clients
- **Database Performance**: Efficient indexing and querying with BIGINT fields
- **Consistent Formatting**: Single source of truth for date/time data
- **Easy Calculations**: Simple arithmetic operations for date ranges and durations

## Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/dashboard")
            );
        return http.build();
    }
}
```

## Development Guidelines

### Adding New Features

1. **Model**: Create/update entity classes in `model` package
2. **Repository**: Add/update repository interfaces in `repository` package  
3. **Service**: Implement business logic in `service` package
4. **Controller**: Create REST endpoints in `controller` package
5. **View**: Add/update Thymeleaf templates in `templates` folder

### Code Structure Best Practices

- Use DTOs for API requests/responses
- Implement proper exception handling
- Add validation annotations on entities
- Follow RESTful API conventions
- Use transaction management in services

## API Documentation

The complete API is documented using **OpenAPI 3.0.3** specification available at:
- **OpenAPI Spec**: `/openapi.yaml` (33 endpoints documented)
- **Live Documentation**: http://localhost:8080/lazyhr/swagger-ui.html (if Swagger UI is enabled)

### Key API Features
- **Comprehensive Coverage**: All 33 endpoints across User, Leave, and Attendance management
- **Unix Timestamp Parameters**: All date/time fields use Unix timestamps (milliseconds)
- **Consistent Response Format**: Standardized ApiResponse structure
- **Complete Schema Definitions**: Full DTOs and entity schemas
- **Example Requests**: Sample payloads with timestamp examples

## Testing

Run tests with:
```bash
./gradlew test
```

### Testing with Timestamps
```java
@Test
public void testLeaveApplicationWithTimestamps() {
    // Create test data with Unix timestamps
    long startDate = System.currentTimeMillis() + (7 * 24 * 60 * 60 * 1000L); // 7 days from now
    long endDate = startDate + (2 * 24 * 60 * 60 * 1000L); // 2 days duration
    
    LeaveRequestDto dto = new LeaveRequestDto();
    dto.setStartDate(startDate);
    dto.setEndDate(endDate);
    // ... other test setup
}
```

## Production Deployment

1. **Update Database Configuration**:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/lazyhr_prod
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=validate
   ```

2. **Build Production JAR**:
   ```bash
   ./gradlew build -x test
   ```

3. **Run Application**:
   ```bash
   java -jar build/libs/lazyhr-0.0.1-SNAPSHOT.jar
   ```

## Docker Deployment

### Option 1: Using Docker Compose (Recommended)

1. **Create docker-compose.yml**:
   ```yaml
   version: '3.8'
   
   services:
     lazyhr-app:
       build: .
       ports:
         - "8080:8080"
       environment:
         - SPRING_PROFILES_ACTIVE=docker
         - SPRING_DATASOURCE_URL=jdbc:mysql://lazyhr-db:3306/lazyhr_db
         - SPRING_DATASOURCE_USERNAME=lazyhr_user
         - SPRING_DATASOURCE_PASSWORD=lazyhr_pass123
       depends_on:
         - lazyhr-db
       volumes:
         - ./logs:/app/logs
   
     lazyhr-db:
       image: mysql:8.0
       ports:
         - "3307:3306"
       environment:
         - MYSQL_ROOT_PASSWORD=root_password123
         - MYSQL_DATABASE=lazyhr_db
         - MYSQL_USER=lazyhr_user
         - MYSQL_PASSWORD=lazyhr_pass123
       volumes:
         - lazyhr_mysql_data:/var/lib/mysql
         - ./init-scripts:/docker-entrypoint-initdb.d
   
   volumes:
     lazyhr_mysql_data:
   ```

2. **Create Dockerfile**:
   ```dockerfile
   FROM openjdk:17-jdk-slim
   
   # Set working directory
   WORKDIR /app
   
   # Copy gradle wrapper and build files
   COPY gradlew .
   COPY gradle gradle
   COPY build.gradle .
   COPY settings.gradle .
   
   # Copy source code
   COPY src src
   
   # Make gradlew executable
   RUN chmod +x ./gradlew
   
   # Build the application
   RUN ./gradlew clean build -x test
   
   # Copy the built JAR
   RUN cp build/libs/*.jar app.jar
   
   # Create logs directory
   RUN mkdir -p /app/logs
   
   # Expose port
   EXPOSE 8080
   
   # Set timezone
   ENV TZ=UTC
   
   # Run the application
   ENTRYPOINT ["java", "-jar", "app.jar"]
   ```

3. **Create application-docker.properties**:
   ```properties
   # Docker-specific configuration
   spring.datasource.url=jdbc:mysql://lazyhr-db:3306/lazyhr_db
   spring.datasource.username=lazyhr_user
   spring.datasource.password=lazyhr_pass123
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   
   # JPA Configuration for Docker
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=false
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
   spring.jpa.properties.hibernate.format_sql=true
   
   # Logging Configuration
   logging.level.com.example.lazyhr=INFO
   logging.file.name=/app/logs/lazyhr.log
   logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
   
   # Server Configuration
   server.port=8080
   server.servlet.context-path=/lazyhr
   
   # Security Configuration
   spring.security.user.name=admin
   spring.security.user.password=admin123
   spring.security.user.roles=ADMIN
   ```

4. **Create database initialization script** (`init-scripts/01-init.sql`):
   ```sql
   -- Create database if not exists
   CREATE DATABASE IF NOT EXISTS lazyhr_db;
   USE lazyhr_db;
   
   -- Grant privileges
   GRANT ALL PRIVILEGES ON lazyhr_db.* TO 'lazyhr_user'@'%';
   FLUSH PRIVILEGES;
   
   -- Insert initial admin user (password: admin123)
   INSERT IGNORE INTO users (id, username, password, email, first_name, last_name, employee_id, role, is_active, created_at, updated_at) 
   VALUES (1, 'admin', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'admin@lazyhr.com', 'System', 'Administrator', 'ADM001', 'ADMIN', true, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000);
   ```

5. **Deploy with Docker Compose**:
   ```bash
   # Build and start all services
   docker-compose up -d --build
   
   # View logs
   docker-compose logs -f lazyhr-app
   
   # Stop services
   docker-compose down
   
   # Stop and remove volumes (careful - this deletes data!)
   docker-compose down -v
   ```

### Option 2: Single Container with External Database

1. **Build Docker Image**:
   ```bash
   docker build -t lazyhr:latest .
   ```

2. **Run with External MySQL**:
   ```bash
   docker run -d \
     --name lazyhr-app \
     -p 8080:8080 \
     -e SPRING_PROFILES_ACTIVE=docker \
     -e SPRING_DATASOURCE_URL=jdbc:mysql://your-mysql-host:3306/lazyhr_db \
     -e SPRING_DATASOURCE_USERNAME=your_username \
     -e SPRING_DATASOURCE_PASSWORD=your_password \
     -v $(pwd)/logs:/app/logs \
     lazyhr:latest
   ```

### Option 3: Multi-Stage Dockerfile (Production Optimized)

```dockerfile
# Multi-stage build for production
FROM openjdk:17-jdk-slim AS builder

WORKDIR /app

# Copy gradle wrapper and build files
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Copy source code
COPY src src

# Make gradlew executable and build
RUN chmod +x ./gradlew && ./gradlew clean build -x test

# Production stage
FROM openjdk:17-jre-slim

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN adduser --disabled-password --gecos '' lazyhr

WORKDIR /app

# Copy JAR from builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

# Create logs directory and set permissions
RUN mkdir -p /app/logs && chown -R lazyhr:lazyhr /app

# Switch to non-root user
USER lazyhr

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/lazyhr/actuator/health || exit 1

# Expose port
EXPOSE 8080

# Set JVM options for container
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseContainerSupport"

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

### Docker Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `docker` |
| `SPRING_DATASOURCE_URL` | Database connection URL | Required |
| `SPRING_DATASOURCE_USERNAME` | Database username | Required |
| `SPRING_DATASOURCE_PASSWORD` | Database password | Required |
| `SERVER_PORT` | Application server port | `8080` |
| `JAVA_OPTS` | JVM options | `-Xms512m -Xmx1024m` |
| `TZ` | Timezone | `UTC` |

### Docker Commands Reference

```bash
# Build image
docker build -t lazyhr:latest .

# Run container
docker run -d --name lazyhr -p 8080:8080 lazyhr:latest

# View logs
docker logs -f lazyhr

# Execute bash in running container
docker exec -it lazyhr bash

# Stop and remove container
docker stop lazyhr && docker rm lazyhr

# View container resource usage
docker stats lazyhr

# Inspect container configuration
docker inspect lazyhr
```

### Production Docker Deployment

1. **Create production docker-compose.yml**:
   ```yaml
   version: '3.8'
   
   services:
     lazyhr-app:
       image: lazyhr:production
       restart: unless-stopped
       ports:
         - "80:8080"
       environment:
         - SPRING_PROFILES_ACTIVE=production
         - SPRING_DATASOURCE_URL=jdbc:mysql://production-db:3306/lazyhr_prod
         - SPRING_DATASOURCE_USERNAME=${DB_USERNAME}
         - SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}
         - JAVA_OPTS=-Xms1g -Xmx2g -XX:+UseG1GC
       volumes:
         - lazyhr_logs:/app/logs
         - lazyhr_config:/app/config
       networks:
         - lazyhr-network
       depends_on:
         - production-db
   
     production-db:
       image: mysql:8.0
       restart: unless-stopped
       environment:
         - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
         - MYSQL_DATABASE=lazyhr_prod
         - MYSQL_USER=${DB_USERNAME}
         - MYSQL_PASSWORD=${DB_PASSWORD}
       volumes:
         - lazyhr_mysql_prod:/var/lib/mysql
         - ./backup:/backup
       networks:
         - lazyhr-network
       command: --default-authentication-plugin=mysql_native_password
   
     nginx:
       image: nginx:alpine
       restart: unless-stopped
       ports:
         - "443:443"
         - "80:80"
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf
         - ./ssl:/etc/nginx/ssl
       depends_on:
         - lazyhr-app
       networks:
         - lazyhr-network
   
   volumes:
     lazyhr_mysql_prod:
     lazyhr_logs:
     lazyhr_config:
   
   networks:
     lazyhr-network:
       driver: bridge
   ```

2. **Create .env file for production**:
   ```bash
   DB_USERNAME=lazyhr_prod_user
   DB_PASSWORD=secure_password_here
   MYSQL_ROOT_PASSWORD=secure_root_password
   ```

3. **Deploy to production**:
   ```bash
   # Pull latest images and deploy
   docker-compose -f docker-compose.production.yml pull
   docker-compose -f docker-compose.production.yml up -d
   
   # Monitor deployment
   docker-compose -f docker-compose.production.yml logs -f
   ```

### Access the Application

Once deployed, access the application at:
- **Local Development**: http://localhost:8080/lazyhr
- **Production**: http://your-domain.com/lazyhr (if using nginx proxy)

### Troubleshooting Docker Deployment

1. **Check container logs**:
   ```bash
   docker-compose logs lazyhr-app
   ```

2. **Database connection issues**:
   ```bash
   # Test database connectivity
   docker-compose exec lazyhr-app curl -f http://localhost:8080/lazyhr/actuator/health
   ```

3. **Volume permissions**:
   ```bash
   # Fix log directory permissions
   docker-compose exec lazyhr-app chown -R lazyhr:lazyhr /app/logs
   ```

4. **Memory issues**:
   ```bash
   # Increase memory limits in docker-compose.yml
   environment:
     - JAVA_OPTS=-Xms1g -Xmx2g
   ```

## Development Guidelines

### Working with Timestamps

1. **Always use Unix timestamps (milliseconds)** for date/time fields
2. **Convert dates at the boundary**: Convert to/from user-friendly formats only in the view layer
3. **Use consistent utilities**: Leverage the provided JavaScript utilities for client-side formatting
4. **Database queries**: Use timestamp ranges for efficient date-based queries

### Adding New Features

1. **Model**: Create/update entity classes with Long timestamp fields
2. **Repository**: Add timestamp-based query methods using @Query annotations
3. **Service**: Implement business logic with timestamp calculations
4. **Controller**: Use timestamp parameters in REST endpoints
5. **View**: Add JavaScript utilities for timestamp formatting
6. **API Docs**: Update OpenAPI specification with new endpoints

### Code Structure Best Practices

- Use DTOs with Long timestamp fields for API requests/responses
- Implement proper exception handling with meaningful error messages
- Add validation annotations on entities (including timestamp validation)
- Follow RESTful API conventions with timestamp parameters
- Use transaction management in services for data consistency
- Include timestamp examples in API documentation

### Timestamp Conversion Examples

```java
// Current timestamp
long now = System.currentTimeMillis();

// Start of day
long startOfDay = now - (now % (24 * 60 * 60 * 1000));

// End of day  
long endOfDay = startOfDay + (24 * 60 * 60 * 1000) - 1;

// Days difference
long daysDiff = (endTimestamp - startTimestamp) / (1000 * 60 * 60 * 24);
```

## Contributing

1. Follow MVC architecture patterns with timestamp-based data handling
2. Maintain separation of concerns between data conversion and business logic
3. Add proper documentation including timestamp field descriptions
4. Include unit tests for new features with timestamp test data
5. Follow Spring Boot conventions and OpenAPI documentation standards
6. Use consistent timestamp handling across all layers

## License

This project is open source and available under the [MIT License](LICENSE).
