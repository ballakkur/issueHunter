import { Component } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {  Router } from '@angular/router';

import {AppService } from '../../app.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent{

  hide1 = true;
  hide = true;
  forms;
  
  constructor(public appservice:AppService,
    public router: Router,
    fb:FormBuilder,
    private toastr: ToastrService) {
   this.forms =  fb.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]],
      confirmpassword:['',[Validators.required,Validators.minLength(6)]],
    }
    )
  
  }
  goToSignIn = ()=>{
    this.router.navigate(['/']);
  }
 
  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.forms.value);
    if(this.forms.value.password.localeCompare(this.forms.value.confirmpassword)){
      this.toastr.error('please re-enter password', 'mismatch');
      this.forms.patchValue({password:'',confirmpassword:''})
    }else{
      this.appservice.signup(this.forms.value)
      .subscribe((apiResponse)=>{
        if(apiResponse.status === 200){

          this.toastr.success('you have successfully signedup', 'welcome');
          setTimeout(() => {
            this.goToSignIn();
          }, 2000);//redirecting to signIn page

        }
        else{
          this.toastr.error(`${apiResponse.message}`,`${apiResponse.status}`)
        }

      },
      
      (error) => {
        console.log(error.error)
        this.toastr.error(`${error.error.message}`, "Error!");
      }
      )
    }
  }

 

}
