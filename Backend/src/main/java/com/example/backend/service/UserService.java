package com.example.backend.service;

import com.example.backend.model.Task;
import com.example.backend.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();
    Optional<User> getUserById(Long id);
    User createUser(User user);
    Optional<User> updateUser(Long id, User userDetails);
    boolean deleteUser(Long id);
    Optional<User> loginUser(String email, String rawPassword);
    Task createTask(String email, Task task);
    List<Task> getTasksByUserEmail(String email);
    void deleteTaskById(String userEmail, Long taskId);
}
