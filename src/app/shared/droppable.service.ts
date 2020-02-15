import { Injectable, SkipSelf, Optional } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DroppableService {
  dragStart$: Observable<PointerEvent>;
  dragEnd$: Observable<PointerEvent>;

  private dragStartSubject = new Subject<PointerEvent>();
  private dragEndSubject = new Subject<PointerEvent>();

  
  constructor(@SkipSelf() @Optional() private parent?: DroppableService) { 
    this.dragStart$ = this.dragStartSubject.asObservable();
    this.dragEnd$ = this.dragEndSubject.asObservable();
  }

  onDragStart(event: PointerEvent): void {
    this.dragStartSubject.next(event);

    if(this.parent) {
      this.parent.onDragStart(event);
    }
  }

  onDragEnd(event: PointerEvent): void {
    this.dragEndSubject.next(event);

    if(this.parent) {
      this.parent.onDragEnd(event);
    }
  }
}
