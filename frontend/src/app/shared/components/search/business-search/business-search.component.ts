import { Component, OnInit } from '@angular/core';
import { DataLayerService } from '../../../services/data-layer.service';
import { Observable, combineLatest } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, debounceTime, switchMap, map } from 'rxjs/operators';
import { SharedAnimations } from '../../../animations/shared-animations';
import { SearchService } from '../../../services/search.service';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { UrlJSON } from '../../../../views/json/urlJSON';
import { BusinessService } from 'src/app/shared/services/business.service';

@Component({
  selector: 'app-business-search',
  templateUrl: './business-search.component.html',
  styleUrls: ['./business-search.component.scss'],
  animations: [SharedAnimations]
})
export class BusinessSearchComponent implements OnInit {
  page = 1;
  pageSize = 6;
  role: String;
  url = UrlJSON;

  pages = 1;
  current = 1;
  index = 0;
  last_index = 0;
  index_arr = [];
  results$: Observable<any[]>;
  businesses: any[] = [];
  filteredBusinesses: any[] = [];
  searchData = { searchText: '' };
  searchCtrl: FormControl = new FormControl('');

  constructor(
    private dl: DataLayerService,
    public searchService: SearchService,
    private businessService: BusinessService,
    private router: Router
  ) { }

  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.fetchBusinesses();
  }

  goHome() {
    this.searchService.searchBusinessOpen = false;
    this.router.navigate(['/social/list/']);
  }

  editUser(id) {
    this.searchService.searchBusinessOpen = false;
    this.router.navigate([`/social/business/${id}`]);
  }

  jsonToString(arr) {
    let return_val = '';
    for (let i = 0; i < arr.length; i++) {
      return_val += arr[i].name + ',';
    }
    return return_val;
  }

  gotoPage(page) {
    if (page < 1 || page > this.pages) {
      return;
    }
    this.page = page;
    this.fetchBusinesses();
  }

  gotoPreviousPage() {
    if (Number(this.current) - 1 === 0) {
      return;
    } else {
      this.page = Number(this.current) - 1;
      this.fetchBusinesses();
    }
  }

  gotoNextPage() {
    if (Number(this.current) + 1 > this.pages) {
      return;
    } else {
      this.page = Number(this.current) + 1;
      this.fetchBusinesses();
    }
  }

  pageChange(event) {
    // this.page = event;
    // console.log(event);
  }

  fetchBusinesses() {
    this.businessService.getBusinessesForSearch(this.page, this.searchData)
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

        this.businesses = [...business];
        this.filteredBusinesses = business;
        for (let i = 0; i < this.filteredBusinesses.length; i++) {
          if (this.filteredBusinesses[i].picture === 'default.png') {
            this.filteredBusinesses[i].picture = '../../../../assets/images/avatar/default.png';
          } else {
            if (this.filteredBusinesses[i].extraBlob === '2') {
              this.filteredBusinesses[i].picture = UrlJSON.displayPictureUrl + this.filteredBusinesses[i].picture;
            } else {
              this.filteredBusinesses[i].picture = UrlJSON.displayAvatarFromFSUrl + this.filteredBusinesses[i].picture;
            }
          }
        }
      });
  }

  fetchData() {
    this.page = 1;
    this.fetchBusinesses();
  }

}
