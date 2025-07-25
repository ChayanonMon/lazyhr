# How to Use LazyHR API with Android (Kotlin)

This guide provides instructions and examples on how to interact with the LazyHR API from an Android application using Kotlin.

---

# (English)

## 1. Setup Dependencies

First, you need to add the following dependencies to your `build.gradle.kts` (or `build.gradle`) file to handle network requests and JSON parsing. We recommend using **Retrofit** for network calls and **Gson** for JSON serialization/deserialization.

**Why these dependencies?**
- **Retrofit**: A type-safe HTTP client for Android and Java. It makes it easy to consume JSON or XML data which is then parsed into Plain Old Java Objects (POJOs).
- **Gson**: A Java library that can be used to convert Java Objects into their JSON representation. It can also be used to convert a JSON string to an equivalent Java object.
- **OkHttp Logging Interceptor**: Logs HTTP request and response data. This is very useful for debugging network issues.
- **Kotlin Coroutines**: For asynchronous programming. Network requests can't run on the main thread, so coroutines help manage background tasks efficiently.

```kotlin
// In your app's build.gradle.kts

dependencies {
    // Retrofit for network requests. This is the core library.
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    // This is the converter for Gson, which serializes and deserializes JSON.
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    
    // OkHttp for logging. This is optional but highly recommended for debugging.
    // It allows you to see the raw request and response in your Logcat.
    implementation("com.squareup.okhttp3:logging-interceptor:4.9.3")
    
    // Kotlin Coroutines for managing background threads for network calls.
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.1")
}
```

## 2. Create Retrofit Instance

Create a singleton object to manage your Retrofit instance. This ensures that you only have one instance of Retrofit throughout your app, which is efficient. Replace `your-server-ip` with the actual IP address or domain of your server.

**Why a Singleton?**
- A Singleton pattern ensures that a class has only one instance and provides a global point of access to it. For network clients, this is efficient as it reuses the same configuration and connection pool.

**Why `by lazy`?**
- `by lazy` is a property delegate that creates the instance of Retrofit only when it's accessed for the first time, making the app startup faster.

```kotlin
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

// A singleton object to hold our Retrofit instance.
object ApiClient {

    // IMPORTANT: Replace with your server's IP address or domain.
    // This is the base URL for all your API calls.
    private const val BASE_URL = "http://your-server-ip:8080/lazyhr/"

    // Create a logging interceptor to see request/response details in Logcat.
    // This is a huge help for debugging network problems.
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY // Log the entire request and response body.
    }

    // Create an OkHttpClient and add the logging interceptor.
    // OkHttp is the underlying HTTP client for Retrofit.
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .build()

    // Create the Retrofit instance using the 'lazy' delegate.
    // This means the instance is created only when it's first needed.
    val instance: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL) // Set the base URL for all requests.
            .client(okHttpClient) // Use our custom OkHttpClient with the logger.
            .addConverterFactory(GsonConverterFactory.create()) // Use Gson to handle JSON.
            .build()
    }
}
```

## 3. Define API Interface

Create an interface that defines all the API endpoints you need to access. Retrofit will automatically generate the implementation for this interface. All functions should be marked with `suspend` to be used with coroutines.

**Why an Interface?**
- Retrofit uses annotations on an interface to define how requests are made. This approach is clean, declarative, and separates the API definition from the implementation.

**Why `suspend`?**
- The `suspend` keyword marks the function as a coroutine function. This allows it to be paused and resumed, which is perfect for long-running operations like network calls, without blocking the main thread.

```kotlin
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {

    // --- User Management ---
    // @GET defines an HTTP GET request. The string is the path relative to the base URL.
    // @Path replaces {userId} in the URL with the value of the userId parameter.
    @GET("api/users/{userId}")
    suspend fun getUserById(@Path("userId") userId: Long): ApiResponse<User>

    // --- Attendance Management ---
    // @POST defines an HTTP POST request.
    // @Query adds a query parameter to the URL (e.g., /clock-in?userId=1).
    @POST("api/attendance/clock-in")
    suspend fun clockIn(@Query("userId") userId: Long): ApiResponse<Map<String, Any>>

    @POST("api/attendance/clock-out")
    suspend fun clockOut(@Query("userId") userId: Long): ApiResponse<Map<String, Any>>

    @GET("api/attendance/today/{userId}")
    suspend fun getTodayAttendance(@Path("userId") userId: Long): ApiResponse<Attendance?>

    @GET("api/attendance/user/{userId}")
    suspend fun getUserAttendance(
        @Path("userId") userId: Long,
        @Query("startTimestamp") startTimestamp: Long,
        @Query("endTimestamp") endTimestamp: Long
    ): ApiResponse<List<Attendance>>

    @GET("api/attendance/history/{userId}")
    suspend fun getAttendanceHistory(@Path("userId") userId: Long): ApiResponse<List<Attendance>>

    // --- Leave Management ---
    // @Body tells Retrofit to serialize the leaveRequest object into the request body as JSON.
    @POST("api/leave/apply")
    suspend fun applyForLeave(@Body leaveRequest: LeaveRequestDto): ApiResponse<LeaveRequest>

    @GET("api/leave/user/{userId}")
    suspend fun getUserLeaves(@Path("userId") userId: Long): ApiResponse<List<LeaveRequest>>

    @POST("api/leave/{leaveId}/approve")
    suspend fun approveLeave(
        @Path("leaveId") leaveId: Long,
        @Query("approverId") approverId: Long,
        @Query("comments") comments: String?
    ): ApiResponse<LeaveRequest>
}
```

## 4. Create Data Classes (DTOs)

Define Kotlin data classes that match the JSON structure of your API responses and request bodies. All timestamp fields should be of type `Long`.

**Why `data class`?**
- `data class` is a concise way to create classes that just hold data. The compiler automatically generates useful methods like `toString()`, `equals()`, `hashCode()`, and `copy()`.

**Why match the JSON structure?**
- Gson uses reflection to map the fields in the JSON to the properties in your data class. The names must match for this to work automatically.

