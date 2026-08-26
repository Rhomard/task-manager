package com.github.rhomard.task_manager.controller;

import com.github.rhomard.task_manager.model.Task;
import com.github.rhomard.task_manager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    // GET /api/tasks -> liste toutes les tâches
    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // GET /api/tasks/{id} -> une tâche précise
    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    // POST /api/tasks -> crée une tâche
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    // PUT /api/tasks/{id} -> modifie une tâche
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        return taskRepository.findById(id).map(task -> {
            task.setTitre(updatedTask.getTitre());
            task.setDescription(updatedTask.getDescription());
            task.setTermine(updatedTask.isTermine());
            return taskRepository.save(task);
        }).orElse(null);
    }

    // DELETE /api/tasks/{id} -> supprime une tâche
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }
}