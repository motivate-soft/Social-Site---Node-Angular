import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { BusinessService } from 'src/app/shared/services/business.service';
import { UrlJSON } from '../../json/urlJSON';
import { PostService } from 'src/app/shared/services/post.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-private-business',
  templateUrl: './private-business.component.html',
  styleUrls: ['./private-business.component.scss']
})
export class PrivateBusinessComponent implements OnInit, AfterViewChecked {

  modalSmall: any;
  deleteButton: String;
  companyName: String;

  divDisabled: boolean = false;
  url: any;
  video: any;
  isVideo: any;
  logo_url: any;

  public logo_imagepath;
  public imagePath;
  loading: boolean;

  fileType = false;
  userPicture: String;
  userName: String = '';
  extraBlob: string = '2';
  postTile: String;
  pictureContentType: String;
  likeDivId: String = "";
  customerId: string;
  isRegister: boolean = false;
  isRequest: boolean = false;
  isComment: boolean = false;
  businessId: any;
  companyLogo: String;
  country: String = '';
  category: String = '';
  offerType: String = '';
  isBusiness: boolean = false;
  isGolden: String = 'simple';

  searchUserData = { country: 'All', category: 'All', fromDate: '', toDate: '', userid: '' };
  searchData = { country: 'All', category: 'All', fromDate: '', toDate: '', userid: '' };
  page: Number = 1;

  role = '0';
  post: any[] = [];
  posts: any[] = [];

  postRecommend: any[] = [];
  postRecommends: any[] = [{postRecommend: []}];

  @ViewChild('smallModal_view') smallModal_view: ElementRef;
  @ViewChild('request') request: ElementRef;

  constructor(
      private modalService: NgbModal,
      private router: Router,
      private http: HttpClient,
      private el: ElementRef,
      private businessService: BusinessService,
      private postService: PostService,
      private auth: AuthService,
    ) { }

  columns_recommendations = [
    { name: 'Name' },
    { name: 'Recommendation Number' },
    { name: 'Recommendation Link' },
    { name: 'Option' }
  ];
  columns_reads = [
    { name: 'Name' },
    { name: 'Link' },
    { name: 'Option' }
  ];
  columns_contacted_companies = [
    { name: 'Company Name' },
    { name: 'Category' },
    { name: 'Link' },
    { name: 'Address'},
    { name: 'PhoneNumber' }
  ];
  columns_deals = [
    { name: 'Name' },
    { name: 'Content' },
  ];
  deals = [
    { name: 'Deal Name 1', content: 'Deal description 1' }
  ];
  recommendations = [
    { name: 'Recommendation 1 ', recommendationNumber: '2143414321214', recommendationLink: '<a href="mailto:info@keb.at">www@www.com</a>', option: 'delete' },
    { name: 'Recommendation 2 ', recommendationNumber: '5143414325214', recommendationLink: '<a href="mailto:info@keb.at">www@www.com</a>', option: 'delete' },
    { name: 'Recommendation 3 ', recommendationNumber: '9143414321214', recommendationLink: '<a href="mailto:info@keb.at">www@www.com</a>', option: 'delete' },
    { name: 'Recommendation 4 ', recommendationNumber: '3143414321214', recommendationLink: '<a href="mailto:info@keb.at">www@www.com</a>', option: 'delete' }
  ];
  reads = [
    { name: 'Reads Name 1 ', link: '<a href="mailto:info@keb.at">www@www.com</a>', option: 'delete' },
    { name: 'Reads Name 2 ', link: '<a href="mailto:info@keb.at">www@www.com</a>', option: 'delete' },
    { name: 'Reads Name 3 ', link: '<a href="mailto:info@keb.at">www@www.com</a>', option: 'delete' },
    { name: 'Reads Name 4 ', link: '<a href="mailto:info@keb.at">www@www.com</a>', option: 'delete' }
  ];
  contacted_companies = [
    { companyName: 'AAA', category: 'Hi-tech', link: '<a href="mailto:info@keb.at">www@www.com</a>', address: 'Russia Federation', phoneNumber: '43244432' },
    { companyName: 'Extn', category: 'Baby', link: '<a href="mailto:info@keb.at">www@www.com</a>', address: 'United State', phoneNumber: '123123123' }
  ];
  ngOnInit() {
    this.customerId = localStorage.getItem('userId');

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
    if(this.customerId && this.customerId != '-1') {
      this.isRegister = true;
        this.businessService.getBusinessByID(this.customerId).subscribe(res => {
          if(res){
              
              this.companyLogo = res['logo'];
              this.country = res['country'];
              this.companyName = res['businessName'];
              this.businessId = res['_id'];
              this.category = res['category'];
              this.offerType = res['offerType'];
              this.isBusiness = true;
          }

      });
    }

    this.fetchAllPosts();
  }

  ngAfterViewChecked() {
    this.posts = [...this.posts];
  }

  getCurrentPage() {
    return localStorage.getItem('socialPage');
  }

  fetchAllPosts() {

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

        // postFavorite
        this.post = [];
        // Recommend
        this.postRecommend = [];
        
        for(let f = 0; f < post.length; f++) {
          for(let k = 0; k < post[f].postFavorite.length;k++) {
            
            if(post[f].postFavorite[k].id === this.customerId) {
              
              this.post.push(post[f]);
            }
          }
          for(let r = 0; r < post[f].postRecommend.length;r++) {
            
            if(post[f].postRecommend[r].id === this.customerId && post[f].postRecommend[r].status !== -1) {
              
              this.postRecommend.push(post[f]);
            }
          }
        }
        
        this.posts = this.post;
        this.postRecommends = this.postRecommend

        for (let i = 0; i < this.posts.length; i++) {
          this.posts[i].favoriteButton = ' Like'; this.posts[i].favoriteButtonClass = 'text-20 i-Like';

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
        }
        
      });
  }

  openModal(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }

  modalFunction(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-title' });
  }

  deleteFavorite(content, id) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        let feel_data = {_id: id, id: this.customerId};
        this.postService.favoriteDelete(feel_data)
        .subscribe(
          res=> {
            this.fetchAllPosts();
          },
          err=>{
            alert(err);
          }
        );
      }, (reason) => {});
  }

  deleteRecommend(content, id) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        let delete_confirm = {_id: id, id: this.customerId};
        this.postService.deleteRecommended(delete_confirm)
          .subscribe(
            res=> {
              this.fetchAllPosts();
            },
            err=>{
              alert(err);
            }
          );
      }, (reason) => {});
  }

  goToBusiness(id) {
    this.businessService.getBusinessByID(id).subscribe(res => {
      if(res){
          this.router.navigate([`/social/business/${res['_id']}`]);
      }
    });
  }
  goToPost(id) {
    this.router.navigate([`/social/onepost/${id}`]);
  }
}
