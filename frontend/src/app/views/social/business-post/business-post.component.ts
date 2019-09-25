import { Component,Pipe, PipeTransform, OnInit,OnDestroy, ViewChild, ElementRef, AfterViewChecked, Query } from '@angular/core';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { countryJSON } from '../../json/countryJSON';
import { categoryJSON } from '../../json/categoryJSON';
import { BusinessService } from 'src/app/shared/services/business.service';
import { UrlJSON } from '../../json/urlJSON';
import { PostService } from 'src/app/shared/services/post.service';
import { AuthService } from '../../../service/auth.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

import { SocketService } from '../../../shared/services/socket.service'; 

@Component({
  selector: 'app-business-post',
  templateUrl: './business-post.component.html',
  styleUrls: ['./business-post.component.scss']
})
export class AnotherComponent implements OnInit, AfterViewChecked, OnDestroy {

  stockQuote: number;
  sub: Subscription;
  /*
  * Modal Dialog when clicking `Send Recommendatin`
  */
  closeResult: string;

  item: any[] = [];
  displayURL: SafeResourceUrl;

  currentUserData: any = {};

  displayBusinesses: any[] = [];
  onlineBusiness: any[] = [];
  onlineUsers: any[] = [];
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
  

  countFavorite = 0;
  countRecommend = 0;
  countMessages = 0;
  countLeads = 0;
  countAll = 0;

  businessId: any;
  companyName: String = '';
  companyLogo: String;
  country: string = '';
  category: string = '';
  offerType: String = '';
  isBusiness: boolean = false;
  isGolden: String = 'simple';

