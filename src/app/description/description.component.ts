import { Component, OnInit } from '@angular/core';
import { IssueService } from '../issue.service';
import { ActivatedRoute,Router } from '@angular/router';
import { FormBuilder,Validators } from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

import * as Quill from 'quill';
import { AppService } from '../app.service';
console.log(Quill)

let quill = new Quill('#editor');

let trim = (x) => {
  let value = String(x);
  return value.replace(/^\s+|\s+$/gm, '');
}
let isEmpty = (value) => {
  if (value === null || value === undefined || trim(value) === '' || value.length === 0) {
    return true;
  } else {
    return false;
  }
}

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {

 profileForm
 value = '';
 updateOrNot = 'create'
 users
 wtId:string
 selectedFile:File = null
 download:string = null

  constructor(private issueService:IssueService,public appService:AppService,public toastr:ToastrService,
    private router:Router,
    private activatedRouter:ActivatedRoute,private fb: FormBuilder) { 
    this.profileForm = this.fb.group({
      title: ['', Validators.required],
      description: ['',Validators.required],
      assignTo:[''],
      status:['',Validators.required],
      // selectedFile:['']
      
    });
  }
  

  quillConfig ={
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
  
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
  
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
  
      ['clean']                                        // remove formatting button
  
      // [ 'image']                         // image
    ]
  };
  comments:[Object]
  data
  name
  select
  assi
  description
  watcher:[string]
  ngOnInit() {
    
    this.appService.getAllUser()
    .subscribe((apiResponse)=>{
      // console.log(apiResponse)
      if(apiResponse.status === 200){
        this.users = apiResponse.data
        console.log(this.users)
      }
    },(error)=>{
      console.log(error.error)
    })

    if(this.activatedRouter.snapshot.params.no == 2){
      this.updateOrNot = 'update'
      this.data = this.issueService.getUserInfoFromLocalStorage();
      this.wtId = this.data.bugId
      this.download = this.data.image
      console.log(this.data);
      // this.profileForm.reset();
      this.assi = this.data.assignedToId
      this.profileForm.patchValue({title:`${this.data.title}`})
      this.profileForm.patchValue({description:`${this.data.description}`})
      this.profileForm.patchValue({status:`${this.data.status}`})
      this.profileForm.patchValue({assignTo:`${this.data.assignedToId}`})
    this.issueService.listWatcher(this.data.bugId)
    .subscribe((apiResponse)=>{
      if(apiResponse.status ===200){
        // console.log(apiResponse.data)
        this.watcher = apiResponse.data[0].watcherName;
        // console.log(this.watcher)
      }
    })
    //list the comments if any
    this.issueService.listComment(this.wtId)
    .subscribe((apiResponse)=>{
      console.log(apiResponse)
      if(apiResponse.status === 200){
        // console.log(apiResponse.data)
        this.comments = apiResponse.data
        console.log(this.comments)
      }
    },(error)=>{
           console.log(error)
         })
    }
  }

  /* onEditorCreated(){
    console.log(this.description)
  } */
  onSubmit(){
    // this.profileForm.patchValue({selectedFile:`${this.selectedFile}`})
    console.log(this.profileForm);
     
    if(this.updateOrNot == 'update'){
      if(this.profileForm.value.assignTo){
  
        let userAssign = this.users.find(element => {
           if(element.userId === this.profileForm.value.assignTo){
             return element
           }
         });
        //  console.log(userAssign.userName)
         this.issueService.updateIssue(this.profileForm.value,userAssign.userName,this.data.bugId,this.selectedFile)
         .subscribe((apiResponse)=>{
          //  console.log(apiResponse);
           if(apiResponse.status === 200){
             this.toastr.success('updated');
           }
         },(error)=>{
           console.log(error)
         })
      }else{
  
        this.issueService.updateIssue(this.profileForm.value,null,this.data.bugId,this.selectedFile)
        .subscribe((apiResponse)=>{
          // console.log(apiResponse);
          if(apiResponse.status === 200){
            this.toastr.success('updated');
          }
        },(error)=>{
          console.log(error)
        })
      }
    }else{

      if(this.profileForm.value.assignTo){
  
        let userAssign = this.users.find(element => {
           if(element.userId === this.profileForm.value.assignTo){
             return element
           }
         });
         console.log(userAssign.userName)
         this.issueService.createIssue(this.profileForm.value,userAssign.userName,this.selectedFile)
         .subscribe((apiResponse)=>{
          //  console.log(apiResponse);
           if(apiResponse.status === 200){
            //  console.log(apiResponse.data)
             this.wtId = apiResponse.data.bugId
             this.toastr.success('reported the issue');
           }
         },(error)=>{
           console.log(error)
         })
      }else{
        this.issueService.createIssue(this.profileForm.value,null,this.selectedFile)
        .subscribe((apiResponse)=>{
          // console.log(apiResponse);
          if(apiResponse.status === 200){
            // console.log(apiResponse.data)
            this.wtId = apiResponse.data.bugId
            this.toastr.success('reported the issue');
            
          }
        },(error)=>{
          console.log(error)
        })
      }
    } 
  }
  addWatcher(){
    this.issueService.addAssWatcher(this.wtId)
    .subscribe((apiResponse)=>{
      if(apiResponse.status === 200 && apiResponse.message ==='successfully added you as watcher'){
        this.toastr.success(apiResponse.message,'done');
      }
    },(error)=>{
      if(error.error.message =='you are already watching'){
        this.toastr.success(error.error.message,'ok');
      }
      console.log(error);
    })
  }
  addComment(){
    if(isEmpty(this.value)){

    }else{
      console.log(this.value);
      this.issueService.addComment(this.wtId,this.value)
      .subscribe((apiResponse)=>{
        if(apiResponse.status ===200){
          this.toastr.success('commented','done!');
          this.comments.splice(0,0,{comment:apiResponse.data.comment,commentatorName:apiResponse.data.commentatorName});
          this.value = ''
        }
      },(error)=>{
          console.log(error)
        })
    }
  }

  //file upload
  onFileSelected(event){
    console.log(event);
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile);
  }
  downloadImage(){
    this.router.navigate([`${this.download}`])
  }

}
