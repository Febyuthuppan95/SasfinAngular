import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { LoginResponse } from '../../../models/HttpResponses/LoginResponse';
import { NotificationComponent } from '../../../components/notification/notification.component';
import { UserService } from '../../../services/user.Service';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.Service.js';



@Component({
  selector: 'app-view-login',
  templateUrl: './view-login.component.html',
  styleUrls: ['./view-login.component.scss'],
})
export class ViewLoginComponent implements OnInit {

  txtEmail: string;
  txtPassword: string;
  pendingRequest = false;
  

  constructor(
    private router: Router,
    private userService: UserService,
    private themeService: ThemeService,
    private renderer: Renderer2,
     private elRef : ElementRef
  
    ) { }

  @ViewChild('login', { static: true }) 
  elRefs: ElementRef;

  @ViewChild(NotificationComponent, { static: true })
  private notify: NotificationComponent;
  typePassword: boolean;

  ngOnInit() { 
    var elem = document.getElementsByClassName("modal-backdrop")

    if(elem.length > 0)
    {
      this.renderer.removeClass(elem[0], elem[0].classList[0]);
    }  
  }   

  onLoginSubmit() {
    if (this.txtEmail === '' || this.txtPassword === '') {

      this.pendingRequest = false;
      this.notify.errorsmsg('Invalid Input', 'Please enter all fields.');
    } else {

      this.pendingRequest = true;
      this.userService.authenticate(this.txtEmail, this.txtPassword).then(
        (res: LoginResponse) => {

          const expireDate = new Date();
          expireDate.setDate(expireDate.getDate() + 1);
          if (res.authenticated) {            
            this.notify.successmsg(res.outcome.outcome, res.outcome.outcomeMessage);
            this.userService.persistLogin(JSON.stringify(res));
            this.router.navigate(['users']);
          } else {            
            this.notify.errorsmsg(res.outcome.outcome, res.outcome.outcomeMessage);
          }
          this.pendingRequest = false;
        },
        (msg) => {

          this.pendingRequest = false;
          this.notify.errorsmsg('Failure', 'No Authorization.');
        });
    }

  }

  togglePassword() {
    this.togglePassword = function() { this.typePassword = !this.typePassword; };
  }
}