import { Component } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(public appservice:AppService,public router:Router,public toastr:ToastrService) { }

  
  public logout: any = () => {

    this.appservice.logout()
      .subscribe((apiResponse) => {

        if (apiResponse.status === 200) {
          Cookie.deleteAll('authToken');
          localStorage.clear();
          this.toastr.success('you have successfully logged out');
          this.router.navigate(['/']);//navigating to login page
        }
        else {
          this.toastr.error(apiResponse.message);
        }
      }, (err) => {
        this.toastr.error('some error occured');
      });//end subscribe
  }//end logout

  gotoDashboard(){
    this.router.navigate(['/dashboard'])
  }

}