```kotlin
// A data class to hold User information. The property names match the JSON keys.
data class User(
    val id: Long,
    val username: String,
    val email: String,
    val firstName: String,
    val lastName: String,
    val employeeId: String,
    val department: String?,
    val position: String?,
    val hireDate: Long?, // Unix timestamp in milliseconds
    val salary: Double?,
    val role: String, // "ADMIN", "MANAGER", "EMPLOYEE"
    val isActive: Boolean = true
    // ... other fields
)

// A data class for an Attendance record.
data class Attendance(
    val id: Long,
    val attendanceDate: Long, // Timestamp for the start of the day
    val clockInTime: Long?,   // Exact clock-in timestamp
    val clockOutTime: Long?,  // Exact clock-out timestamp
    val totalHours: Double?,
    val overtimeHours: Double? = 0.0,
    val status: String, // "PRESENT", "ABSENT", "LATE", "HALF_DAY"
    val notes: String?,
    val breakDurationMinutes: Int? = 0
    // ... other fields
)

// A Data Transfer Object (DTO) for creating a leave request.
// It's good practice to use DTOs for request bodies to control what data is sent.
data class LeaveRequestDto(
    val userId: Long,
    val leaveCategory: String, // "ANNUAL", "PRIVATE", "SICK", "SPECIAL_HOLIDAY"
    val leavePeriod: String,   // "AM", "PM", "FULL_DAY"
    val startDate: Long,       // Unix timestamp in milliseconds
    val endDate: Long,         // Unix timestamp in milliseconds
    val reason: String
)

// A data class for the response of a leave request.
data class LeaveRequest(
    val id: Long,
    val userId: Long,
    val leaveCategory: String,
    val leavePeriod: String,
    val startDate: Long,
    val endDate: Long,
    val reason: String,
    val status: String, // "PENDING", "APPROVED", "REJECTED"
    val appliedDate: Long?,
    val approvedDate: Long?,
    val comments: String?,
    val totalDays: Double?
    // ... other fields
)

// A generic wrapper for all API responses. This standardizes how you handle responses.
// The 'data' property is generic, so it can hold any type of data (a User, a List of Attendances, etc.).
data class ApiResponse<T>(
    val status: String, // "success" or "error"
    val message: String,
    val data: T?
)
```

## 5. Making API Calls (MVC Pattern)

Here's how to implement the MVC pattern for making API calls. We'll create separate Model, Controller, and View components. This separation of concerns makes the code more organized, easier to test, and maintain.

### Model Layer (Data Repository)

The Repository's job is to provide data to the rest of the app. It abstracts the data source (in this case, the network API).

**Why `withContext(Dispatchers.IO)`?**
- This function switches the coroutine to the IO dispatcher, which is optimized for I/O operations like network requests. This is crucial for keeping the UI thread free and responsive.

```kotlin
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

// The repository class is responsible for all data operations.
class HrRepository {
    
    // Create an instance of our ApiService.
    private val apiService = ApiClient.instance.create(ApiService::class.java)
    
    // Each function in the repository calls a corresponding function in the ApiService.
    // We use withContext(Dispatchers.IO) to ensure the network call happens on a background thread.
    suspend fun clockIn(userId: Long): ApiResponse<Map<String, Any>> {
        return withContext(Dispatchers.IO) {
            apiService.clockIn(userId)
        }
    }
    
    suspend fun clockOut(userId: Long): ApiResponse<Map<String, Any>> {
        return withContext(Dispatchers.IO) {
            apiService.clockOut(userId)
        }
    }
    
    suspend fun getUserById(userId: Long): ApiResponse<User> {
        return withContext(Dispatchers.IO) {
            apiService.getUserById(userId)
        }
    }
    
    suspend fun applyForLeave(leaveRequest: LeaveRequestDto): ApiResponse<LeaveRequest> {
        return withContext(Dispatchers.IO) {
            apiService.applyForLeave(leaveRequest)
        }
    }
    
    suspend fun getAttendanceHistory(userId: Long): ApiResponse<List<Attendance>> {
        return withContext(Dispatchers.IO) {
            apiService.getAttendanceHistory(userId)
        }
    }
}
```

### Controller Layer

The Controller acts as a bridge between the View (UI) and the Model (Repository). It handles user actions, fetches data from the repository, and tells the View what to display.

**Why `CoroutineScope(Dispatchers.Main)`?**
- We create a coroutine scope tied to the main thread. This is important because UI updates must happen on the main thread.

**Why `try-catch-finally`?**
- This is a standard way to handle potential errors (like network failures) and ensure that cleanup code (like hiding a loading indicator) always runs.

```kotlin
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

// The controller takes a reference to the View interface.
class HrController(private val view: HrView) {
    
    private val repository = HrRepository()
    // Create a coroutine scope for launching coroutines from the controller.
    // We use Dispatchers.Main because the controller will be updating the UI.
    private val controllerScope = CoroutineScope(Dispatchers.Main)
    
    fun clockInUser(userId: Long) {
        // Launch a new coroutine without blocking the current thread.
        controllerScope.launch {
            view.showLoading(true) // Show a loading indicator on the UI.
            try {
                // Get data from the repository (this happens on a background thread).
                val response = repository.clockIn(userId)
                // Switch back to the main thread to update the UI.
                withContext(Dispatchers.Main) {
                    if (response.status == "success") {
                        val data = response.data as? Map<String, Any>
                        val clockInTime = data?.get("clockInTime") as? Long
                        view.onClockInSuccess(clockInTime) // Update the UI with the result.
                    } else {
                        view.onError("Clock-in failed: ${response.message}") // Show an error message.
                    }
                }
            } catch (e: Exception) {
                // Handle exceptions, like network errors.
                withContext(Dispatchers.Main) {
                    view.onError("Network error: ${e.message}")
                }
            } finally {
                // This block always executes, whether there was an error or not.
                withContext(Dispatchers.Main) {
                    view.showLoading(false) // Hide the loading indicator.
                }
            }
        }
    }
    
    fun applyForLeave(userId: Long, reason: String) {
        controllerScope.launch {
            view.showLoading(true)
            try {
                // Example of creating a request object.
                val startTimestamp = System.currentTimeMillis()
                val endTimestamp = startTimestamp + (2 * 24 * 60 * 60 * 1000) // 2 days later
                
                val leaveDto = LeaveRequestDto(
                    userId = userId,
                    leaveCategory = "ANNUAL",
                    leavePeriod = "FULL_DAY",
                    startDate = startTimestamp,
                    endDate = endTimestamp,
                    reason = reason
                )
                
                val response = repository.applyForLeave(leaveDto)
                withContext(Dispatchers.Main) {
                    if (response.status == "success") {
                        view.onLeaveApplicationSuccess(response.data)
                    } else {
                        view.onError("Leave application failed: ${response.message}")
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    view.onError("Network error: ${e.message}")
                }
            } finally {
                withContext(Dispatchers.Main) {
                    view.showLoading(false)
                }
            }
        }
    }
    
    fun loadUserData(userId: Long) {
        controllerScope.launch {
            view.showLoading(true)
            try {
                val response = repository.getUserById(userId)
                withContext(Dispatchers.Main) {
                    if (response.status == "success") {
                        view.displayUserData(response.data)
                    } else {
                        view.onError("Failed to load user data: ${response.message}")
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    view.onError("Network error: ${e.message}")
                }
            } finally {
                withContext(Dispatchers.Main) {
                    view.showLoading(false)
                }
            }
        }
    }
}
```

### View Interface

This interface defines a contract for what the View must be able to do. This decouples the Controller from the specific implementation of the View (e.g., an Activity or a Fragment).

**Why an Interface?**
- It makes the Controller more testable. You can create a "mock" view for testing without needing a real Android UI.
- It improves code organization and follows the principles of clean architecture.

```kotlin
// This interface defines the contract between the Controller and the View.
// The Activity or Fragment will implement this interface.
interface HrView {
    fun showLoading(isLoading: Boolean)
    fun onError(message: String)
    fun onClockInSuccess(clockInTime: Long?)
    fun onLeaveApplicationSuccess(leaveRequest: LeaveRequest?)
    fun displayUserData(user: User?)
}
```

