package com.github.rhomard.task_manager.repository;

import com.github.rhomard.task_manager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}