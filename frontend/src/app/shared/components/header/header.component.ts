import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { AdminNavigationService } from '../../services/admin-navigation.service';
import { UserNavigationService } from '../../services/user-navigation.service';
import { SearchService } from '../../services/search.service';
import { AuthService } from '../../../service/auth.service';
import { BusinessService } from 'src/app/shared/services/business.service';
import { Router, ActivatedRoute, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { UrlJSON } from '../../../views/json/urlJSON';
import { URL } from 'url';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { Subscription } from 'rxjs';
import { SocketService } from '../../../shared/services/socket.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
  stockQuote: number;
  sub: Subscription;

  notifications: any[];
  userName: String;
  userCountryName: String;
  userId: String;
  role: String;
  picture: String;
  logoPicture: String;
  extraBlob: String;
  isBusiness: Number = 0;
  pages: any = { page: 'Company Business', url: ''};
  tabs: any[];
  businessId: any;
  isRegister: boolean = false;
  customerId: String;

  constructor(
    private navService: NavigationService,
    private adminNavService: AdminNavigationService,
    private userNavService: UserNavigationService,
    public searchService: SearchService,
    private auth: AuthService,
    private router: Router,
    private businessService: BusinessService,
    private activatedRoute: ActivatedRoute,
    private socketService: SocketService,
    private toastr: ToastrService
  ) {
    this.notifications = [
      // {
      //   icon: 'i-Speach-Bubble-6',
      //   title: 'New message',
      //   badge: '3',
      //   text: 'James: Hey! are you busy?',
      //   time: new Date(),
      //   status: 'primary',
      //   link: '/chat'
      // },
      // {
      //   icon: 'i-Receipt-3',
      //   title: 'New order received',
      //   badge: '$4036',
      //   text: '1 Headphone, 3 iPhone x',
      //   time: new Date('11/11/2018'),
      //   status: 'success',
      //   link: '/tables/full'
      // },
      // {
      //   icon: 'i-Empty-Box',
      //   title: 'Product out of stock',
      //   text: 'Headphone E67, R98, XL90, Q77',
      //   time: new Date('11/10/2018'),
      //   status: 'danger',
      //   link: '/tables/list'
      // },
      // {
      //   icon: 'i-Data-Power',
      //   title: 'Server up!',
      //   text: 'Server rebooted successfully',
      //   time: new Date('11/08/2018'),
      //   status: 'success',
      //   link: '/dashboard/v2'
      // },
      // {
      //   icon: 'i-Data-Block',
      //   title: 'Server down!',
      //   badge: 'Resolved',
      //   text: 'Region 1: Server crashed!',
      //   time: new Date('11/06/2018'),
      //   status: 'danger',
      //   link: '/dashboard/v3'
      // }
    ];
  }

  ngOnInit() {
    this.tabs = [
      { title: 'Market Business', url: '/item/list', id: 1, active: false },
      { title: 'Social Business', url: '/social/list', id: 2, active: true },
      { title: 'Make Business', url: '/item/add', id: 3, active: false }
    ];
    this.userName = localStorage.getItem('userName');
    this.userId = localStorage.getItem('userId');
    this.userCountryName = localStorage.getItem('userCountry');
    this.role = localStorage.getItem('role');
    this.isBusiness = 0;
    this.customerId = localStorage.getItem('userId');
    if(localStorage.getItem('userId') && localStorage.getItem('userId') != '-1') {
      this.isRegister = true;
      this.businessService.getBusinessByID(localStorage.getItem('userId')).subscribe(res => {
          if(res){
              this.businessId = res['_id'];
          }
      });

      this.businessService.setOnlineStatusByID(localStorage.getItem('userId')).subscribe(res => {
        if(res){
            console.log(res);
        }
      });

    }
    this.logoPicture = localStorage.getItem('logoPicture');
    if (this.logoPicture === 'default.png' || this.userName === 'Anonymous User') {
      this.isBusiness = 1;
    } else {
      this.logoPicture = UrlJSON.displayPictureUrl + this.logoPicture;
    }
    this.picture = localStorage.getItem('picture');
    this.extraBlob = localStorage.getItem('extraBlob');
    if (this.picture === 'default.png') {
      this.picture = '../../../../assets/images/avatar/default.png';
    } else {
      if (this.extraBlob === '2') {
        this.picture = UrlJSON.displayAvatarFromFSUrl + this.picture;
      } else {
        this.picture =  UrlJSON.displayPictureUrl + this.picture;
      }
    }

   // this.infotoastr();
   this.friendsSocket();
  }

  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event) {
    if(localStorage.getItem('userId') && localStorage.getItem('userId') != '-1')
    this.businessService.setOfflineStatusByID(localStorage.getItem('userId')).subscribe(res => {
      if(res){
          console.log(res);
      }
    });
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHander(event) {
    if(localStorage.getItem('userId') && localStorage.getItem('userId') != '-1')
    this.businessService.setOfflineStatusByID(localStorage.getItem('userId')).subscribe(res => {
      if(res){
          console.log(res);
      }
    });
  }

  ngOnDestroy() {
    if(localStorage.getItem('userId') !== null)
    this.businessService.setOfflineStatusByID(localStorage.getItem('userId')).subscribe(res => {
      if(res){
          console.log(res);
      }
    });
  }

  pre_businessFriends_counts = 0;
  pre_favorites_counts = 0;
  friendsSocket(){
    this.sub = this.socketService.getMsg(this.customerId)
        .subscribe(quote => {

          let businessFriends = quote['data'];
          let favorites = quote['favorite'];
         
          if(businessFriends['businessFriends'].length === 0 && favorites.length === 0) return;
          if(businessFriends['businessFriends'].length === this.pre_businessFriends_counts && favorites.length === this.pre_favorites_counts) {
            return;
          } else 
          {
            
            this.notifications = [];
            this.pre_businessFriends_counts = businessFriends['businessFriends'].length;
            this.pre_favorites_counts = favorites.length;
  
            for(let j = 0; j < businessFriends['businessFriends'].length; j++){
  
              if (businessFriends['businessFriends'][j].picture === 'default.png') {
                businessFriends['businessFriends'][j].picture = '../../../../assets/images/avatar/default.png';
              } else {
                if (businessFriends['businessFriends'][j].extraBlob === '2') {
                  businessFriends['businessFriends'][j].picture = UrlJSON.displayAvatarFromFSUrl + businessFriends['businessFriends'][j].picture;
                } else {
                  businessFriends['businessFriends'][j].picture = UrlJSON.displayPictureUrl + businessFriends['businessFriends'][j].picture;
                }
              }
  
              // businessId, createdDate, extraBlob, picture, postId, requestUserName, userId
              if(businessFriends['businessFriends'][j].status === 0){
                let new_notification = {icon: 'i-Mail', title: ' sent you a friend request.', text: businessFriends['businessFriends'][j].requestUserName, time: businessFriends['businessFriends'][j].createdDate,
                                        status: 'success', link: '/social/request/'+ businessFriends['businessFriends'][j].businessId, picture: this.picture }
                this.notifications.push(new_notification);
              }
            }
            for(let f = 0; f < favorites.length; f++) {
              for(let p = 0; p < favorites[f]['postFavorite'].length; p++) {
                if(favorites[f]['postFavorite'][p].status !== 1 && this.customerId !== favorites[f]['postFavorite'][p].id ) {
                  let fav_noti = {icon: 'i-Like', title: ' likes one of your posts.' , text: favorites[f]['postFavorite'][p].user_name, time: favorites[f]['postFavorite'][p].createdDate,
                  status: 'primary', link: '/social/onepost/'+ favorites[f]._id, picture: this.picture };
                  this.notifications.push(fav_noti);
                }
              }
            }
          }
        });
  }
  
infotoastr()  
{  
  this.toastr.info("Important News", 'Information');  
}  
  
goHome() {
    if (this.role === '1') {
      this.router.navigate(['/user/list']);
    } else {
      this.router.navigate(['/social/list']);
    }
  }
  goToCompany(id) {
    if (this.role === '1' || this.role === '0') {
      this.router.navigate([`/social/business/${id}`]);
    } else {
      this.router.navigate([`/item/list`]);
    }
  }
  goToPrivate() {
    if (this.role === '1' || this.role === '0') {
      this.router.navigate([`/social/private`]);
    } else {
      this.router.navigate([`/item/list`]);
    }
  }
  goTo(event) {
    this.router.navigate([`/about`]);
    this.tabs.map(tab => tab.active = false);
  }

  goToAddBusiness() {
    this.router.navigate([`/social/addbusiness`]);
  }

  toggelSidebar() {
    const state = this.role === '1' ? this.adminNavService.sidebarState : this.userNavService.sidebarState ;
    // const state = this.navService.sidebarState ;
    // if(!state.sidenavOpen) {
    //   return state.sidenavOpen = true;
    // }
    if (state.childnavOpen && state.sidenavOpen) {
      return state.childnavOpen = false;
    }
    if (!state.childnavOpen && state.sidenavOpen) {
      return state.sidenavOpen = false;
    }
    if (!state.sidenavOpen && !state.childnavOpen) {
        state.sidenavOpen = true;
        setTimeout(() => {
            state.childnavOpen = true;
        }, 50);
    }
  }

  profileChange() {
    this.router.navigate([`/user/edit/${this.userId}`]);
    // if (this.role === '1') { // admin
    //   this.router.navigate([`/admin/edit/${this.userId}`]);
    // } else { // user
    //   this.router.navigate([`/user/edit/${this.userId}`]);
    // }
  }
  signout() {
    this.auth.signout();
  }

  focus() {
    const url1 = this.router.url.split('/')[1];
    if (url1 === 'user') {
      this.searchService.searchUserOpen = true;
    } else if (url1 === 'social') {
      this.searchService.searchBusinessOpen = true;
    } else {
      this.searchService.searchOpen = true;
    }
  }

  tabfunction(event) {
    this.tabs.map(tab => tab.active = false);
    this.tabs[event - 1].active = true;
  }
}