### Activity/Fragment Implementation (View Layer)

The Activity or Fragment is the actual UI. It implements the `HrView` interface and delegates all logic to the `HrController`.

**Why delegate to the Controller?**
- This keeps the Activity/Fragment clean and focused on its primary job: managing the UI. It shouldn't contain business logic or data fetching code.


# How to Use LazyHR API with Android (Kotlin)

This guide provides instructions and examples on how to interact with the LazyHR API from an Android application using Kotlin.

---

# (English)

## 1. Setup Dependencies

First, you need to add the following dependencies to your `build.gradle.kts` (or `build.gradle`) file to handle network requests and JSON parsing. We recommend using **Retrofit** for network calls and **Gson** for JSON serialization/deserialization.

**Why these dependencies?**
- **Retrofit**: Think of this as your friendly neighborhood mail carrier for the internet. It's a fantastic library that makes it super simple to fetch data from a server. You tell it what you want, and it brings it back to you, neatly packaged.
- **Gson**: This is Retrofit's trusty translator. The data you get from the server is usually in a language called JSON. Gson takes that JSON and turns it into Kotlin objects you can actually work with in your code.
- **OkHttp Logging Interceptor**: This is like having x-ray vision for your network requests. It prints out the details of every request you send and every response you get. It's a lifesaver when you're trying to figure out why something isn't working!
- **Kotlin Coroutines**: These are your secret weapon for keeping your app's UI smooth and responsive. Network requests can take a moment, and you don't want your app to freeze while it's waiting. Coroutines let you run these tasks in the background without any fuss.

```kotlin
// In your app's build.gradle.kts

dependencies {
    // Retrofit for network requests. This is the core library.
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    // This is the converter for Gson, which serializes and deserializes JSON.
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    
    // OkHttp for logging. This is optional but highly recommended for debugging.
    // It allows you to see the raw request and response in your Logcat.
    implementation("com.squareup.okhttp3:logging-interceptor:4.9.3")
    
    // Kotlin Coroutines for managing background threads for network calls.
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.1")
}
```

## 2. Create Retrofit Instance

Create a singleton object to manage your Retrofit instance. This ensures that you only have one instance of Retrofit throughout your app, which is efficient. Replace `your-server-ip` with the actual IP address or domain of your server.

**Why a Singleton?**
- Think of it like having one main post office for your whole town. Instead of building a new one every time you want to send a letter, you just use the one that's already there. It's much more efficient! A singleton ensures you have just one `ApiClient` for your whole app.

**Why `by lazy`?**
- This is a clever bit of Kotlin magic. It means "don't create this Retrofit instance until the very first time I actually need it." This helps your app start up a little bit faster.

```kotlin
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

// A singleton object to hold our Retrofit instance.
object ApiClient {

    // IMPORTANT: Replace with your server's IP address or domain.
    // This is the base URL for all your API calls.
    private const val BASE_URL = "http://your-server-ip:8080/lazyhr/"

    // Create a logging interceptor to see request/response details in Logcat.
    // This is a huge help for debugging network problems.
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY // Log the entire request and response body.
    }

    // Create an OkHttpClient and add the logging interceptor.
    // OkHttp is the underlying HTTP client for Retrofit.
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .build()

    // Create the Retrofit instance using the 'lazy' delegate.
    // This means the instance is created only when it's first needed.
    val instance: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL) // Set the base URL for all requests.
            .client(okHttpClient) // Use our custom OkHttpClient with the logger.
            .addConverterFactory(GsonConverterFactory.create()) // Use Gson to handle JSON.
            .build()
    }
}
```

## 3. Define API Interface

Create an interface that defines all the API endpoints you need to access. Retrofit will automatically generate the implementation for this interface. All functions should be marked with `suspend` to be used with coroutines.

**Why an Interface?**
- This is like creating a menu for a restaurant. You list all the dishes (API calls) you can order, but you don't have to worry about how they're cooked in the kitchen. Retrofit takes care of all the "cooking" for you. It's a very clean way to define your API.

**Why `suspend`?**
- This little keyword is a big deal. It tells Kotlin that this function might take a while (like a network call) and that it's okay to "pause" it and come back later, without freezing the app. It's the heart of how coroutines work.

```kotlin
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {

    // --- User Management ---
    // @GET defines an HTTP GET request. The string is the path relative to the base URL.
    // @Path replaces {userId} in the URL with the value of the userId parameter.
    @GET("api/users/{userId}")
    suspend fun getUserById(@Path("userId") userId: Long): ApiResponse<User>

    // --- Attendance Management ---
    // @POST defines an HTTP POST request.
    // @Query adds a query parameter to the URL (e.g., /clock-in?userId=1).
    @POST("api/attendance/clock-in")
    suspend fun clockIn(@Query("userId") userId: Long): ApiResponse<Map<String, Any>>

    @POST("api/attendance/clock-out")
    suspend fun clockOut(@Query("userId") userId: Long): ApiResponse<Map<String, Any>>

    @GET("api/attendance/today/{userId}")
    suspend fun getTodayAttendance(@Path("userId") userId: Long): ApiResponse<Attendance?>

    @GET("api/attendance/user/{userId}")
    suspend fun getUserAttendance(
        @Path("userId") userId: Long,
        @Query("startTimestamp") startTimestamp: Long,
        @Query("endTimestamp") endTimestamp: Long
    ): ApiResponse<List<Attendance>>

    @GET("api/attendance/history/{userId}")
    suspend fun getAttendanceHistory(@Path("userId") userId: Long): ApiResponse<List<Attendance>>

    // --- Leave Management ---
    // @Body tells Retrofit to serialize the leaveRequest object into the request body as JSON.
    @POST("api/leave/apply")
    suspend fun applyForLeave(@Body leaveRequest: LeaveRequestDto): ApiResponse<LeaveRequest>

    @GET("api/leave/user/{userId}")
    suspend fun getUserLeaves(@Path("userId") userId: Long): ApiResponse<List<LeaveRequest>>

    @POST("api/leave/{leaveId}/approve")
    suspend fun approveLeave(
        @Path("leaveId") leaveId: Long,
        @Query("approverId") approverId: Long,
        @Query("comments") comments: String?
    ): ApiResponse<LeaveRequest>
}
```

## 4. Create Data Classes (DTOs)

Define Kotlin data classes that match the JSON structure of your API responses and request bodies. All timestamp fields should be of type `Long`.

**Why `data class`?**
- `data class` is a Kotlin superpower. You just declare the data you need, and Kotlin writes all the boring boilerplate code for you (like `toString()`, `equals()`, etc.). It's clean and saves you a ton of typing.

**Why match the JSON structure?**
- This is how you make Gson's job easy. If the names of your properties in the data class match the names of the keys in the JSON, Gson can automatically convert between the two without any extra code. It's like magic!

