package com.example.backend.service;

public interface TaskService {
    boolean toggleIsDone(Long taskId);

    void deleteTaskById(String userEmail, Long taskId);
}
