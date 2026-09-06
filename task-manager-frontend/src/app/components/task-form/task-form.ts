import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Task, TaskCategory } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm implements OnChanges {
  @Input() taskToEdit: Task | null = null;
  @Output() taskCreated = new EventEmitter<Task>();
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;

  categories: TaskCategory[] = ['TRAVAIL', 'PERSONNEL', 'URGENT', 'AUTRE'];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      category: ['AUTRE' as TaskCategory, Validators.required],
      dateEcheance: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit']) {
      if (this.taskToEdit) {
        this.form.patchValue({
          titre: this.taskToEdit.titre,
          description: this.taskToEdit.description,
          category: this.taskToEdit.category,
          dateEcheance: this.taskToEdit.dateEcheance ?? ''
        });
      } else {
        this.formGroupDirective?.resetForm({ category: 'AUTRE' });
      }
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      if (this.taskToEdit) {
        this.taskUpdated.emit({
          ...this.taskToEdit,
          titre: formValue.titre,
          description: formValue.description,
          category: formValue.category,
          dateEcheance: formValue.dateEcheance || undefined
        });
      } else {
        this.taskCreated.emit({
          titre: formValue.titre,
          description: formValue.description,
          termine: false,
          category: formValue.category,
          dateEcheance: formValue.dateEcheance || undefined
        });
      }
      this.formGroupDirective.resetForm({ category: 'AUTRE' });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
    this.formGroupDirective.resetForm({ category: 'AUTRE' });
  }
}