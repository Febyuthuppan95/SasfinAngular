import { Injectable, EventEmitter } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EventService {
  private submitCapture = new EventEmitter<boolean>();

  public observeCaptureEvent = () => this.submitCapture.asObservable();
  public triggerCaptureEvent = (escalation?: boolean) => this.submitCapture.emit(escalation);
}
