import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  private submitCapture = new EventEmitter<boolean>();

  public submitLines = new Subject<void>();

  public observeCaptureEvent = () => this.submitCapture.asObservable();
  public triggerCaptureEvent = (escalation?: boolean) => this.submitCapture.emit(escalation);
}
