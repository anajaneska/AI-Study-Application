package com.example.backend.controller;

import com.example.backend.configs.JwtConfig;
import com.example.backend.model.Task;
import com.example.backend.model.User;
import com.example.backend.service.TaskService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final JwtConfig jwtConfig;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    @Autowired
    public UserController(JwtConfig jwtConfig, AuthenticationManager authenticationManager, UserService userService) {
        this.jwtConfig = jwtConfig;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userService.updateUser(id, userDetails)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        User savedUser = userService.createUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("username");
        String password = credentials.get("password");
//        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        String token = jwtConfig.generateToken(email);

        return userService.loginUser(email, password)
                .map(user -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("id", String.valueOf(user.getId()));
                    response.put("token", token);
                    response.put("email", user.getEmail());
                    response.put("message", "Login successful");
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Invalid credentials");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                });
    }

    @PostMapping("/addTask")
    public ResponseEntity<Task> addTaskForUser(@RequestBody Task task, Authentication authentication) {
        String email = authentication.getName();
        Task createdTask = userService.createTask(email, task);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @GetMapping("/getUserTasks")
    public ResponseEntity<List<Task>> getUserTasks(Authentication authentication) {
        String email = authentication.getName();
        List<Task> tasks = userService.getTasksByUserEmail(email);
        return ResponseEntity.ok(tasks);
    }
}
