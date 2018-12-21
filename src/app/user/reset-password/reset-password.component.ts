import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


import { AppService } from 'src/app/app.service';
import { ActivatedRoute,Router } from '@angular/router';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  hide1 = true;
  hide = true;
  forms;
  constructor(fb:FormBuilder,
    private toastr: ToastrService,
    private appservice:AppService,
    private _route:ActivatedRoute,
    public router:Router
    ) { 
    this.forms =  fb.group({
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
      console.log(this._route.snapshot.params)
     let data = {
        email:this._route.snapshot.params.email,
        resetToken:this._route.snapshot.params.resetToken,
        password:this.forms.value.password
      }
      this.appservice.resetPassword(data)
      .subscribe((apiResponse)=>{
        if(apiResponse.status === 200){
          this.toastr.success('password has been successfully reset', 'successfull');
          setTimeout(() => {
            this.goToSignIn();
          }, 2000);//redirecting to signIn page
        }
        else{
          this.toastr.error(`${apiResponse.message}`, 'error');
        }
      },
      
      (error) => {
        console.log(error.error)
        if(error.error.status === 401){
          this.toastr.error('token has expired,please try again',"error");
        }else
        this.toastr.error(`${error.error.message}`, "Error!");
      })
    }
  }
  ngOnInit() {
  }

}
