package com.github.rhomard.task_manager.controller;

import com.github.rhomard.task_manager.exception.TaskNotFoundException;
import com.github.rhomard.task_manager.model.Task;
import com.github.rhomard.task_manager.model.User;
import com.github.rhomard.task_manager.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskControllerTest {

    @Mock
    private TaskRepository taskRepository;

    private TaskController taskController;

    private User owner;
    private User otherUser;

    @BeforeEach
    void setUp() {
        taskController = new TaskController(taskRepository);

        owner = new User();
        owner.setId(1L);
        owner.setEmail("owner@test.com");

        otherUser = new User();
        otherUser.setId(2L);
        otherUser.setEmail("other@test.com");
    }

    @Test
    void getAllTasks_shouldReturnOnlyUserTasks() {
        Task task = new Task();
        task.setId(1L);
        task.setUser(owner);
        when(taskRepository.findByUser(owner)).thenReturn(List.of(task));

        List<Task> result = taskController.getAllTasks(owner);

        assertEquals(1, result.size());
        verify(taskRepository).findByUser(owner);
    }

    @Test
    void createTask_shouldAssignCurrentUserAsOwner() {
        Task task = new Task();
        task.setTitre("Nouvelle tâche");
        task.setDescription("Description");
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Task result = taskController.createTask(task, owner);

        assertEquals(owner, result.getUser());
        verify(taskRepository).save(task);
    }

    @Test
    void getTaskById_whenOwner_shouldReturnTask() {
        Task task = new Task();
        task.setId(1L);
        task.setUser(owner);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        Task result = taskController.getTaskById(1L, owner);

        assertEquals(task, result);
    }

    @Test
    void getTaskById_whenNotOwner_shouldThrowNotFound() {
        Task task = new Task();
        task.setId(1L);
        task.setUser(owner);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        assertThrows(TaskNotFoundException.class, () -> taskController.getTaskById(1L, otherUser));
    }

    @Test
    void deleteTask_whenNotOwner_shouldThrowNotFound_andNeverDelete() {
        Task task = new Task();
        task.setId(1L);
        task.setUser(owner);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        assertThrows(TaskNotFoundException.class, () -> taskController.deleteTask(1L, otherUser));
        verify(taskRepository, never()).deleteById(any());
    }
}