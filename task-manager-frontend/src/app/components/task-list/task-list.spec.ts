import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TaskList } from './task-list';
import { environment } from '../../../environments/environment.development';
import { Task } from '../../models/task.model';

describe('TaskList', () => {
  let component: TaskList;
  let fixture: ComponentFixture<TaskList>;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/tasks`;

  const mockTasks: Task[] = [
    { id: 1, titre: 'Tâche 1', description: 'Desc 1', termine: false },
    { id: 2, titre: 'Tâche 2', description: 'Desc 2', termine: true }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskList);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges(); // déclenche ngOnInit -> appel GET
    httpMock.expectOne(apiUrl).flush(mockTasks);
    fixture.detectChanges(); // ré-affiche avec les données reçues
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the fetched tasks', () => {
    expect(component.tasks().length).toBe(2);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Tâche 1');
    expect(compiled.textContent).toContain('Tâche 2');
  });

  it('should remove a task after deletion', () => {
    component.deleteTask(1);

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(component.tasks().length).toBe(1);
    expect(component.tasks()[0].id).toBe(2);
  });
});