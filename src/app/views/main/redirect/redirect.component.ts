import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.Service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    const currentUser = this.userService.getCurrentUser();

    if (currentUser.designation === 'Capturer') {
      this.router.navigate(['transaction/capturerlanding']);
    } else if (currentUser.designation === 'Consultant') {
      this.router.navigate(['escalations']);
    } else {
      this.router.navigate(['users']);
    }
  }

}
