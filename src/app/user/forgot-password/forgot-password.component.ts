import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private appservice:AppService,private toastr:ToastrService) { }
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  ngOnInit() {
  }
  send = ()=>{
    console.log(this.emailFormControl.value)
    this.appservice.forgotPassword(this.emailFormControl.value)
    .subscribe((apiResponse)=>{
      if(apiResponse.status === 200){
        this.toastr.success(`${apiResponse.message}`,'reset');
      }
      else{
        this.toastr.error(`${apiResponse.message}`,`${apiResponse.data}`);        
      }
    },
    (error) => {
      console.log(error.error)
      if(error.error.status === 404){
        this.toastr.error('user not found',"invalid email");
      }
      else{

        this.toastr.error(`${error.error.message}`, "Error!");
      }
    })
  }

}
