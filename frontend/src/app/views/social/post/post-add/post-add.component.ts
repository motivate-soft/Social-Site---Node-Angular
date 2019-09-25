import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UrlJSON } from '../../../json/urlJSON';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { PostService } from 'src/app/shared/services/post.service';

@Component({
  selector: 'app-post-add',
  templateUrl: './post-add.component.html',
  styleUrls: ['./post-add.component.scss']
})
export class PostAddComponent implements OnInit {

  @ViewChild('postTitle') postTitle: ElementRef;
  @ViewChild('picture') picture: ElementRef;
  @ViewChild('description') description: ElementRef;

  postTile: String;
  selectedFile: String = 'Choose File';
  insertPostData: any = { picture: 'default.png', pictureChanged: false };
  _uploadPictureToMongoUrl = UrlJSON.uploadPictureToMongoUrl111;
  constructor(private router: Router, private http: HttpClient, private postService: PostService, private el: ElementRef ) { }

  fileType = false;

  ngOnInit() {
    this.fetchPosts();
  }

  onFileSelected(event) {
    this.fileType = event.target.files[0].type === '';
    if (this.fileType) {
      return;
    }
    this.selectedFile = event.target.files[0].name;
    const inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    const fileCount: number = inputEl.files.length;
    const formData = new FormData();
    if (fileCount > 0) { // a file was selected
      for (let i = 0; i < fileCount + 1; i++) {
        formData.append('file', inputEl.files.item(i));
      }
      this.http
        .post(this._uploadPictureToMongoUrl, formData).subscribe(
          res => {
            this.insertPostData.picture = res['fileName'];
          },
          err => console.log(err));
    }
  }

  fetchPosts() {
    console.log('ok');
  }

  cancelPost() {
    this.router.navigate(['/social/allpost']);
  }

  savePost() {
    this.postTile = this.postTitle.nativeElement.value;
    this.description = this.description.nativeElement.value;
    this.insertPostData = { postTitle: this.postTile, picture: this.insertPostData.picture, postDescription: this.description };
    this.postService.insertPost(this.insertPostData)
      .subscribe(
        res => {
          alert('Success');
          this.router.navigate(['/social/allpost']);
        },
        err => alert(err));
  }

}
