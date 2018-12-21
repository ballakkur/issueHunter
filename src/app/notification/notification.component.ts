import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  constructor(public router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    if (Cookie.get('authToken')) {
    
    }
    else {
      this.toastr.error('please login');
      this.router.navigate(['/']);
    }
  }

}
