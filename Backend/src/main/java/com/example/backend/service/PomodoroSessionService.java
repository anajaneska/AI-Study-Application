package com.example.backend.service;

import com.example.backend.model.PomodoroSession;

import java.util.List;
import java.util.Optional;

public interface PomodoroSessionService {
    public PomodoroSession saveSession(String email, PomodoroSession session);
    public List<PomodoroSession> getSessionsByUser(String email);
}
