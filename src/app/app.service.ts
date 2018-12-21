import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Cookie } from 'ng2-cookies/ng2-cookies';


import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AppService {
  // private baseUrl = "http://localhost:8080/api/v1/users";
  private baseUrl = "http://api.issuehunter.tk/api/v1/users";

  constructor(public http: HttpClient) { }

  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }//end of setlocalstorage Function
  public getUserInfoFromLocalStorage: any = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  }//end getlocalstorage function


  public signup (data): Observable<any> {
    const params = new HttpParams()
                  .set('firstName',data.firstName)
                  .set('lastName',data.lastName)
                  .set('email',data.email)
                  .set('password',data.password)
    return this.http.post(`${this.baseUrl}/signup`,params)
  }
  public signin (data):Observable<any>{
    const params = new HttpParams()
                  .set('email',data.email)
                  .set('password',data.password)
    return this.http.post(`${this.baseUrl}/login`,params)
  }

  public forgotPassword (email):Observable<any>{
    const params = new HttpParams()
                  .set('email',email)
    return this.http.post(`${this.baseUrl}/forgotPassword`,params)
  }

  public resetPassword (data):Observable<any>{
    const params = new HttpParams()
                  .set('email',data.email)
                  .set('password',data.password)
                  .set('token',data.resetToken)
    return this.http.post(`${this.baseUrl}/newPass`,params)
  }

 /*  public logOutWithGoogle(): Observable<any> {
    return this.http.get('/api/logout')
} */

//logout
public logout(): Observable<any> {

  const params = new HttpParams()
    .set('authToken', Cookie.get('authToken'));
  return this.http.post(`${this.baseUrl}/logout`, params);
}

public getAllUser(): Observable<any> {

  return this.http.get(`${this.baseUrl}/getAll?authToken=${Cookie.get('authToken')}`);
}



}
