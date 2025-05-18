package com.example.backend.controller;

import com.example.backend.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/toggleIsDone/{taskId}")
    public ResponseEntity<Boolean> toggleIsDone(@PathVariable Long taskId) {
        boolean isDone = taskService.toggleIsDone(taskId);
        return ResponseEntity.ok(isDone);
    }

    @DeleteMapping("/deleteTask/{taskId}")
    public ResponseEntity<Boolean> deleteTask( @PathVariable Long taskId, Authentication authentication) {
        String email = authentication.getName();
        taskService.deleteTaskById(email, taskId);
        return ResponseEntity.ok(true);
    }
}
