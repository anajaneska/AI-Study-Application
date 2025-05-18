package com.example.backend.service.impl;

import com.example.backend.repository.TaskRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.TaskService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TaskServiceImpl implements TaskService {
    @Autowired
    private final TaskRepository taskRepository;
    @Autowired
    private final UserService userService;

    public TaskServiceImpl(TaskRepository taskRepository, UserService userService) {
        this.taskRepository = taskRepository;
        this.userService = userService;
    }

    @Override
    public boolean toggleIsDone(Long taskId) {
        var task = taskRepository.findById(taskId).get();
        task.setDone(!task.isDone());
        taskRepository.save(task);
        return task.isDone();
    }

    @Override
    public void deleteTaskById(String userEmail, Long taskId) {
        userService.deleteTaskById(userEmail, taskId);
        taskRepository.deleteById(taskId);
    }
}
