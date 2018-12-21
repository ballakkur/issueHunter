import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { Cookie } from 'ng2-cookies/ng2-cookies';


import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})



export class IssueService {

  // private baseUrl = "http://localhost:8080/api/v1/issue";
  private baseUrl = "http://api.issuehunter.tk/api/v1/issue";
  constructor(public http: HttpClient) { }

  public getMyIssue(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))

    return this.http.post(`${this.baseUrl}/viewYourIssue`, params)
  }
  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('shareData', JSON.stringify(data));
  }//end of setlocalstorage Function
  public getUserInfoFromLocalStorage: any = () => {
    return JSON.parse(localStorage.getItem('shareData'));
  }//end getlocalstorage function


  public createIssue(data,userName,selectedFile:File): Observable<any> {
// console.log(data)
    if (isEmpty(data.assignTo)) {
     /*  const params = new HttpParams()
        .set('title', data.title)
        .set('status', data.status)
        .set('description', data.description)
        .set('authToken', Cookie.get('authToken'))
      return this.http.post(`${this.baseUrl}/create`, params) */
      // console.log(data.selectedFile)
      let payload = new FormData()
      payload.append('title', data.title)
      payload.append('status', data.status)
      payload.append('productImage',selectedFile)
       payload.append('description', data.description)
      return this.http.post(`${this.baseUrl}/create?authToken=${Cookie.get('authToken')}`,payload ) 
    }
    else{
     /*  const params = new HttpParams()
        .set('title', data.title)
        .set('status', data.status)
        .set('assignedToId', data.assignTo)
        .set('assignedToName', userName)
        .set('description', data.description)
        .set('authToken', Cookie.get('authToken'))
      return this.http.post(`${this.baseUrl}/create`, params) */
      // console.log(data.selectedFile)
      let payload = new FormData()
      payload.append('title', data.title)
      payload.append('status', data.status)
      payload.append('assignedToId', data.assignTo)
      payload.append('assignedToName', userName)
      payload.append('productImage',selectedFile)
       payload.append('description', data.description)
      return this.http.post(`${this.baseUrl}/create?authToken=${Cookie.get('authToken')}`,payload ) 
    }
  
  }

  public updateIssue(data,userName,bugId,selectedFile:File): Observable<any> {
// console.log(data)
    if (isEmpty(data.assignTo)) {
     /*  const params = new HttpParams()
        .set('title', data.title)
        .set('bugId', bugId)
        .set('status', data.status)
        .set('description', data.description)
        .set('authToken', Cookie.get('authToken'))
      return this.http.post(`${this.baseUrl}/update`, params) */
      let payload = new FormData()
      payload.append('title', data.title)
      payload.append('bugId', bugId)
      payload.append('status', data.status)
      payload.append('assignedToId', data.assignTo)
      payload.append('productImage',selectedFile)
      payload.append('assignedToName', userName)
       payload.append('description', data.description)
      return this.http.post(`${this.baseUrl}/update?authToken=${Cookie.get('authToken')}`,payload ) 
    }
    else{
     /*  const params = new HttpParams()
        .set('title', data.title)
        .set('bugId', bugId)
        .set('status', data.status)
        .set('assignedToId', data.assignTo)
        .set('productImage',data.selectedFile)
        .set('assignedToName', userName)
        .set('description', data.description)
        .set('authToken', Cookie.get('authToken'))
      return this.http.post(`${this.baseUrl}/update`, params) */
      let payload = new FormData()
      payload.append('title', data.title)
      payload.append('bugId', bugId)
      payload.append('status', data.status)
      payload.append('assignedToId', data.assignTo)
      payload.append('productImage',selectedFile)
      payload.append('assignedToName', userName)
       payload.append('description', data.description)
      return this.http.post(`${this.baseUrl}/update?authToken=${Cookie.get('authToken')}`,payload ) 
    }
  
  }

  //file upload
/*   public upload(image):Observable<any>{
    
    const params = new HttpParams()
    .set('authToken', Cookie.get('authToken'))
    .set('image',image)
    return this.http.post(`${this.baseUrl}/upload`,params)
  } */

  public addAssWatcher(bugId:string):Observable<any>{
    
    const params = new HttpParams()
    .set('authToken', Cookie.get('authToken'))
    .set('bugId',bugId)
    return this.http.post(`${this.baseUrl}/watcher`,params)
  }
  
  //add comment
  public addComment(bugId:string,commentString:string):Observable<any>{
    
    const params = new HttpParams()
    .set('authToken', Cookie.get('authToken'))
    .set('bugId',bugId)
    .set('commentString',commentString)
    return this.http.post(`${this.baseUrl}/comment`,params)
  }

  //search issues
  public search(key:string):Observable<any>{

    return this.http.get(`${this.baseUrl}/search?authToken=${Cookie.get('authToken')}&key=${key}`)
  }

  public listWatcher(bugId:string): Observable<any> {

    return this.http.get(`${this.baseUrl}/listWatcher/${bugId}?authToken=${Cookie.get('authToken')}`);
  
  }
  public listComment(bugId:string):Observable<any>{
    
    return this.http.get(`${this.baseUrl}/${bugId}/listComment?authToken=${Cookie.get('authToken')}`)
  }
}
