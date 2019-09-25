import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BusinessService } from 'src/app/shared/services/business.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-business',
  templateUrl: './upload-business.component.html',
  styleUrls: ['./upload-business.component.scss']
})
export class UploadBusinessComponent implements OnInit {
  formBasic: FormGroup;
  loading: boolean = false;
  radioGroup: FormGroup;
  radioGroup_active: FormGroup;
  businessCount = 10;
  modalSmall: any;
  @ViewChild('smallModal_view') smallModal_view: ElementRef;
  @ViewChild('errorModal_view') errorModal_view: ElementRef;

  id: String;
  business: any = {};
  currentBusinessData: any = { picture: 'default.png' };

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private businessService: BusinessService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private el: ElementRef
  ) { }

  ngOnInit() {
  }

  onDummyUpload() {
    this.businessService.loadFromLocalBusinessToDb()
      .subscribe(
        res => {
          const el: HTMLElement = this.smallModal_view.nativeElement as HTMLElement;
          el.click();
        },
        err => console.log(err));
  }

  onDummyCreate() {
    this.loading = true;
    this.businessService.createBusinessDummyData(this.businessCount)
      .subscribe(
        res => {
          console.log(res);
          if (res['error_not_found']) {
            const el: HTMLElement = this.errorModal_view.nativeElement as HTMLElement;
            el.click();
            this.loading = false;
          } else {
            const el: HTMLElement = this.smallModal_view.nativeElement as HTMLElement;
            el.click();
            this.loading = false;
          }
        },
        err =>{
          console.log(err);
          this.loading = false;
        });
  }

  openSmall(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'sm' })
      .result.then((result) => {
        console.log(result);
      }, (reason) => {
        console.log('Err!', reason);
      });
  }
}
