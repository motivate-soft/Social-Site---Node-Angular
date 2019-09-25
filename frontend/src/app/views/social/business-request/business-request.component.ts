import { Component,OnInit,OnDestroy, ViewChild, ElementRef, AfterViewChecked, Query } from '@angular/core';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder  } from '@angular/forms';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { countryJSON } from '../../json/countryJSON';
import { categoryJSON } from '../../json/categoryJSON';
import { BusinessService } from 'src/app/shared/services/business.service';
import { UrlJSON } from '../../json/urlJSON';
import { PostService } from 'src/app/shared/services/post.service';
import { AuthService } from '../../../service/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { SocketService } from '../../../shared/services/socket.service';

@Component({
  selector: 'app-business-request',
  templateUrl: './business-request.component.html',
  styleUrls: ['./business-request.component.scss']
})
export class BusinessRequestComponent implements OnInit, AfterViewChecked, OnDestroy {
  businessId: any;
  businessToUserId: any;
  /*
  * Modal Dialog when clicking `Send Recommendatin`
  */
  closeResult: string;

  item: any[] = [];
  displayURL: SafeResourceUrl;

  currentUserData: any = {};

  displayBusinesses: any[] = [];
  onlineBusiness: any[] = [];
  offlineBusiness: any[] = [];

  onlineUser = 0;
  page: Number = 1;

  pageNumber = 1;
  throttle = 150;
  scrollDistance = 0;
  divDisabled: boolean = false;
  url: any;
  video: any;
  isVideo: any;
  video_url = "https://www.youtube.com/embed/";
  logo_url: any;

  public logo_imagepath;
  public imagePath;

  // Create Post
  formBasic: FormGroup;
  loading: boolean;
  radioGroup: FormGroup;
  radioGroup_active: FormGroup;
  modalSmall: any;
  customerId: string;
  email: String;
  updatedPostId: String;
  searchForm: FormGroup;
  
  @ViewChild('smallModal_view') smallModal_view: ElementRef;
  @ViewChild('postTitle') postTitle: ElementRef;
  @ViewChild('picture') picture: ElementRef;
  @ViewChild('request') request: ElementRef;
  @ViewChild('inputVideoUrl') inputVideoUrl: ElementRef;
  @ViewChild('descriptionTitle') descriptionTitle: ElementRef;
  @ViewChild('descriptionContent') descriptionContent: ElementRef;

  toolTitle: String = 'Create';
  postButton: String = 'Share';
  selectedFile = null;
  chooseFileName = 'Choose File';
  fileType = false;
  userPicture: String;
  userName: String = '';
  extraBlob: string = '2';
  postTile: String;
  likeDivId: String = "";
  isRegister: boolean = false;
  isRequest: boolean = false;
  isMovie: boolean = false;
  strDescription: String;
  selectedCommentId: String = '101';
  pictureContentType: String;
  insertPostData: any = { picture: 'default.png',video: '', pictureChanged: false };

  _uploadPictureToMongoUrl = UrlJSON.uploadPictureToMongoUrl111;

  // business: any[] = [];
  // businesses: any[] = [];

  role = '0';
  post: any[] = [];
  posts: any[] = [];

  searchUserData = { country: 'All', category: 'All', fromDate: '', toDate: '', userid: '' };
  searchData = { country: 'All', category: 'All', fromDate: '', toDate: '', userid: '' };
  countryArr = countryJSON;
  countryModel: number[] = [];
  countryOptions: IMultiSelectOption[];
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

  categoryArr = categoryJSON;
  categoryModel: number[] = [];
  categoryOptions: IMultiSelectOption[];
  categoryWarn: false;
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
  

  companyName: String = '';
  companyLogo: String;
  country: string = '';
  category: string = '';
  offerType: String = '';
  isBusiness: boolean = false;
  isGolden: String = 'simple';




