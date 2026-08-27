import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm implements OnChanges {
  @Input() taskToEdit: Task | null = null;
  @Output() taskCreated = new EventEmitter<Task>();
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() cancelled = new EventEmitter<void>();

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
        this.form.reset();
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
      this.form.reset();
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}