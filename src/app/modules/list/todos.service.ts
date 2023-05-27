import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, Signal, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from 'src/app/models/todo.model';
import { environment as ENV } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TodosService implements OnInit {

  private _http: HttpClient = inject(HttpClient);
  //private _todosSubject = new BehaviorSubject<Todo[]>([]);
  private _todoSignal = signal<Todo[]>([]);
  
  constructor() { }

  ngOnInit(): void {
      this.getTodos();
  }

  // get todos$(): Observable<Todo[]> {
  //   return this._todosSubject.asObservable();
  // }

  get todos(): Signal<Todo[]> {
    return this._todoSignal.asReadonly();
  }

  getTodo(id: string): Todo | undefined {
    //return this._todosSubject.value.find(t => t.id === id);
    return this._todoSignal().find(t => t.id === id);
  }

  getTodos() {
    this._http.get<Todo[]>(`${ENV.apiURL}/todos`).subscribe(result => {
      //this._todosSubject.next(result);
      this._todoSignal.set(result);
    });
  }
  
  createTodo(text: string) {
    this._http.post<Todo>(`${ENV.apiURL}/todo`, { text: text }).subscribe(result => {
      //this._todosSubject.value.push(result);
      this._todoSignal.mutate(list => list.push(result))
    });
  }

  deleteTodo(id: string) {
    this._http.delete(`${ENV.apiURL}/todo/${id}`).subscribe(result => {
      //const index = this._todosSubject.value.findIndex(t => t.id === id);
      //this._todosSubject.value.splice(index,1);
      this._todoSignal.set(this._todoSignal().filter(t => t.id !== id))
    });
  }

  updateTodo(id: string, todo: Todo) {
    this._http.put<Todo>(`${ENV.apiURL}/todo/${id}`, todo).subscribe(result => {
      //const index = this._todosSubject.value.findIndex(t => t.id === id);
      //this._todosSubject.value[index] = result;
      const signalIndex = this._todoSignal().findIndex(t => t.id === id);
      this._todoSignal.mutate(list => list[signalIndex] = result);
    });
  }
}
