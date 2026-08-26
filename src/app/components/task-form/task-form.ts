import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm {
  @Output() taskCreated = new EventEmitter<Task>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const newTask: Task = {
        titre: this.form.value.titre,
        description: this.form.value.description,
        termine: false
      };
      this.taskCreated.emit(newTask);
      this.form.reset();
    }
  }
}