```kotlin
// A data class to hold User information. The property names match the JSON keys.
data class User(
    val id: Long,
    val username: String,
    val email: String,
    val firstName: String,
    val lastName: String,
    val employeeId: String,
    val department: String?,
    val position: String?,
    val hireDate: Long?, // Unix timestamp in milliseconds
    val salary: Double?,
    val role: String, // "ADMIN", "MANAGER", "EMPLOYEE"
    val isActive: Boolean = true
    // ... other fields
)

// A data class for an Attendance record.
data class Attendance(
    val id: Long,
    val attendanceDate: Long, // Timestamp for the start of the day
    val clockInTime: Long?,   // Exact clock-in timestamp
    val clockOutTime: Long?,  // Exact clock-out timestamp
    val totalHours: Double?,
    val overtimeHours: Double? = 0.0,
    val status: String, // "PRESENT", "ABSENT", "LATE", "HALF_DAY"
    val notes: String?,
    val breakDurationMinutes: Int? = 0
    // ... other fields
)

// A Data Transfer Object (DTO) for creating a leave request.
// It's good practice to use DTOs for request bodies to control what data is sent.
data class LeaveRequestDto(
    val userId: Long,
    val leaveCategory: String, // "ANNUAL", "PRIVATE", "SICK", "SPECIAL_HOLIDAY"
    val leavePeriod: String,   // "AM", "PM", "FULL_DAY"
    val startDate: Long,       // Unix timestamp in milliseconds
    val endDate: Long,         // Unix timestamp in milliseconds
    val reason: String
)

// A data class for the response of a leave request.
data class LeaveRequest(
    val id: Long,
    val userId: Long,
    val leaveCategory: String,
    val leavePeriod: String,
    val startDate: Long,
    val endDate: Long,
    val reason: String,
    val status: String, // "PENDING", "APPROVED", "REJECTED"
    val appliedDate: Long?,
    val approvedDate: Long?,
    val comments: String?,
    val totalDays: Double?
    // ... other fields
)

// A generic wrapper for all API responses. This standardizes how you handle responses.
// The 'data' property is generic, so it can hold any type of data (a User, a List of Attendances, etc.).
data class ApiResponse<T>(
    val status: String, // "success" or "error"
    val message: String,
    val data: T?
)
```

## 5. Making API Calls (MVC Pattern)

Here's how to implement the MVC pattern for making API calls. We'll create separate Model, Controller, and View components. This separation of concerns makes the code more organized, easier to test, and maintain.

### Model Layer (Data Repository)

The Repository's job is to be the single source of truth for your app's data. It doesn't care where the data comes from (network, database, etc.), it just provides it to whoever asks.

**Why `withContext(Dispatchers.IO)`?**
- This is a key part of coroutines. It tells Kotlin, "Hey, this next bit of code involves network or disk I/O, so please run it on a background thread that's optimized for that." This keeps your app's UI from stuttering.

```kotlin
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

// The repository class is responsible for all data operations.
class HrRepository {
    
    // Create an instance of our ApiService.
    private val apiService = ApiClient.instance.create(ApiService::class.java)
    
    // Each function in the repository calls a corresponding function in the ApiService.
    // We use withContext(Dispatchers.IO) to ensure the network call happens on a background thread.
    suspend fun clockIn(userId: Long): ApiResponse<Map<String, Any>> {
        return withContext(Dispatchers.IO) {
            apiService.clockIn(userId)
        }
    }
    
    suspend fun clockOut(userId: Long): ApiResponse<Map<String, Any>> {
        return withContext(Dispatchers.IO) {
            apiService.clockOut(userId)
        }
    }
    
    suspend fun getUserById(userId: Long): ApiResponse<User> {
        return withContext(Dispatchers.IO) {
            apiService.getUserById(userId)
        }
    }
    
    suspend fun applyForLeave(leaveRequest: LeaveRequestDto): ApiResponse<LeaveRequest> {
        return withContext(Dispatchers.IO) {
            apiService.applyForLeave(leaveRequest)
        }
    }
    
    suspend fun getAttendanceHistory(userId: Long): ApiResponse<List<Attendance>> {
        return withContext(Dispatchers.IO) {
            apiService.getAttendanceHistory(userId)
        }
    }
}
```

### Controller Layer

The Controller is the "brains" of the operation. It responds to user input (like a button click), asks the Repository for data, and then tells the View what to show.

**Why `CoroutineScope(Dispatchers.Main)`?**
- We're creating a "scope" or a context for our coroutines that's tied to the main UI thread. This is important because you can only update the UI from the main thread.

**Why `try-catch-finally`?**
- This is your safety net. The `try` block is where you do the risky stuff (like network calls). The `catch` block is where you handle things if they go wrong (like a network error). The `finally` block is code that *always* runs, no matter what, which is perfect for things like hiding a loading spinner.

```kotlin
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

// The controller takes a reference to the View interface.
class HrController(private val view: HrView) {
    
    private val repository = HrRepository()
    // Create a coroutine scope for launching coroutines from the controller.
    // We use Dispatchers.Main because the controller will be updating the UI.
    private val controllerScope = CoroutineScope(Dispatchers.Main)
    
    fun clockInUser(userId: Long) {
        // Launch a new coroutine without blocking the current thread.
        controllerScope.launch {
            view.showLoading(true) // Show a loading indicator on the UI.
            try {
                // Get data from the repository (this happens on a background thread).
                val response = repository.clockIn(userId)
                // Switch back to the main thread to update the UI.
                withContext(Dispatchers.Main) {
                    if (response.status == "success") {
                        val data = response.data as? Map<String, Any>
                        val clockInTime = data?.get("clockInTime") as? Long
                        view.onClockInSuccess(clockInTime) // Update the UI with the result.
                    } else {
                        view.onError("Clock-in failed: ${response.message}") // Show an error message.
                    }
                }
            } catch (e: Exception) {
                // Handle exceptions, like network errors.
                withContext(Dispatchers.Main) {
                    view.onError("Network error: ${e.message}")
                }
            } finally {
                // This block always executes, whether there was an error or not.
                withContext(Dispatchers.Main) {
                    view.showLoading(false) // Hide the loading indicator.
                }
            }
        }
    }
    
    fun applyForLeave(userId: Long, reason: String) {
        controllerScope.launch {
            view.showLoading(true)
            try {
                // Example of creating a request object.
                val startTimestamp = System.currentTimeMillis()
                val endTimestamp = startTimestamp + (2 * 24 * 60 * 60 * 1000) // 2 days later
                
                val leaveDto = LeaveRequestDto(
                    userId = userId,
                    leaveCategory = "ANNUAL",
                    leavePeriod = "FULL_DAY",
                    startDate = startTimestamp,
                    endDate = endTimestamp,
                    reason = reason
                )
                
                val response = repository.applyForLeave(leaveDto)
                withContext(Dispatchers.Main) {
                    if (response.status == "success") {
                        view.onLeaveApplicationSuccess(response.data)
                    } else {
                        view.onError("Leave application failed: ${response.message}")
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    view.onError("Network error: ${e.message}")
                }
            } finally {
                withContext(Dispatchers.Main) {
                    view.showLoading(false)
                }
            }
        }
    }
    
    fun loadUserData(userId: Long) {
        controllerScope.launch {
            view.showLoading(true)
            try {
                val response = repository.getUserById(userId)
                withContext(Dispatchers.Main) {
                    if (response.status == "success") {
                        view.displayUserData(response.data)
                    } else {
                        view.onError("Failed to load user data: ${response.message}")
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    view.onError("Network error: ${e.message}")
                }
            }
        } finally {
            withContext(Dispatchers.Main) {
                view.showLoading(false)
            }
        }
    }
}
```

