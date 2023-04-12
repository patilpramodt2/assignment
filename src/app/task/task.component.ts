import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  tasks$!: Observable<Task[]>;
  currentPage = 1;
  itemsPerPage = 20;
  totalPages: number = 1;
  totalItems = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchTasks(this.currentPage);
  }

  fetchTasks(page: number) {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.tasks$ = this.http.get<Task[]>('https://jsonplaceholder.typicode.com/todos')
      .pipe(
        map(tasks => {
          this.totalItems.next(tasks.length);
          return tasks.slice(startIndex, endIndex);
        })
      );
  }

  onTaskChange(task: Task) {
    task.completed = !task.completed;
  }

  loadNextPage() {
    this.currentPage++;
    this.fetchTasks(this.currentPage);
  }
  loadPreviousPage() {
    this.currentPage--;
    this.fetchTasks(this.currentPage);
  }


}
