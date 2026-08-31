package com.github.rhomard.task_manager.controller;

import com.github.rhomard.task_manager.exception.TaskNotFoundException;
import com.github.rhomard.task_manager.model.Task;
import com.github.rhomard.task_manager.model.User;
import com.github.rhomard.task_manager.repository.TaskRepository;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public List<Task> getAllTasks(@AuthenticationPrincipal User user) {
        return taskRepository.findByUser(user);
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
        checkOwnership(task, user);
        return task;
    }

    @PostMapping
    public Task createTask(@Valid @RequestBody Task task, @AuthenticationPrincipal User user) {
        task.setUser(user);
        return taskRepository.save(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @Valid @RequestBody Task updatedTask, @AuthenticationPrincipal User user) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
        checkOwnership(task, user);
        task.setTitre(updatedTask.getTitre());
        task.setDescription(updatedTask.getDescription());
        task.setTermine(updatedTask.isTermine());
        return taskRepository.save(task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
        checkOwnership(task, user);
        taskRepository.deleteById(id);
    }

    private void checkOwnership(Task task, User user) {
        if (task.getUser() == null || !task.getUser().getId().equals(user.getId())) {
            throw new TaskNotFoundException(task.getId());
        }
    }
}