### View Interface

This interface is like a contract. It says, "Any screen that wants to be a 'HrView' *must* know how to do these things (like show a loading spinner or display an error)." This helps keep your code clean and makes it easy to test your Controller without needing a real screen.

**Why an Interface?**
- It's a core principle of good software design. It separates the "what" (the contract) from the "how" (the implementation). This makes your code more flexible and easier to change later.

```kotlin
// This interface defines the contract between the Controller and the View.
// The Activity or Fragment will implement this interface.
interface HrView {
    fun showLoading(isLoading: Boolean)
    fun onError(message: String)
    fun onClockInSuccess(clockInTime: Long?)
    fun onLeaveApplicationSuccess(leaveRequest: LeaveRequest?)
    fun displayUserData(user: User?)
}
```

### Activity/Fragment Implementation (View Layer)

This is your actual screen. Its main job is to look pretty and tell the Controller when the user does something. It implements the `HrView` interface, promising to fulfill the contract we defined earlier.

**Why delegate to the Controller?**
- This keeps your Activity/Fragment code simple and focused on UI stuff. All the complex logic lives in the Controller, making your code much easier to read, debug, and test.

```kotlin
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.widget.Button
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import android.view.View

// The MainActivity implements the HrView interface.
class MainActivity : AppCompatActivity(), HrView {
    
    private lateinit var controller: HrController
    private lateinit var loadingIndicator: ProgressBar
    private lateinit var clockInButton: Button
    private lateinit var applyLeaveButton: Button
    private lateinit var userInfoText: TextView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Create the controller, passing a reference to this activity (the view).
        controller = HrController(this)
        initViews()
        setupClickListeners()
    }
    
    private fun initViews() {
        loadingIndicator = findViewById(R.id.loading_indicator)
        clockInButton = findViewById(R.id.btn_clock_in)
        applyLeaveButton = findViewById(R.id.btn_apply_leave)
        userInfoText = findViewById(R.id.tv_user_info)
    }
    
    private fun setupClickListeners() {
        // When a button is clicked, call the corresponding method in the controller.
        clockInButton.setOnClickListener {
            controller.clockInUser(1L) // Replace with actual user ID
        }
        
        applyLeaveButton.setOnClickListener {
            controller.applyForLeave(1L, "Annual vacation") // Replace with actual user ID and reason
        }
        
        // Load initial data when the activity starts.
        controller.loadUserData(1L)
    }
    
    // --- HrView interface implementations ---
    // These methods are called by the controller to update the UI.
    
    override fun showLoading(isLoading: Boolean) {
        loadingIndicator.visibility = if (isLoading) View.VISIBLE else View.GONE
        clockInButton.isEnabled = !isLoading
        applyLeaveButton.isEnabled = !isLoading
    }
    
    override fun onError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }
    
    override fun onClockInSuccess(clockInTime: Long?) {
        Toast.makeText(this, "Successfully clocked in at: $clockInTime", Toast.LENGTH_SHORT).show()
    }
    
    override fun onLeaveApplicationSuccess(leaveRequest: LeaveRequest?) {
        Toast.makeText(this, "Leave submitted successfully with ID: ${leaveRequest?.id}", Toast.LENGTH_SHORT).show()
    }
    
    override fun displayUserData(user: User?) {
        user?.let {
            userInfoText.text = "Welcome, ${it.firstName} ${it.lastName}\nDepartment: ${it.department}"
        }
    }
}
```

---

# (ภาษาไทย)

## 1. ตั้งค่า Dependencies

ก่อนอื่นเลย เราต้องเพิ่มเครื่องมือที่จำเป็นลงในโปรเจกต์ของเราก่อนในไฟล์ `build.gradle.kts` (หรือ `build.gradle`) เครื่องมือเหล่านี้จะช่วยเราคุยกับเซิร์ฟเวอร์และจัดการข้อมูลที่ได้กลับมา

**เครื่องมือเหล่านี้คืออะไร?**
- **Retrofit**: คิดซะว่า Retrofit คือบุรุษไปรษณีย์ส่วนตัวของเราสำหรับแอป มันช่วยให้การส่งคำขอและรับข้อมูลจากเซิร์ฟเวอร์เป็นเรื่องง่ายและเป็นระเบียบ
- **Gson**: นี่คือล่ามคู่ใจของ Retrofit ข้อมูลที่ได้จากเซิร์ฟเวอร์มักจะมาในรูปแบบที่เรียกว่า JSON ซึ่ง Gson จะช่วยแปล JSON เหล่านี้ให้เป็น Kotlin object ที่เราเอาไปใช้งานต่อในโค้ดได้เลย
- **OkHttp Logging Interceptor**: เหมือนเรามีแว่นเอ็กซเรย์สำหรับดูการสื่อสารทางเน็ตเวิร์ก มันจะแสดงให้เราเห็นทุกอย่างที่เราส่งไปและรับกลับมา ซึ่งมีประโยชน์สุดๆ เวลาที่เราหาสาเหตุว่าทำไมแอปไม่ทำงาน
- **Kotlin Coroutines**: นี่คือสุดยอดอาวุธลับที่จะทำให้แอปของเราลื่นไหล ไม่ค้าง การคุยกับเซิร์ฟเวอร์อาจใช้เวลาสักครู่ Coroutines จะช่วยให้เราทำงานนี้เบื้องหลังได้แบบเนียนๆ โดยที่หน้าจอแอปไม่หยุดทำงาน

```kotlin
// ในไฟล์ build.gradle.kts (Module :app)

dependencies {
    // Retrofit สำหรับการเชื่อมต่อเน็ตเวิร์ก (ไลบรารีหลัก)
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    // ตัวแปลงสำหรับ Gson ซึ่งทำหน้าที่แปลง JSON
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    
    // OkHttp สำหรับการแสดง log (ตัวเลือกเสริม แต่แนะนำอย่างยิ่งเพื่อการดีบัก)
    // ช่วยให้คุณเห็น request และ response ดิบๆ ใน Logcat
    implementation("com.squareup.okhttp3:logging-interceptor:4.9.3")
    
    // Kotlin Coroutines สำหรับจัดการ background threads สำหรับ network calls
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.1")
}
```

## 2. สร้าง Retrofit Instance

เราจะสร้าง `ApiClient` ให้เป็น object เดียว (Singleton) เพื่อจัดการ Retrofit instance ทั้งหมดในแอป การทำแบบนี้จะช่วยให้แอปทำงานได้มีประสิทธิภาพมากขึ้น และอย่าลืมเปลี่ยน `your-server-ip` เป็น IP ของเซิร์ฟเวอร์จริงๆ ด้วยนะ

