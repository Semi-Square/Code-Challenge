import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/containers/core/services/common-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  optionsList = [];
  tableList = [];
  selectedItem: any;
  isTableLoading = false;

  constructor(private commonService: CommonService, private router: Router) { }


  ngOnInit(): void {
    this.fetchDropdownOptions();
    this.fetchTableList();
  }


  fetchDropdownOptions() {
    this.commonService.getHttpCall({
      url: 'api/users?page=1&per_page=100'
    }).subscribe(res => {
      this.optionsList = res.data;
    }, err => {
    });
  }


  fetchTableList() {
    this.isTableLoading = true;
    this.commonService.getHttpCall({
      url: 'api/unknown?page=1&per_page=100'
    }).subscribe(res => {
      this.tableList = res.data;
      this.isTableLoading = false;
    }, err => {
      this.isTableLoading = false;
    });
  }


  onSelect(item) {
    this.selectedItem = this.optionsList.find(x => x.id == item.value);
  }


  onLogout() {
    Swal.fire({
      icon: 'warning',
      text: 'Are you sure you want to logout?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      allowOutsideClick: false,
    }).then((res) => {
      if (res.value) {
        localStorage.clear();
        setTimeout(() => {
          this.router.navigate(['/']);
        });
        return true;
      } else {
        return false;
      }
    });
  }

}
