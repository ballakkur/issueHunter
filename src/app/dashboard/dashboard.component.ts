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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ['reporterName', 'title', 'status', 'date'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  myIssue

  constructor(public router: Router, private toastr: ToastrService, public issueService: IssueService) {
    // Create 100 users
    // const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(users);
    this.dataSource = new MatTableDataSource(this.myIssue);

  }

  ngOnInit() {
    if (Cookie.get('authToken')) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.issueService.getMyIssue()
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            this.myIssue = apiResponse.data
            this.dataSource = new MatTableDataSource(this.myIssue);
            console.log(this.myIssue)
          }
        })
    }
    else {
      this.toastr.error('please login');
      this.router.navigate(['/']);
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  gotoView(data) {
    // console.log(data);
    this.issueService.setUserInfoInLocalStorage(data);
    this.router.navigate(['/description/2'])
  }
}
 /** Builds and returns a new User. */
/* function createNewUser(id: number): UserData {
  const name =
      NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };

} */
