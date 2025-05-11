package com.example.backend.service;

import com.example.backend.model.PomodoroSession;

import java.util.List;
import java.util.Optional;

public interface PomodoroSessionService {
    public PomodoroSession saveSession(Long userId, PomodoroSession session);
    public List<PomodoroSession> getSessionsByUser(Long userId);
}
