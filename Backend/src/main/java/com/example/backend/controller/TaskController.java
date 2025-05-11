package com.example.backend.controller;

import com.example.backend.service.TaskService;
import org.springframework.http.ResponseEntity;
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

    @DeleteMapping("/deleteTask/{userId}/{taskId}")
    public ResponseEntity<Boolean> deleteTask(@PathVariable Long userId, @PathVariable Long taskId) {
        taskService.deleteTaskById(userId, taskId);
        return ResponseEntity.ok(true);
    }
}