  maxUploadSize = 30000000; // byte



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
    // private spinner: NgxSpinnerService
    ) { }
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

    this.userName = localStorage.getItem('userName');
    if(localStorage.getItem('userId') && localStorage.getItem('userId') != '-1') {
      this.isRegister = true;
      this.businessService.getBusinessByID(localStorage.getItem('userId')).subscribe(res => {
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
             
              this.searchUserData.country = this.country + ',';
              
              this.searchUserData.category = this.category + ',';

              this.modals = [];

              var country_val = this.country;
              var country_index = this.countryArr.findIndex(function(item, i){
                return item.name === country_val;
              });
              this.countryModel.push(country_index + 1);
              var category_val = this.category;
              var category_index = this.categoryArr.findIndex(function(item, i){
                return item.name === category_val;
              });
              this.categoryModel.push(category_index + 1);

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
    } else this.filterData();

    this.countryOptions = this.countryArr;
    this.categoryOptions = this.categoryArr;
    this.searchUserData.userid = this.customerId;

    this.friendsSocket();
    
  }
  ngAfterViewChecked() {
    // this.business = [...this.business];
    
    this.post = [...this.post];
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
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

  friendsSocket(){
    this.sub = this.socketService.getQuotes(this.customerId)
        .subscribe(quote => {
         this.alarms = [];

         this.onlineBusiness = [];
         this.offlineBusiness = [];
         
         let tmp = quote['business'].slice().reverse();
          for(let i = 0; i < tmp.length; i++) {
            if(tmp[i].onlineStatus === 1) this.onlineBusiness.push(tmp[i]);
            else this.offlineBusiness.push(tmp[i]);
          }

          this.onlineUser = Object.keys(quote['user']).length;
          this.onlineUsers = quote['user'];
         
         this.countFavorite = 0;
         this.countRecommend = 0;
         this.countMessages = 0;
         this.countLeads = 0;
         this.countAll = 0;

       

          for(let i = 0; i < Object.keys(quote['data']).length; i++){
            this.countFavorite += Object.keys(quote['data'][i].postFavorite).length;
            this.countRecommend += Object.keys(quote['data'][i].postRecommend).length;
            this.countAll += Object.keys(quote['data'][i].postRecommend).length;
            this.countMessages += Object.keys(quote['data'][i].postComments).length;
            for(let j = 0; j < Object.keys(quote['data'][i].postRecommend).length; j++){

              if (quote['data'][i].postRecommend[j].picture === 'default.png') {
                quote['data'][i].postRecommend[j].picture = '../../../../assets/images/avatar/default.png';
              } else {
                if (quote['data'][i].postRecommend[j].extraBlob === '2') {
                  quote['data'][i].postRecommend[j].picture = UrlJSON.displayAvatarFromFSUrl + quote['data'][i].postRecommend[j].picture;
                } else {
                  quote['data'][i].postRecommend[j].picture = UrlJSON.displayPictureUrl + quote['data'][i].postRecommend[j].picture;
                }
              }

              if(quote['data'][i].postRecommend[j].status === 1) this.countLeads += 1;

              if(quote['data'][i].postRecommend[j].postTitle == undefined) {quote['data'][i].postRecommend[j].postTitle = ""}

              if(quote['data'][i].postRecommend[j].status !== -1){
                let new_alarm = {_id: quote['data'][i]._id, requestUserId: quote['data'][i].postRecommend[j].id, from: quote['data'][i].postRecommend[j].requestUserName, to: "My Post:" + quote['data'][i].postRecommend[j].postTitle, 
                                status: quote['data'][i].postRecommend[j].status, picture: quote['data'][i].postRecommend[j].picture, extraBlob: quote['data'][i].postRecommend[j].extraBlob};
                this.alarms.push(new_alarm);
              }
            }
          }
        });
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
        
        this.post = [...post];
        this.posts = post;

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
              this.posts[i].sendRecomContent = 'Send recommendation';
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
   setTimeout(function() {
    document.getElementById("comment_"+id).focus();
    document.getElementById("comment_"+id).innerHTML = '';
   }, 100);
  }
  modalFunction(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-title' });
  }

  openPost() {
    
    if(!this.isBusiness) {
      alert('Please register your business first.');
      this.router.navigate([`/social/addbusiness`]);
    }
    if(!this.isRegister) {
      // alert("You are not a registered user. Please sign up.");
      this.auth.signout();
    }
    this.divDisabled = true;
  }
  closePost() {
    this.divDisabled = false;
    this.isRequest = false;
    this.isMovie = false;
    this.selectedCommentId = '101';
    this.video = '';
    this.url = null;
    this.isVideo = null;
    this.strDescription = null;
    this.insertPostData.video = '';
    this.insertPostData.picture = 'default.png';
    this.inputVideoUrl.nativeElement.value = '';
    this.postTitle.nativeElement.value = '';
    this.descriptionTitle.nativeElement.value = '';
    this.descriptionContent.nativeElement.value = '';
    this.toolTitle = 'Create';
    this.postButton = 'Share';
  }

  openRequest() {
    this.openPost();
    this.isRequest = true;
  }

  openMovie() {
    this.openPost();
    this.isMovie = true;
  }

  onSelectFile(event) { // called each time file input changes
    if(event.target.files[0] == undefined) return;
    this.fileType = event.target.files[0].type === '';
    if (this.fileType) {
      return;
    }
    // limit type: allowed image and video
    if(event.target.files[0].type.split('/')[0] !== 'image') {
      alert('Input error! Please input your photo.');
      return;
    }
    this.chooseFileName = event.target.files[0].name;

    // limit size
    if(event.target.files[0].size > this.maxUploadSize) {
      alert("Exceeded Size! Max size is 30MB.");
      return;
    }

    const inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    const fileCount: number = inputEl.files.length;
    const formData = new FormData();
    if (fileCount > 0) { // a file was selected
      for (let i = 0; i < fileCount; i++) {
        formData.append('file', inputEl.files.item(i));
      }
      this.http
        .post(this._uploadPictureToMongoUrl, formData).subscribe(
          res => {
            this.insertPostData.picture = res['fileName'];
          },
          err => console.log(err));
    }

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.imagePath = event.target.files;
      this.pictureContentType = this.imagePath[0].type;
      this.isVideo = this.pictureContentType.split('/')[0];
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = reader.result; //add source to image
      }
    }
  }

  buildFormBasic() {
    this.formBasic = this.fb.group({
      experience: []
    });
  }

  savePost() {
    if(this.toolTitle === 'Edit') { // this.updatedPostId
      this.insertPostData = { _id: this.updatedPostId, postTitle: this.postTitle.nativeElement.value, picture: this.insertPostData.picture, postDescriptionTitle: this.descriptionTitle.nativeElement.value, 
        postDescription: this.descriptionContent.nativeElement.value, pictureContentType: this.pictureContentType, video: this.insertPostData.video };
      this.postService.updatePost(this.insertPostData)
        .subscribe(
          res=> {
            this.closePost();
            this.fetchAllPosts();
          },
          err=>{
            alert(err);
          }
        )
    }
    else {
      if (this.fileType) {
        return;
      }
      this.postTile = this.postTitle.nativeElement.value;
      this.insertPostData = { postTitle: this.postTile, picture: this.insertPostData.picture, postDescriptionTitle: this.descriptionTitle.nativeElement.value, 
                    postDescription: this.descriptionContent.nativeElement.value, id: this.customerId, pictureContentType: this.pictureContentType, video: this.insertPostData.video };
      this.postService.insertPost(this.insertPostData)
        .subscribe(
          res => {
            
            this.fetchAllPosts();
       
            this.isVideo = null;
  
            this.insertPostData = {picture: 'default.png', video: '', pictureChanged: false };
            
            this.closePost();
          },
          err => alert(err));
    }
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

  previewVideo(video) {
    this.isVideo = 'video';
    this.video = video;
    this.insertPostData.video = video;
    this.getSafeUrl(this.video_url + video);
  }

  goToBusiness(id) {
    this.router.navigate([`/social/business/${id}`]);
  }

  editPost(data) {
    this.openPost();
    //this.divDisabled = true;
    this.isRequest = false;
      
    if(data.originVideo !== 'none') {
      this.previewVideo(data.originVideo);
      this.isMovie = true;
      this.inputVideoUrl.nativeElement.value = data.originVideo;
      this.insertPostData.video = data.originVideo;
    }
    if(data.isPicture !== 'none') {
      this.url = data.picture;
      this.insertPostData.picture = data.originPicture;
      this.pictureContentType = data.pictureContentType;
    }
      
    this.postTitle.nativeElement.value = data.postTitle;
    this.descriptionTitle.nativeElement.value = data.postDescriptionTitle;
    this.descriptionContent.nativeElement.value = data.postDescription;
    this.strDescription = data.postDescription;
    this.toolTitle = 'Edit';
    this.postButton = 'Update';
    this.updatedPostId = data._id;

    setTimeout(function() {
      document.getElementById("postTitle").focus();
     }, 100);
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

  favorite(id, feel, modal) {
    
    if(!this.isRegister) {
      alert("You are not a registered user. Please sign up.");
      this.auth.signout();
      return;
    }

    if(!this.isBusiness) {
      alert('Please register your business first.');
      this.router.navigate([`/social/addbusiness`]);
    }

    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
    .result.then((result) => {
     
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
    }, (reason) => {});
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
      // alert("You are not a registered user. Please sign up.");
      this.auth.signout();
    }
    if(!this.isRegister) {
      this.auth.signout();
      return;
    }
    if(isRecommend) {
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

  addEvent(value) {
    let new_event = {userId: this.customerId, email: this.email, event: value};
    this.businessService.addBusinessEvent(new_event).subscribe(res => {
        if(res){
        }
    });
  }

  goToEvent(id) {
    this.router.navigate([`/social/event/${id}`]);
  }
}
