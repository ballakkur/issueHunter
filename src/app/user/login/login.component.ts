import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import { AuthService } from "angularx-social-login";
import {  GoogleLoginProvider } from "angularx-social-login";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  hide = true;

  // public user:any = SocialUser
  constructor(private fb:FormBuilder,
              private appservice:AppService,
              private toastr:ToastrService,
              private authService: AuthService,
              private router:Router
    ) { }

  

  ngOnInit() {
  }
  authForm = this.fb.group({
    email:['',[Validators.email,Validators.required]],
    password:['',[Validators.required,Validators.minLength(6)]]
  })
  
  onSuccess(googleUser){
    console.log('ksksks')
  }
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

  public googleLogin: any =()=>{
    window.open('http://localhost:8080/auth/google', "mywindow","location=1,status=1,scrollbars=1, width=800,height=800")
    let listener = window.addEventListener('message', (message) => {
      console.log(message)
      // this.appService.setUserInformationStorage(message.data.user)
      // this.cookieService.set('userId', message.data.user.userId);
      console.log('UserName', message.data.user.firstName + ' ' + message.data.user.lastName);
      // this.cookieService.set('UserName', message.data.user.firstName + ' ' + message.data.user.lastName);
      // this.router.navigate(['/dashboard'])
    });
    
}
  
 
  onSubmit =()=> {
    console.warn(this.authForm.value);
    this.appservice.signin(this.authForm.value)
    .subscribe((apiResponse)=>{
      if(apiResponse.status === 200){
        this.toastr.success('you have successfully loggedin', 'welcome');
        console.log(apiResponse);
          Cookie.set('authToken', apiResponse.data.authToken);
            this.appservice.setUserInfoInLocalStorage(apiResponse.data.userDetails);

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
      }
      else{
        this.toastr.error(`${apiResponse.message}`,`${apiResponse.status}`)
      }
    },
      
    (error) => {
      console.log(error.error)
      if(error.error.status === 404){
        this.toastr.error('user not found',"invalid email");
      }
      else if(error.error.status === 401){
        this.toastr.error("wrong Password");
      }
      else{

        this.toastr.error(`${error.error.message}`, "Error!");
      }
    })
  } 
}
