package com.example.backend.controller;

import com.example.backend.model.PomodoroSession;
import com.example.backend.service.PomodoroSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/sessions")
public class PomodoroSessionController {

    @Autowired
    private PomodoroSessionService sessionService;

    @PostMapping("")
    public ResponseEntity<PomodoroSession> saveSession(@RequestBody PomodoroSession session, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(sessionService.saveSession(email, session));
    }

    @GetMapping("")
    public ResponseEntity<List<PomodoroSession>> getUserSessions(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(sessionService.getSessionsByUser(email));
    }
}