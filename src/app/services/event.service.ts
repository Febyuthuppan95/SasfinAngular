import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  private submitCapture = new EventEmitter<{ escalation?: boolean; saveProgress?: boolean}>();

  public submitLines = new Subject<void>();

  public observeCaptureEvent = () => this.submitCapture.asObservable();
  public triggerCaptureEvent = (escalation?: boolean, saveProgress?: boolean) => this.submitCapture.emit({ escalation, saveProgress });
}
