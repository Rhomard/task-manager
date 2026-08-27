import { Component, OnInit, signal } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskForm } from '../task-form/task-form';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-list',
  imports: [TaskForm, MatCardModule, MatCheckboxModule, MatIconModule, MatButtonModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {
  tasks = signal<Task[]>([]);
  taskToEdit = signal<Task | null>(null);

  constructor(private taskService: TaskService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.taskService.getAllTasks().subscribe(tasks => {
      this.tasks.set(tasks);
    });
  }

  onTaskCreated(task: Task): void {
  this.taskService.createTask(task).subscribe({
    next: createdTask => {
      this.tasks.update(current => [...current, createdTask]);
      this.showMessage('Tâche ajoutée');
    },
    error: () => {} // déjà affiché par l'intercepteur
  });
}

  onTaskUpdated(task: Task): void {
  this.taskService.updateTask(task.id!, task).subscribe({
    next: updatedTask => {
      this.tasks.update(current =>
        current.map(t => t.id === updatedTask.id ? updatedTask : t)
      );
      this.taskToEdit.set(null);
      this.showMessage('Tâche modifiée');
    },
    error: () => {}
  });
}

  toggleTermine(task: Task): void {
    const updated = { ...task, termine: !task.termine };
    this.taskService.updateTask(task.id!, updated).subscribe(updatedTask => {
      this.tasks.update(current =>
        current.map(t => t.id === updatedTask.id ? updatedTask : t)
      );
    });
  }

  startEdit(task: Task): void {
    this.taskToEdit.set(task);
  }

  cancelEdit(): void {
    this.taskToEdit.set(null);
  }

  deleteTask(id: number): void {
  this.taskService.deleteTask(id).subscribe({
    next: () => {
      this.tasks.update(current => current.filter(t => t.id !== id));
      this.showMessage('Tâche supprimée');
    },
    error: () => {}
  });
}

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', { duration: 3000 });
  }
}