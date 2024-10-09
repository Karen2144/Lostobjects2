import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private isModalOpenSubject = new BehaviorSubject<boolean>(false);
  isModalOpen$ = this.isModalOpenSubject.asObservable();

  constructor() {}

  toggleModal() {
    const currentState = this.isModalOpenSubject.value;
    this.isModalOpenSubject.next(!currentState);
  }

  openModal() {
    this.isModalOpenSubject.next(true);
  }

  closeModal() {
    this.isModalOpenSubject.next(false);
  }



}