**ทำไมต้องเป็น Singleton?**
- ลองนึกภาพว่าเรามีที่ทำการไปรษณีย์หลักแค่แห่งเดียวในเมือง แทนที่จะต้องสร้างใหม่ทุกครั้งที่อยากส่งจดหมาย เราก็แค่ไปใช้ที่เดิมที่มีอยู่แล้ว มันเร็วกว่าเยอะ! Singleton ก็เหมือนกัน คือการสร้าง `ApiClient` แค่ครั้งเดียวแล้วใช้ร่วมกันทั้งแอป

**ทำไมต้อง `by lazy`?**
- นี่เป็นเทคนิคเจ๋งๆ ของ Kotlin ที่บอกว่า "ยังไม่ต้องสร้าง Retrofit นะ รอจนกว่าจะมีคนเรียกใช้ครั้งแรกจริงๆ ค่อยสร้าง" ซึ่งช่วยให้แอปของเราเปิดตัวได้เร็วขึ้นนิดหน่อย

```kotlin
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

// Singleton object สำหรับเก็บ Retrofit instance ของเรา
object ApiClient {

    //สำคัญ: เปลี่ยนเป็น IP address หรือโดเมนของเซิร์ฟเวอร์ของคุณ
    // นี่คือ URL พื้นฐานสำหรับ API call ทั้งหมด
    private const val BASE_URL = "http://your-server-ip:8080/lazyhr/"

    // สร้าง logging interceptor เพื่อดูรายละเอียด request/response ใน Logcat
    // ซึ่งช่วยในการดีบักปัญหาเน็ตเวิร์กได้มาก
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY // แสดง log ทั้งหมดของ request และ response body
    }

    // สร้าง OkHttpClient และเพิ่ม logging interceptor
    // OkHttp คือ HTTP client ที่อยู่เบื้องหลัง Retrofit
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .build()

    // สร้าง Retrofit instance โดยใช้ 'lazy' delegate
    // หมายความว่า instance จะถูกสร้างเมื่อถูกเรียกใช้ครั้งแรกเท่านั้น
    val instance: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL) // กำหนด URL พื้นฐานสำหรับ request ทั้งหมด
            .client(okHttpClient) // ใช้ OkHttpClient ที่เราปรับแต่งเองพร้อมกับ logger
            .addConverterFactory(GsonConverterFactory.create()) // ใช้ Gson ในการจัดการ JSON
            .build()
    }
}
```

## 3. กำหนด API Interface

สร้าง Interface เพื่อกำหนดว่าเราจะคุยกับ API endpoint ไหนได้บ้าง เหมือนกับการสร้างเมนูอาหาร Retrofit จะจัดการเรื่องการ "ปรุงอาหาร" หรือการเรียก API ให้เราเอง

**ทำไมต้องเป็น Interface?**
- มันเหมือนการสร้างเมนูอาหาร เราแค่บอกว่ามี "เมนู" (API call) อะไรบ้าง แต่ไม่ต้องไปยุ่งกับ "วิธีทำ" ในครัว Retrofit จะจัดการเรื่องยากๆ ให้เราเอง เป็นวิธีที่สะอาดและเป็นระเบียบมาก

**ทำไมต้อง `suspend`?**
- คำสั้นๆ นี้มีความหมายมาก มันบอก Kotlin ว่าฟังก์ชันนี้อาจจะใช้เวลาสักพัก (เช่น การเรียก API) และอนุญาตให้ "หยุดรอ" แล้วค่อยกลับมาทำต่อได้ โดยไม่ทำให้แอปค้าง นี่คือหัวใจของการทำงานของ Coroutines

```kotlin
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {

    // --- ส่วนจัดการผู้ใช้ ---
    // @GET กำหนด HTTP GET request ส่วน string คือ path ที่ต่อจาก base URL
    // @Path จะแทนที่ {userId} ใน URL ด้วยค่าของพารามิเตอร์ userId
    @GET("api/users/{userId}")
    suspend fun getUserById(@Path("userId") userId: Long): ApiResponse<User>

    // --- ส่วนจัดการการลงเวลา ---
    // @POST กำหนด HTTP POST request
    // @Query จะเพิ่ม query parameter เข้าไปใน URL (เช่น /clock-in?userId=1)
    @POST("api/attendance/clock-in")
    suspend fun clockIn(@Query("userId") userId: Long): ApiResponse<Map<String, Any>>

    @POST("api/attendance/clock-out")
    suspend fun clockOut(@Query("userId") userId: Long): ApiResponse<Map<String, Any>>

    @GET("api/attendance/today/{userId}")
    suspend fun getTodayAttendance(@Path("userId") userId: Long): ApiResponse<Attendance?>

    @GET("api/attendance/user/{userId}")
    suspend fun getUserAttendance(
        @Path("userId") userId: Long,
        @Query("startTimestamp") startTimestamp: Long,
        @Query("endTimestamp") endTimestamp: Long
    ): ApiResponse<List<Attendance>>

    @GET("api/attendance/history/{userId}")
    suspend fun getAttendanceHistory(@Path("userId") userId: Long): ApiResponse<List<Attendance>>

    // --- ส่วนจัดการการลา ---
    // @Body บอกให้ Retrofit แปลง object leaveRequest เป็น JSON ใน request body
    @POST("api/leave/apply")
    suspend fun applyForLeave(@Body leaveRequest: LeaveRequestDto): ApiResponse<LeaveRequest>

    @GET("api/leave/user/{userId}")
    suspend fun getUserLeaves(@Path("userId") userId: Long): ApiResponse<List<LeaveRequest>>

    @POST("api/leave/{leaveId}/approve")
    suspend fun approveLeave(
        @Path("leaveId") leaveId: Long,
        @Query("approverId") approverId: Long,
        @Query("comments") comments: String?
    ): ApiResponse<LeaveRequest>
}
```

## 4. สร้าง Data Classes (DTOs)

สร้าง `data class` ใน Kotlin เพื่อเป็นโมเดลสำหรับข้อมูลที่เราจะรับส่งกับเซิร์ฟเวอร์ ชื่อ property ในคลาสควรจะตรงกับชื่อ key ใน JSON

**ทำไมต้องเป็น `data class`?**
- `data class` คือความสามารถพิเศษของ Kotlin เราแค่ประกาศว่าอยากเก็บข้อมูลอะไรบ้าง แล้ว Kotlin จะเขียนโค้ดน่าเบื่อๆ ให้เราเองหมดเลย (เช่น `toString()`, `equals()`) ทำให้โค้ดเราสั้นและสะอาดตา

**ทำไมต้องตั้งชื่อให้ตรงกับ JSON?**
- เพื่อให้ Gson ทำงานได้ง่ายๆ ถ้าชื่อ property ใน data class ของเราตรงกับชื่อ key ใน JSON, Gson จะสามารถแปลงข้อมูลไปมาได้เองโดยอัตโนมัติ เหมือนมีเวทมนตร์เลย!

