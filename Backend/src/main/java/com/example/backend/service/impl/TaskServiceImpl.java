package com.example.backend.service.impl;

import com.example.backend.repository.TaskRepository;
import com.example.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TaskServiceImpl implements TaskService {
    @Autowired
    private final TaskRepository taskRepository;

    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public boolean toggleIsDone(Long taskId) {
        var task = taskRepository.findById(taskId).get();
        task.setDone(!task.isDone());
        taskRepository.save(task);
        return task.isDone();
    }
}
