package com.example.backend.service.impl;

import com.example.backend.model.PomodoroSession;
import com.example.backend.model.User;
import com.example.backend.repository.PomodoroSessionRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.PomodoroSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PomodoroSessionServiceImpl implements PomodoroSessionService {
    @Autowired
    private PomodoroSessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public PomodoroSession saveSession(Long userId, PomodoroSession session) {
        Optional<User> user = userRepository.findById(userId);
        user.ifPresent(session::setUser);

        if (session.getStartTime() != null && session.getDuration() > 0) {
            session.setEndTime(session.getStartTime().plusMinutes(session.getDuration()));
        }

        return sessionRepository.save(session);
    }


    public List<PomodoroSession> getSessionsByUser(Long userId) {
        return sessionRepository.findByUserId(userId);
    }
}