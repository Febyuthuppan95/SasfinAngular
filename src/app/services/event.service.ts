import { Injectable, EventEmitter } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EventService {
  private submitCapture = new EventEmitter<void>();

  public observeCaptureEvent = () => this.submitCapture.asObservable();
  public triggerCaptureEvent = () => this.submitCapture.emit();
}