```kotlin
// data class สำหรับเก็บข้อมูล User ชื่อ property จะตรงกับ key ใน JSON
data class User(
    val id: Long,
    val username: String,
    val email: String,
    val firstName: String,
    val lastName: String,
    val employeeId: String,
    val department: String?,
    val position: String?,
    val hireDate: Long?, // Unix timestamp หน่วยเป็นมิลลิวินาที
    val salary: Double?,
    val role: String, // "ADMIN", "MANAGER", "EMPLOYEE"
    val isActive: Boolean = true
    // ... ฟิลด์อื่นๆ
)

// data class สำหรับ Attendance
data class Attendance(
    val id: Long,
    val attendanceDate: Long, // Timestamp ของเวลาเริ่มต้นของวัน
    val clockInTime: Long?,   // Timestamp ของเวลาที่ลงชื่อเข้างาน
    val clockOutTime: Long?,  // Timestamp ของเวลาที่ลงชื่อออกงาน
    val totalHours: Double?,
    val overtimeHours: Double? = 0.0,
    val status: String, // "PRESENT", "ABSENT", "LATE", "HALF_DAY"
    val notes: String?,
    val breakDurationMinutes: Int? = 0
    // ... ฟิลด์อื่นๆ
)

// Data Transfer Object (DTO) สำหรับสร้างคำขอลา
// เป็น best practice ที่จะใช้ DTO สำหรับ request body เพื่อควบคุมข้อมูลที่จะส่ง
data class LeaveRequestDto(
    val userId: Long,
    val leaveCategory: String, // "ANNUAL", "PRIVATE", "SICK", "SPECIAL_HOLIDAY"
    val leavePeriod: String,   // "AM", "PM", "FULL_DAY"
    val startDate: Long,       // Unix timestamp หน่วยเป็นมิลลิวินาที
    val endDate: Long,         // Unix timestamp หน่วยเป็นมิลลิวินาที
    val reason: String
)

// data class สำหรับ response ของคำขอลา
data class LeaveRequest(
    val id: Long,
    val userId: Long,
    val leaveCategory: String,
    val leavePeriod: String,
    val startDate: Long,
    val endDate: Long,
    val reason: String,
    val status: String, // "PENDING", "APPROVED", "REJECTED"
    val appliedDate: Long?,
    val approvedDate: Long?,
    val comments: String?,
    val totalDays: Double?
    // ... ฟิลด์อื่นๆ
)

// โครงสร้าง API Response มาตรฐาน
// 'data' property เป็น generic ทำให้สามารถเก็บข้อมูลประเภทใดก็ได้ (User, List<Attendance>, etc.)
data class ApiResponse<T>(
    val status: String, // "success" หรือ "error"
    val message: String,
    val data: T?
)
```

## 5. การเรียกใช้งาน API (รูปแบบ MVC)

เราจะใช้สถาปัตยกรรมแบบ MVC (Model-View-Controller) ในการเรียก API ซึ่งจะช่วยแยกโค้ดออกเป็นส่วนๆ ทำให้จัดการง่าย ทดสอบง่าย และดูแลรักษาง่ายในระยะยาว

### ชั้น Model (Data Repository)

Repository คือ "แหล่งข้อมูลกลาง" ของแอปเรา มีหน้าที่ไปหาข้อมูลมาให้ ไม่ว่าข้อมูลนั้นจะมาจากเน็ตเวิร์กหรือจากฐานข้อมูลในเครื่องก็ตาม

**ทำไมต้อง `withContext(Dispatchers.IO)`?**
- นี่คือส่วนสำคัญของ Coroutines ที่บอกว่า "โค้ดส่วนนี้เป็นการคุยกับเน็ตเวิร์กนะ ช่วยย้ายไปทำงานบน background thread ที่เหมาะกับงานแบบนี้ให้หน่อย" เพื่อไม่ให้หน้าจอแอปของเราค้าง

```kotlin
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

// คลาส Repository รับผิดชอบการดำเนินการเกี่ยวกับข้อมูลทั้งหมด
class HrRepository {
    
    // สร้าง instance ของ ApiService
    private val apiService = ApiClient.instance.create(ApiService::class.java)
    
    // แต่ละฟังก์ชันใน repository จะเรียกฟังก์ชันที่สอดคล้องกันใน ApiService
    // เราใช้ withContext(Dispatchers.IO) เพื่อให้แน่ใจว่า network call เกิดขึ้นบน background thread
    suspend fun clockIn(userId: Long): ApiResponse<Map<String, Any>> {
        return withContext(Dispatchers.IO) {
            apiService.clockIn(userId)
        }
    }
    
    suspend fun clockOut(userId: Long): ApiResponse<Map<String, Any>> {
        return withContext(Dispatchers.IO) {
            apiService.clockOut(userId)
        }
    }
    
    suspend fun getUserById(userId: Long): ApiResponse<User> {
        return withContext(Dispatchers.IO) {
            apiService.getUserById(userId)
        }
    }
    
    suspend fun applyForLeave(leaveRequest: LeaveRequestDto): ApiResponse<LeaveRequest> {
        return withContext(Dispatchers.IO) {
            apiService.applyForLeave(leaveRequest)
        }
    }
    
    suspend fun getAttendanceHistory(userId: Long): ApiResponse<List<Attendance>> {
        return withContext(Dispatchers.IO) {
            apiService.getAttendanceHistory(userId)
        }
    }
}
```

### ชั้น Controller

Controller คือ "สมอง" ของการทำงาน มันจะรับคำสั่งจากผู้ใช้ (เช่น การกดปุ่ม), ไปขอข้อมูลจาก Repository, แล้วก็สั่งให้ View (หน้าจอ) แสดงผลลัพธ์

**ทำไมต้อง `CoroutineScope(Dispatchers.Main)`?**
- เรากำลังสร้าง "ขอบเขต" การทำงานของ Coroutine ที่ผูกกับ Main Thread ซึ่งเป็น thread เดียวที่สามารถอัปเดตหน้าจอ UI ได้

**ทำไมต้อง `try-catch-finally`?**
- นี่คือตาข่ายนิรภัยของเรา! บล็อก `try` คือที่ที่เราทำสิ่งที่เสี่ยง (เช่น เรียก API), `catch` คือที่ที่เราจัดการเมื่อเกิดข้อผิดพลาด, และ `finally` คือโค้ดที่จะทำงาน *เสมอ* ไม่ว่าจะสำเร็จหรือล้มเหลว เหมาะสำหรับซ่อน loading spinner

