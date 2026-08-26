import { Component, OnInit, signal } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskForm } from '../task-form/task-form';

@Component({
  selector: 'app-task-list',
  imports: [TaskForm],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {
  tasks = signal<Task[]>([]);

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getAllTasks().subscribe(tasks => {
      this.tasks.set(tasks);
    });
  }

  onTaskCreated(task: Task): void {
    this.taskService.createTask(task).subscribe(createdTask => {
      this.tasks.update(current => [...current, createdTask]);
    });
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks.update(current => current.filter(t => t.id !== id));
    });
  }
}