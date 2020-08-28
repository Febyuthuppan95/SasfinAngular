import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  private submitCapture = new EventEmitter<{ escalation?: boolean; saveProgress?: boolean; escalationResolved?: boolean}>();

  public submitLines = new Subject<void>();
  public focusForm = new Subject<void>();
  public mouseChange = new Subject<boolean>();

  public observeCaptureEvent = () => this.submitCapture.asObservable();
  public triggerCaptureEvent = (escalation?: boolean, saveProgress?: boolean, escalationResolved?: boolean) =>
  this.submitCapture.emit({ escalation, saveProgress, escalationResolved });
}
