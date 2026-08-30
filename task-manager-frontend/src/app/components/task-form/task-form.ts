import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm implements OnChanges {
  @Input() taskToEdit: Task | null = null;
  @Output() taskCreated = new EventEmitter<Task>();
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit']) {
      if (this.taskToEdit) {
        this.form.patchValue({
          titre: this.taskToEdit.titre,
          description: this.taskToEdit.description
        });
      } else {
        this.formGroupDirective?.resetForm();
      }
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.taskToEdit) {
        this.taskUpdated.emit({
          ...this.taskToEdit,
          titre: this.form.value.titre,
          description: this.form.value.description
        });
      } else {
        this.taskCreated.emit({
          titre: this.form.value.titre,
          description: this.form.value.description,
          termine: false
        });
      }
      this.formGroupDirective.resetForm();
    }
  }

  onCancel(): void {
    this.cancelled.emit();
    this.formGroupDirective.resetForm();
  }
}