  safe_url: SafeResourceUrl;
  /*
  * Recommendation modal
  */
  modals: any[] = [];
  businessFriendsCount = 0;
  // -----------------------
  alarms: any[] = []

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private el: ElementRef,
    private businessService: BusinessService,
    private postService: PostService,
    private auth: AuthService,
    private sanitizer: DomSanitizer,
    private socketService: SocketService,
    ) {
      this.route.params.subscribe(params => {
        this.businessId = params.id;
      });
    }
  @ViewChild('comment') commentElement: ElementRef;

  ngOnInit() {
    this.currentUserData.country = localStorage.getItem('userCountry');
    this.currentUserData.category = localStorage.getItem('userCategory');
    this.role = localStorage.getItem('role');
  
    this.customerId = localStorage.getItem('userId');
   // this.fetchAllPosts();
    this.buildFormBasic();
    this.radioGroup = this.fb.group({
      radio: [0]
    });
    this.radioGroup_active = this.fb.group({
      radio_active: [0]
    });

    this.searchForm = this.fb.group({
      searchCountry: '',
      searchCategory: '',
    })

    this.userPicture = localStorage.getItem('picture');
    this.extraBlob = localStorage.getItem('extraBlob');
    if (this.userPicture === 'default.png') {
      this.userPicture = '../../../../assets/images/avatar/default.png';
    } else {
      if (this.extraBlob === '2') {
        this.userPicture = UrlJSON.displayAvatarFromFSUrl + this.userPicture;
      } else {
        this.userPicture =  UrlJSON.displayPictureUrl + this.userPicture;
      }
    }

    this.isRegister = true;
    this.userName = localStorage.getItem('userName');
    this.businessService.getBusinessByBusinessID(this.businessId).subscribe(res => {
      if(res){
          if(res === []) return;

          this.companyLogo = res['logo'];
          this.country = res['country'];
          this.companyName = res['businessName'];
          this.businessId = res['_id'];
          this.category = res['category'];
          this.offerType = res['offerType'];
          this.email = res['email'];
          this.isBusiness = true;

          this.businessToUserId = res['user_id'];

          this.filterData();

          this.businessFriendsCount =res.businessFriends.length;
          if( this.businessFriendsCount > 0)
          for(let i = 0; i < res['businessFriends'].length; i++) {
            if (res['businessFriends'][i].businessPicture === 'default.png') {
              res['businessFriends'][i].businessPicture = '../../../../assets/images/avatar/default.png';
            } else {
              if (res['businessFriends'][i].extraBlob === '2') {
                res['businessFriends'][i].businessPicture = UrlJSON.displayAvatarFromFSUrl + res['businessFriends'][i].businessPicture;
              } else {
                res['businessFriends'][i].businessPicture = UrlJSON.displayPictureUrl + res['businessFriends'][i].businessPicture;
              }
            }

            if(this.businessId !== res['businessFriends'][i].businessId) {
              let business_friend = {businessId: res['businessFriends'][i].businessId, userId: res['businessFriends'][i].businessUserId,  businessName: res['businessFriends'][i].businessName, businessPicture: res['businessFriends'][i].businessPicture};
              this.modals.push(business_friend);
            }
          }
      }
      else {
        this.filterData();
      }

  });

    this.countryOptions = this.countryArr;
    this.categoryOptions = this.categoryArr;
    this.searchUserData.userid = this.customerId;
    
  }
  ngAfterViewChecked() {
    // this.business = [...this.business];
    
    this.post = [...this.post];
  }
  ngOnDestroy() {
    
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
    this.fetchAllPosts();
  }

  fetchAllPosts() {
    // this.spinner.show();
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

    this.postService.getAllPostsForDatatable(this.searchData)
      .subscribe((val: any[]) => {
        // this.spinner.hide();
        const post = val['post'].slice().reverse();
        
        

        for(let f = 0; f < post.length; f++) {
          for(let k = 0; k < post[f].postRecommend.length;k++) {
            
            if(post[f].postRecommend[k].id === this.businessToUserId) {
              
              this.post.push(post[f]);
            }
          }
        }
        
        this.posts = this.post;

        for (let i = 0; i < this.posts.length; i++) {
          this.posts[i].favoriteButton = ' Like'; this.posts[i].favoriteButtonClass = 'text-20 i-Like';
          this.posts[i].sendRecomContent = 'Send As a Recommendation';
          this.posts[i].countRecomment = 0;
          this.posts[i].originPicture = this.posts[i].picture;
          if (this.posts[i].picture === 'default.png') {
            this.posts[i].picture = '../../../../assets/images/avatar/default.png';
            this.posts[i].isPicture = 'none';
          } else {
            if (this.posts[i].extraBlob === '2') {
              this.posts[i].picture = UrlJSON.displayAvatarFromFSUrl + this.posts[i].picture;
            } else {  
              this.posts[i].picture = UrlJSON.displayPictureUrl + this.posts[i].picture;
            }
          }

          if(this.posts[i].companyExtraBlob === '2') this.posts[i].companyLogo = UrlJSON.displayAvatarFromFSUrl + this.posts[i].companyLogo;
          else this.posts[i].companyLogo = UrlJSON.displayPictureUrl + this.posts[i].companyLogo;
          
          this.posts[i].isVideo = 'exist';
          if(this.posts[i].video == undefined || this.posts[i].video == '') {
            this.posts[i].isVideo = 'none';
            this.posts[i].originVideo = 'none';
          } else {
            this.posts[i].originVideo = this.posts[i].video;
          }

          this.posts[i].countLike = 0;
          this.posts[i].countLove = 0;
          this.posts[i].countHaha = 0;
          this.posts[i].countWow = 0;
          this.posts[i].countSad = 0;
          this.posts[i].countAngry = 0;
          this.posts[i].countAll = this.posts[i].postFavorite.length;

          for(let j = 0; j < this.posts[i].postFavorite.length;j++) {
            if(this.posts[i].postFavorite[j].favorite == 'like') this.posts[i].countLike += 1;
            if(this.posts[i].postFavorite[j].favorite == 'love') this.posts[i].countLove += 1;
            if(this.posts[i].postFavorite[j].favorite == 'haha') this.posts[i].countHaha += 1;
            if(this.posts[i].postFavorite[j].favorite == 'wow') this.posts[i].countWow += 1;
            if(this.posts[i].postFavorite[j].favorite == 'sad') this.posts[i].countSad += 1;
            if(this.posts[i].postFavorite[j].favorite == 'angry') this.posts[i].countAngry += 1;
            if(this.posts[i].postFavorite[j].id == this.customerId) {
              this.posts[i].myFavorite = true;
              this.posts[i].countAll -= 1;
              if(this.posts[i].postFavorite[j].favorite == 'like') { this.posts[i].favoriteButton = ' Like'; this.posts[i].favoriteButtonClass = 'text-20 favorite-icon i-Like'; }
              if(this.posts[i].postFavorite[j].favorite == 'love') { this.posts[i].favoriteButton = ' Love'; this.posts[i].favoriteButtonClass = 'text-20 favorite-icon i-Love1'; }
              if(this.posts[i].postFavorite[j].favorite == 'haha') { this.posts[i].favoriteButton = ' Haha'; this.posts[i].favoriteButtonClass = 'text-20 favorite-icon i-Humor'; }
              if(this.posts[i].postFavorite[j].favorite == 'wow') { this.posts[i].favoriteButton = ' Wow'; this.posts[i].favoriteButtonClass = 'text-20 favorite-icon i-Surprise'; }
              if(this.posts[i].postFavorite[j].favorite == 'sad') { this.posts[i].favoriteButton = ' Sad'; this.posts[i].favoriteButtonClass = 'text-20 favorite-icon i-Thumbs-Down-Smiley'; }
              if(this.posts[i].postFavorite[j].favorite == 'angry') { this.posts[i].favoriteButton = ' Angry'; this.posts[i].favoriteButtonClass = 'text-20 favorite-icon i-Angry'; }
            } 
            else {
              this.posts[i].myFavorite = false;
            }
          }
          
          this.posts[i].countRecomment = this.posts[i].postRecommend.length;
          for(let k = 0; k < this.posts[i].postRecommend.length;k++) {
            
            if(this.posts[i].postRecommend[k].id === this.customerId) {
              this.posts[i].myRecommend = true;
              this.posts[i].sendRecomContent = 'Already sent';
            } 
            else {
              this.posts[i].myRecommend = false;
            }
          }

          for(let c = 0; c < this.posts[i].postComments.length; c++) {
            
            if (this.posts[i].postComments[c].commentUserPicture === 'default.png') {
              this.posts[i].postComments[c].commentUserPicture = '../../../../assets/images/avatar/default.png';
            } else {
              if (this.posts[i].postComments[c].extraBlob === '2') {
                this.posts[i].postComments[c].commentUserPicture = UrlJSON.displayAvatarFromFSUrl + this.posts[i].postComments[c].commentUserPicture;
              } else {
                this.posts[i].postComments[c].commentUserPicture = UrlJSON.displayPictureUrl + this.posts[i].postComments[c].commentUserPicture;
              }
            }
          }
          
        }
        
        this.sanitizeAndEmbedURLs(this.post);
      });
  }
  getSafeUrl(url) { 
		this.displayURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);		
  }
  
  private sanitizeAndEmbedURLs(links) {
    for(let i = 0; i < links.length; i++) {
      links[i].video = this.sanitizer.bypassSecurityTrustResourceUrl(this.video_url + links[i].video);
    }
   }

  getCurrentPage() {
    return localStorage.getItem('socialPage');
  }

  showComment(id) {
   // this.commentElement.nativeElement.focus(value);
   this.selectedCommentId = id;
  }
  modalFunction(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-title' });
  }

  buildFormBasic() {
    this.formBasic = this.fb.group({
      experience: []
    });
  }

  displayFavorite(id) {
    document.getElementById(`${id}`).style.display = "inline-block";
    this.likeDivId = id;
  }

  noneDisplayFavorite() {
    if(this.likeDivId !== "") {
      document.getElementById(`${this.likeDivId}`).style.display = "none";
      this.likeDivId = "";
    }
  }

  @ViewChild('videoPlayer') videoplayer: ElementRef;
  
  toggleVideo(event: any) {
      this.videoplayer.nativeElement.play();
  }

  goToBusiness(id) {
    this.router.navigate([`/social/business/${id}`]);
  }

  deletePost(data) {
    let delete_data = {_id: data._id};
    this.postService.deletePost(delete_data)
      .subscribe(
        res=> {
          this.post = [];
          this.fetchAllPosts();
        },
        err=>{
          alert(err);
        }
      )
  }

  favorite(id, feel) {
    
    if(!this.isRegister) {
      alert("You are not a registered user. Please sign up.");
      this.auth.signout();
      return;
    }

    let feel_data = {_id: id, id: this.customerId, favorite: feel};
    this.postService.favoritePost(feel_data)
      .subscribe(
        res=> {
          this.fetchAllPosts();
        },
        err=>{
          alert(err);
        }
      )
  }
  toggleFavorite(id, isFavorite) {
    if(isFavorite) {
      let feel_data = {_id: id, id: this.customerId};
      this.postService.favoriteDelete(feel_data)
      .subscribe(
        res=> {
          this.fetchAllPosts();
        },
        err=>{
          alert(err);
        }
      )
    }
    else {
      this.favorite(id, 'like');
    }
  }
  keyupDescription(value) {
    this.strDescription = value;
  }

  /*
  * selected postId to do not post itself
  */
 selectedUserId: String;

  sendRecommend(postId, userId, isRecommend, content) {
  
    if(!this.isRegister) {
      this.auth.signout();
      return;
    }
    if(isRecommend) {
      alert("Already Sent");
      return;
    }
    this.selectedUserId = userId;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      
      if(!this.isBusiness) {
        alert('Please register your business first.');
        this.router.navigate([`/social/addbusiness`]);
        return;
      }
     
        this.checkedUserFriends.push(this.customerId);
        this.checkedBusinessFriends.push(this.businessId);
      
      if(this.checkedBusinessFriends.length !== this.checkedUserFriends.length) {
        alert("Input Error!, Please confirm again."); return;
      }
      let send_object = {_id: postId, from: this.checkedUserFriends, to: userId, businesses: this.checkedBusinessFriends}; // from: userId array, to: recommended user, businesses: recommended array
      this.postService.sendRecommended(send_object)
      .subscribe(
        res=> {
          this.checkedUserFriends = [];
          this.checkedBusinessFriends = [];
          this.fetchAllPosts();
        },
        err=>{
          alert(err);
        }
      )
    }, (reason) => {});
  }
  confirm(_id, requestUserId){
    let request_confirm = {_id: _id, id: requestUserId};
    this.postService.confirmRecommended(request_confirm)
      .subscribe(
        res=> {
          console.log(res);
        },
        err=>{
          alert(err);
        }
      );
  }

  delete(_id, requestUserId){
    let delete_confirm = {_id: _id, id: requestUserId};
    this.postService.deleteRecommended(delete_confirm)
      .subscribe(
        res=> {
          console.log(res);
        },
        err=>{
          alert(err);
        }
      );
  }

  comment(_id, value) {
    if(value === '') return;

    let add_comment = { _id: _id, id: this.customerId, comment: value };
    this.postService.addComment(add_comment)
      .subscribe(
        res=> {
          this.fetchAllPosts();
          this.showComment(_id);
        },
        err=>{
          alert(err);
        }
      );
  }
  /*
  * Checked businessFriends ID
  */
 checkedBusinessFriends = [];
 checkedUserFriends = [];

  onChange(content, isChecked) {
    if (isChecked) {
      this.checkedBusinessFriends.push(content.businessId);
      this.checkedUserFriends.push(content.userId);
    } else {
      let index = this.checkedBusinessFriends.findIndex(businessId => businessId === content.businessId);
      this.checkedBusinessFriends.splice(index, 1);
      let user_index = this.checkedUserFriends.findIndex(userId => userId === content.userId);
      this.checkedUserFriends.splice(user_index, 1);
    }
  }

  checkBoxFilter(isChecked) {
    
    if(!isChecked) {
      if(this.checkedBusinessFriends.length > 2) {
        alert("You can select max 3 businesses. Please select again.");
        return;
      }
    }
  }
}
