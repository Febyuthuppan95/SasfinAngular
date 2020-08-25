import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { MessagingService } from 'src/app/modules/firebase/messaging.service';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireMessagingModule,
    MaterialModule
  ],
  providers: [MessagingService],
})
export class FirebaseModule {}
