package com.example.backend.controller;

import com.example.backend.model.PomodoroSession;
import com.example.backend.service.PomodoroSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/sessions")
public class PomodoroSessionController {

    @Autowired
    private PomodoroSessionService sessionService;

    @PostMapping("/{userId}")
    public ResponseEntity<PomodoroSession> saveSession(@PathVariable Long userId, @RequestBody PomodoroSession session) {
        return ResponseEntity.ok(sessionService.saveSession(userId, session));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<PomodoroSession>> getUserSessions(@PathVariable Long userId) {
        return ResponseEntity.ok(sessionService.getSessionsByUser(userId));
    }
}