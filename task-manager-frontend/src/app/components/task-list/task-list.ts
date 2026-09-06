import { Component, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskCategory } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskForm } from '../task-form/task-form';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

type StatusFilter = 'TOUS' | 'EN_COURS' | 'TERMINE';
type SortOption = 'DATE_ASC' | 'DATE_DESC' | 'TITRE' | 'CATEGORIE';

@Component({
  selector: 'app-task-list',
  imports: [
    TaskForm, DatePipe, FormsModule,
    MatCardModule, MatCheckboxModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {
  tasks = signal<Task[]>([]);
  taskToEdit = signal<Task | null>(null);

  searchTerm = signal<string>('');
  categoryFilter = signal<TaskCategory | 'TOUTES'>('TOUTES');
  statusFilter = signal<StatusFilter>('TOUS');
  sortBy = signal<SortOption>('DATE_ASC');

  categories: TaskCategory[] = ['TRAVAIL', 'PERSONNEL', 'URGENT', 'AUTRE'];

filteredTasks = computed(() => {
  let result = this.tasks();

  const term = this.searchTerm().toLowerCase().trim();
  if (term) {
    result = result.filter(t =>
      t.titre.toLowerCase().includes(term) ||
      t.description.toLowerCase().includes(term)
    );
  }

  const cat = this.categoryFilter();
  if (cat !== 'TOUTES') {
    result = result.filter(t => t.category === cat);
  }

  const status = this.statusFilter();
  if (status === 'EN_COURS') {
    result = result.filter(t => !t.termine);
  } else if (status === 'TERMINE') {
    result = result.filter(t => t.termine);
  }

  const sorted = [...result];
  const sort = this.sortBy();
  if (sort === 'DATE_ASC' || sort === 'DATE_DESC') {
    sorted.sort((a, b) => {
      if (!a.dateEcheance) return 1;
      if (!b.dateEcheance) return -1;
      const comparison = a.dateEcheance.localeCompare(b.dateEcheance);
      return sort === 'DATE_ASC' ? comparison : -comparison;
    });
  } else if (sort === 'TITRE') {
    sorted.sort((a, b) => a.titre.localeCompare(b.titre));
  } else if (sort === 'CATEGORIE') {
  sorted.sort((a, b) => (a.category || 'AUTRE').localeCompare(b.category || 'AUTRE'));
  }

  return sorted;
});

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
      error: () => {}
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