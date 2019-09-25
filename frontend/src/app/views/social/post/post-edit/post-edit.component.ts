import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/shared/services/post.service';
import { UrlJSON } from '../../../../views/json/urlJSON';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit {

  posts: any;
  postText: any;
  countNumber: number;
  fullText = true;
  showMore = false;
  showLess = false;
  rmTextShort = '';
  rmTextFull = '';
  inputWords = [];
  description = '';
  postTitle: String;
  postPicture: String;
  id: any;
  modals: any[] = [
    { name: 'Alex Kozlov', picture: './assets/images/faces/1.jpg' },
    { name: 'Andrey Mikhil', picture: './assets/images/faces/3.jpg' },
    { name: 'David holdeman', picture: './assets/images/faces/2.jpg' },
    { name: 'Gabriel Loginov', picture: './assets/images/faces/4.jpg' },
    { name: 'Albert L. Jackson', picture: './assets/images/faces/5.jpg' },
    { name: 'William G. Hicks', picture: './assets/images/faces/10.jpg' },
    { name: 'Jason C. Cannon', picture: './assets/images/faces/12.jpg' },
    { name: 'Edward S. Haas', picture: './assets/images/faces/13.jpg' },
    { name: 'Fredrick B. Culley', picture: './assets/images/faces/15.jpg' },
    { name: 'Ruby S. Dodd', picture: './assets/images/faces/17.jpg' },
    { name: 'Timothy C. West', picture: './assets/images/faces/16.jpg' },
    { name: 'Conrad M. Spooner', picture: './assets/images/faces/17.jpg' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private modalService: NgbModal
    ) { }
  @ViewChild('search') searchElement: ElementRef;
  @ViewChild('comment') commentElement: ElementRef;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.postService.getPostDataById(this.id).subscribe(res => {
        this.posts = res;
        this.postTitle = this.posts.postTitle;
        this.postPicture = this.posts.picture;
        this.postText = this.posts.postDescription;
        if (this.posts.picture === 'default.png') {
          this.posts.picture = '../../../../assets/images/avatar/default.png';
        } else {
          if (this.posts.extraBlob === '2') {
            this.postPicture = UrlJSON.displayAvatarFromFSUrl + this.postPicture;
          } else {
            this.postPicture = UrlJSON.displayPictureUrl + this.postPicture;
          }
        }
        this.countNumber = this.postText.split(/\W+/).length;
        this.rmTextFull = this.postText;
        this.inputWords = this.postText.split(' ');
        if (this.inputWords.length > 50) {
          this.fullText = false;
          this.showMore = true;
          this.rmTextShort = this.inputWords.slice(0, 50).join(' ') + '...';
          this.description = this.rmTextShort;
        } else {
          if (this.inputWords.length < 50) {
            this.fullText = true;
            this.showMore = false;
            this.rmTextShort = this.inputWords.slice(0, 50).join(' ') + '...';
            this.description = this.postText;
          }
        }
      });
    });
  }
  readMore(flag) {
    if (flag) {
      this.showMore = false;
      this.fullText = true;
      this.showLess = true;
      this.description = this.postText;
    } else {
      this.showLess = false;
      this.showMore = true;
      this.fullText = false;
      this.description = this.rmTextShort;
    }
  }

  returnPost() {
    this.router.navigate([`/social/allpost`]);
  }
  sendRecommend() {
    alert('Send recommendation? I am testing..');
  }
  addMyfavorite() {
    alert('Add favorite? I am testing..');
  }
  showSearch() {
    this.searchElement.nativeElement.focus();
  }
  onChange() {
    alert(123);
  }
  showComment(value) {
    this.commentElement.nativeElement.focus(value);
  }
  modalFunction(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-title' });
  }
}
