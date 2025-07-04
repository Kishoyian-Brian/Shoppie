import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductEventsService {
  private productAddedSource = new Subject<void>();
  productAdded$ = this.productAddedSource.asObservable();

  notifyProductAdded() {
    this.productAddedSource.next();
  }
} 