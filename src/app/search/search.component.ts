import { Component, OnInit, ViewChild } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { IssueService } from '../issue.service';


export interface UserData {
  reporterName: string;
  title: string;
  status: string;
  date: string
 
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  displayedColumns: string[] = ['reporterName', 'title', 'status', 'date'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  myIssue

  key: string = null;
  constructor(private issueService: IssueService, public toastr: ToastrService,
    private router: Router,
    ) {
      this.dataSource = new MatTableDataSource(this.myIssue);
     }
     ngOnInit() {
      if (Cookie.get('authToken')) {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
       /*  this.issueService.getMyIssue()
          .subscribe((apiResponse) => {
            if (apiResponse.status === 200) {
              this.myIssue = apiResponse.data
              this.dataSource = new MatTableDataSource(this.myIssue);
              console.log(this.myIssue)
            }
          }) */
      }
      else {
        this.toastr.error('please login');
        this.router.navigate(['/']);
      }
    }

   /*  applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } */
    gotoView(data) {
      // console.log(data);
      this.issueService.setUserInfoInLocalStorage(data);
      this.router.navigate(['/description/2'])
    }

  Search() {
    console.log(this.key);
    this.issueService.search(this.key)

      .subscribe((apiResponse) => {
        console.log(apiResponse.data);
        if (apiResponse.status === 200 && apiResponse.message === 'not found') {
          this.toastr.info('no such bug');
        }else{
          this.toastr.success('bugs found');
          this.dataSource = new MatTableDataSource(apiResponse.data);
        }
      },(error)=>{
        console.log(error);
        this.toastr.error('server error');
      })
  }


}











