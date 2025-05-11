package com.example.backend.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

/**
 * Entity class representing a user in the database.
 * Maps to the 'users' table with the following structure:
 * 
 * Table: users
 * - id: BIGINT (Primary Key, Auto-generated)
 * - username: VARCHAR (NOT NULL, UNIQUE)
 * - email: VARCHAR (NOT NULL, UNIQUE)
 * - password: VARCHAR (NOT NULL)
 * - name: VARCHAR (NOT NULL)
 * 
 * Related tables:
 * - user_summaries: Many-to-Many relationship with summaries
 * - user_tasks: Many-to-Many relationship with tasks
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @ManyToMany
    @JoinTable(
        name = "user_summaries",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "summary_id")
    )
    private List<Summary> summaries = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "user_tasks",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "task_id")
    )
    private List<Task> tasks = new ArrayList<>();

    public User() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Summary> getSummaries() {
        return summaries;
    }

    public void setSummaries(List<Summary> summaries) {
        this.summaries = summaries;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}
