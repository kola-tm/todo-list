import { Component, OnInit, Signal, inject } from '@angular/core';
import { Todo } from 'src/app/models/todo.model';
import { TodosService } from './todos.service';

@Component({
  selector: 'todo-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  
  todoService = inject(TodosService);
  //todos$: Observable<Todo[]> = this.todoService.todos$;
  todos: Signal<Todo[]> = this.todoService.todos;
  newTodo: string = '';

  ngOnInit(): void {
      this.todoService.ngOnInit();
  }
  
  addTodo(): void {
    this.todoService.createTodo(this.newTodo);
    this.newTodo = '';
  }

  updateTodo(todo: Todo): void {
    this.todoService.updateTodo(todo.id, todo);
  }

  deleteTodo(id: string):void {
    this.todoService.deleteTodo(id);
  }
}