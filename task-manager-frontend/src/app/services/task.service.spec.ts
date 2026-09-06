import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';
import { environment } from '../../environments/environment.development';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/tasks`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all tasks via GET', () => {
    const mockTasks: Task[] = [
      { id: 1, titre: 'Test', description: 'Desc', termine: false }
    ];

    service.getAllTasks().subscribe(tasks => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should send a POST request when creating a task', () => {
    const newTask: Task = { titre: 'Nouvelle', description: 'Desc', termine: false };
    const createdTask: Task = { ...newTask, id: 1 };

    service.createTask(newTask).subscribe(task => {
      expect(task).toEqual(createdTask);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(createdTask);
  });

  it('should send a DELETE request with the correct id', () => {
    service.deleteTask(5).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/5`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});