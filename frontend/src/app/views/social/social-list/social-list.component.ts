import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { BusinessService } from 'src/app/shared/services/business.service';
import { Router } from '@angular/router';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { countryJSON } from '../../json/countryJSON';
import { UrlJSON } from '../../json/urlJSON';
import { categoryJSON } from '../../json/categoryJSON';

@Component({
  selector: 'app-social-list',
  templateUrl: './social-list.component.html',
  styleUrls: ['./social-list.component.scss'],
  animations: [SharedAnimations]
})
export class SocialListComponent implements OnInit {

  isRegister: boolean = false;
  viewMode: 'list' | 'grid' = 'grid';
  allSelected: boolean;
  page = 1;
  pageSize = 8;

  pages = 1;
  current = 1;
  index = 0;
  last_index = 0;
  index_arr = [];
  role = '0';
  isUpdate = false;
  private customerId: string;
  request: string = 'Send Request';
  icon: string = 'i-Add';
  businesses: any = [];
  business: any = [];
  searchUserData = { country: 'All', category: 'All', fromDate: '', toDate: '', userid: '' };
  searchData = { country: 'All', category: 'All', fromDate: '', toDate: '', userid: '' };
  countryArr = countryJSON;
  categoryArr = categoryJSON;
  tabs: any[];
  countryModel: number[];
  categoryModel: number[];
  countryOptions: IMultiSelectOption[];
  categoryOptions: IMultiSelectOption[];
  countryWarn = false;
  countrySettings: IMultiSelectSettings = {
    showUncheckAll: true,
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block  btn-after',
    dynamicTitleMaxItems: 1,
    displayAllSelectedText: true,
    containerClasses: 'custom-dropdown',
    closeOnSelect: false
  };
  categorySettings: IMultiSelectSettings = {
    showUncheckAll: true,
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block  btn-after',
    dynamicTitleMaxItems: 1,
    displayAllSelectedText: true,
    containerClasses: 'custom-dropdown',
    closeOnSelect: false
  };
  countryTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Clear',
    checked: 'item selected',
    checkedPlural: 'selected',
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'All',
    allSelected: 'All selected',
  };
  categoryTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Clear',
    checked: 'item selected',
    checkedPlural: 'selected',
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'All',
    allSelected: 'All selected',
  };

  constructor( private businessService: BusinessService, public router: Router ) { }

  ngOnInit() {
    this.fetchBusiness();
    localStorage.setItem('itemPage', '1');
    this.countryOptions = this.countryArr;
    this.categoryOptions = this.categoryArr;
    this.role = localStorage.getItem('role');
    this.customerId = localStorage.getItem('userId');
    this.searchUserData.userid = this.customerId;

    if(localStorage.getItem('userId') && localStorage.getItem('userId') != '-1'){
      this.isRegister = true;
      this.businessService.getBusinessByID(localStorage.getItem('userId')).subscribe(res => {
          if(res){
              this.isUpdate = true;
          }

      });
  }

    document.getElementsByClassName('nav-link active_url')[0].className = 'nav-link active_url';
    document.getElementsByClassName('nav-link active_url')[1].className = 'nav-link active_url active';
    document.getElementsByClassName('nav-link active_url')[2].className = 'nav-link active_url';
  }
  fetchBusiness() {
    
    this.searchData.country = this.searchUserData.country;
    this.searchData.category = this.searchUserData.category;
    this.searchData.fromDate = this.searchUserData.fromDate;
    this.searchData.toDate = this.searchUserData.toDate;
    this.searchData.userid = this.searchUserData.userid;
    if (this.searchUserData.country === '') {
      this.searchData.country = 'All';
    }
    if (this.searchUserData.category === '') {
      this.searchData.category = 'All';
    }
    if (this.searchUserData.fromDate == null || this.searchUserData.fromDate === '') {
      this.searchData.fromDate = '1900-01-01';
    } else {
      const fromDateObj = this.searchUserData.fromDate;
      const from_month = fromDateObj['month'] < 9 ? '0' + fromDateObj['month'] : fromDateObj['month'];
      const from_day = fromDateObj['day'] < 9 ? '0' + fromDateObj['day'] : fromDateObj['day'];
      this.searchData.fromDate = fromDateObj['year'] + '-' + from_month + '-' + from_day;
      const toDateObj = this.searchUserData.toDate;
      const to_month = toDateObj['month'] < 9 ? '0' + toDateObj['month'] : toDateObj['month'];
      const to_day = toDateObj['day'] < 9 ? '0' + toDateObj['day'] : toDateObj['day'];
      this.searchData.toDate = toDateObj['year'] + '-' + to_month + '-' + to_day;
    }
    if (this.searchUserData.toDate === '' || this.searchUserData.toDate == null
      || this.searchUserData.toDate < this.searchUserData.fromDate) {
      this.searchData.toDate = '2100-01-01';
    }
    this.page = this.getCurrentPage() === null ? 1 : Number(this.getCurrentPage());
    
    this.businessService.getBusinesses(this.page, this.searchData)
      .subscribe((val: any[]) => {
        const business = val['business'];
        this.pages = Number(val['pages']);
        this.current = Number(val['current']);
        this.index = Number(this.current) > 3 ? Number(this.current) - 2 : 1;
        this.last_index = this.current + 2;
        this.index_arr = [];
        if (this.current > 3) {
          for (let i = this.current - 1; i < (Number(this.current) + 2) && i <= this.pages; i++) {
            this.index_arr.push(i);
          }
        } else {
          for (let i = this.index; i < (Number(this.current) + 2) && i <= this.pages; i++) {
            this.index_arr.push(i);
          }
        }
        this.business = [...business];
        this.businesses = business;
        for (let i = 0; i < this.businesses.length; i++) {
          if (this.businesses[i].picture === 'default.png') {
            this.businesses[i].picture = '../../../../assets/images/avatar/default.png';
          } else {
            if (this.businesses[i].extraBlob === '2') {
              this.businesses[i].picture = UrlJSON.displayAvatarFromFSUrl + this.businesses[i].picture;
            } else {
              this.businesses[i].picture = UrlJSON.displayPictureUrl + this.businesses[i].picture;
            }
          }
        }
      });
  }
  jsonToString(arr) {
    let return_val = '';
    for (let i = 0; i < arr.length; i++) {
      return_val += arr[i].name + ',';
    }
    return return_val;
  }
  getCurrentPage() {
    return localStorage.getItem('socialPage');
  }
  saveCurrentPage(page) {
    localStorage.setItem('socialPage', page);
  }
  gotoPage(page) {
    if (page < 1 || page > this.pages) {
      return;
    }
    this.page = page;
    this.saveCurrentPage(this.page);
    this.fetchBusiness();
  }
  gotoPreviousPage() {
    if (Number(this.current) - 1 === 0) {
      return;
    } else {
      this.page = Number(this.current) - 1;
      this.saveCurrentPage(this.page);
      this.fetchBusiness();
    }
  }
  gotoNextPage() {
    if (Number(this.current) + 1 > this.pages) {
      return;
    } else {
      this.page = Number(this.current) + 1;
      this.saveCurrentPage(this.page);
      this.fetchBusiness();
    }
  }
  pageChange(event) {
    this.page = event;
  }
  onChangeCountry(event) {
    this.searchUserData.country = '';
    for (let i = 0; i < event.length; i++) {
      this.searchUserData.country += this.countryArr[event[i] - 1].name + ',';
    }
    this.filterData();
  }
  onChangeCategory(event) {
    this.searchUserData.category = '';
    for (let i = 0; i < event.length; i++) {
      this.searchUserData.category += this.categoryArr[event[i] - 1].name + ',';
    }
    this.filterData();
  }
  filterData() {
    this.saveCurrentPage('1');
    this.fetchBusiness();
  }
  goToCompany(id) {
    this.router.navigate([`/social/business/${id}`]);
  }
  goToAddCompany() {
    this.router.navigate([`/social/addbusiness`]);
  }
  goToAnotherMainPage() {
    this.router.navigate([`/social/mainpage`]);
  }

  sendRequest(id) {
    this.request = 'Requested';
    this.icon = 'i-Check';
  }
}