```kotlin
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

// Controller จะรับ reference ของ View interface
class HrController(private val view: HrView) {
    
    private val repository = HrRepository()
    // สร้าง coroutine scope สำหรับการ launch coroutine จาก controller
    // เราใช้ Dispatchers.Main เพราะ controller จะต้องอัปเดต UI
    private val controllerScope = CoroutineScope(Dispatchers.Main)
    
    fun clockInUser(userId: Long) {
        // Launch coroutine ใหม่โดยไม่บล็อก thread ปัจจุบัน
        controllerScope.launch {
            view.showLoading(true) // แสดง loading indicator บน UI
            try {
                // ดึงข้อมูลจาก repository (ซึ่งจะทำงานบน background thread)
                val response = repository.clockIn(userId)
                // สลับกลับมาที่ main thread เพื่ออัปเดต UI
                withContext(Dispatchers.Main) {
                    if (response.status == "success") {
                        val data = response.data as? Map<String, Any>
                        val clockInTime = data?.get("clockInTime") as? Long
                        view.onClockInSuccess(clockInTime) // อัปเดต UI ด้วยผลลัพธ์
                    } else {
                        view.onError("การลงเวลาเข้างานล้มเหลว: ${response.message}") // แสดงข้อความผิดพลาด
                    }
                }
            } catch (e: Exception) {
                // จัดการกับ exception เช่น network error
                withContext(Dispatchers.Main) {
                    view.onError("ข้อผิดพลาดเครือข่าย: ${e.message}")
                }
            } finally {
                // บล็อกนี้จะทำงานเสมอ ไม่ว่าจะเกิด error หรือไม่
                withContext(Dispatchers.Main) {
                    view.showLoading(false)
                }
            }
        }
    }
    
    fun applyForLeave(userId: Long, reason: String) {
        controllerScope.launch {
            view.showLoading(true)
            try {
                // ตัวอย่างการสร้าง request object
                val startTimestamp = System.currentTimeMillis()
                val endTimestamp = startTimestamp + (2 * 24 * 60 * 60 * 1000) // 2 วันถัดไป
                
                val leaveDto = LeaveRequestDto(
                    userId = userId,
                    leaveCategory = "ANNUAL",
                    leavePeriod = "FULL_DAY",
                    startDate = startTimestamp,
                    endDate = endTimestamp,
                    reason = reason
                )
                
                val response = repository.applyForLeave(leaveDto)
                withContext(Dispatchers.Main) {
                    if (response.status == "success") {
                        view.onLeaveApplicationSuccess(response.data)
                    } else {
                        view.onError("การยื่นใบลาล้มเหลว: ${response.message}")
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    view.onError("ข้อผิดพลาดเครือข่าย: ${e.message}")
                }
            } finally {
                withContext(Dispatchers.Main) {
                    view.showLoading(false)
                }
            }
        }
    }
    
    fun loadUserData(userId: Long) {
        controllerScope.launch {
            view.showLoading(true)
            try {
                val response = repository.getUserById(userId)
                withContext(Dispatchers.Main) {
                    if (response.status == "success") {
                        view.displayUserData(response.data)
                    } else {
                        view.onError("โหลดข้อมูลผู้ใช้ล้มเหลว: ${response.message}")
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    view.onError("ข้อผิดพลาดเครือข่าย: ${e.message}")
                }
            } finally {
                withContext(Dispatchers.Main) {
                    view.showLoading(false)
                }
            }
        }
    }
}
```

### View Interface

Interface นี้เปรียบเสมือน "สัญญาใจ" ที่บอกว่า "หน้าจอไหนก็ตามที่อยากจะเป็น `HrView` จะต้องทำสิ่งเหล่านี้ได้นะ (เช่น แสดง loading, แสดง error)" ซึ่งช่วยให้โค้ดเราสะอาดและทดสอบ Controller ได้ง่ายโดยไม่ต้องมีหน้าจอจริงๆ

**ทำไมต้องเป็น Interface?**
- เป็นหลักการพื้นฐานของการออกแบบซอฟต์แวร์ที่ดี มันช่วยแยก "สิ่งที่ต้องทำ" (สัญญา) ออกจาก "วิธีทำ" (implementation) ทำให้โค้ดของเรายืดหยุ่นและแก้ไขได้ง่ายในอนาคต

```kotlin
// interface นี้กำหนด contract ระหว่าง Controller และ View
// Activity หรือ Fragment จะ implement interface นี้
interface HrView {
    fun showLoading(isLoading: Boolean)
    fun onError(message: String)
    fun onClockInSuccess(clockInTime: Long?)
    fun onLeaveApplicationSuccess(leaveRequest: LeaveRequest?)
    fun displayUserData(user: User?)
}
```

### การใช้งานใน Activity/Fragment (ชั้น View)

นี่คือหน้าจอ UI ของเราจริงๆ หน้าที่หลักของมันคือแสดงผลให้สวยงามและแจ้ง Controller เมื่อผู้ใช้ทำอะไรบางอย่าง มันจะ implement `HrView` interface เพื่อรักษาสัญญาที่เราได้ให้ไว้

**ทำไมต้องมอบหมายให้ Controller?**
- เพื่อให้โค้ดใน Activity/Fragment ของเราเรียบง่ายและโฟกัสไปที่เรื่อง UI เท่านั้น ส่วน logic ที่ซับซ้อนจะไปอยู่ใน Controller ทำให้โค้ดทั้งหมดอ่านง่าย, ดีบักง่าย, และทดสอบง่ายขึ้นเยอะ

```kotlin
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.widget.Button
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import android.view.View

// MainActivity จะ implement HrView interface
class MainActivity : AppCompatActivity(), HrView {
    
    private lateinit var controller: HrController
    private lateinit var loadingIndicator: ProgressBar
    private lateinit var clockInButton: Button
    private lateinit var applyLeaveButton: Button
    private lateinit var userInfoText: TextView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // สร้าง controller โดยส่ง reference ของ activity นี้ (view) ไปด้วย
        controller = HrController(this)
        initViews()
        setupClickListeners()
    }
    
    private fun initViews() {
        loadingIndicator = findViewById(R.id.loading_indicator)
        clockInButton = findViewById(R.id.btn_clock_in)
        applyLeaveButton = findViewById(R.id.btn_apply_leave)
        userInfoText = findViewById(R.id.tv_user_info)
    }
    
    private fun setupClickListeners() {
        // เมื่อปุ่มถูกคลิก ให้เรียกเมธอดที่สอดคล้องกันใน controller
        clockInButton.setOnClickListener {
            controller.clockInUser(1L) // เปลี่ยนเป็น user ID จริง
        }
        
        applyLeaveButton.setOnClickListener {
            controller.applyForLeave(1L, "พักร้อนประจำปี") // เปลี่ยนเป็น user ID และเหตุผลจริง
        }
        
        // โหลดข้อมูลเริ่มต้นเมื่อ activity เริ่มทำงาน
        controller.loadUserData(1L)
    }
    
    // --- การ implement HrView interface ---
    // เมธอดเหล่านี้จะถูกเรียกโดย controller เพื่ออัปเดต UI
    
    override fun showLoading(isLoading: Boolean) {
        loadingIndicator.visibility = if (isLoading) View.VISIBLE else View.GONE
        clockInButton.isEnabled = !isLoading
        applyLeaveButton.isEnabled = !isLoading
    }
    
    override fun onError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }
    
    override fun onClockInSuccess(clockInTime: Long?) {
        Toast.makeText(this, "ลงเวลาเข้างานสำเร็จเวลา: $clockInTime", Toast.LENGTH_SHORT).show()
    }
    
    override fun onLeaveApplicationSuccess(leaveRequest: LeaveRequest?) {
        Toast.makeText(this, "ยื่นใบลาสำเร็จ รหัสคำขอ: ${leaveRequest?.id}", Toast.LENGTH_SHORT).show()
    }
    
    override fun displayUserData(user: User?) {
        user?.let {
            userInfoText.text = "ยินดีต้อนรับ, ${it.firstName} ${it.lastName}\nแผนก: ${it.department}"
        }
    }
}

```

