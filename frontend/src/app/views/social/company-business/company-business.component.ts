import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BusinessService } from 'src/app/shared/services/business.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UrlJSON } from '../../json/urlJSON';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-company-business',
  templateUrl: './company-business.component.html',
  styleUrls: ['./company-business.component.scss']
})
export class CompanyBusinessComponent implements OnInit, AfterViewInit {

  addEmployeeForm: FormGroup;
  addEventForm: FormGroup;
  addTransactionForm: FormGroup;
  addProductForm: FormGroup;
  submitted = false;
  submitValidFlg = false;

  phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];

  constructor(private formBuilder: FormBuilder, private businessService: BusinessService, private userService: UserService,
    private http: HttpClient, private route: ActivatedRoute, private modalService: NgbModal,private router: Router, ) { }

  id: String;
  userId: String;
  customerId: string;
  currentCompanyData: any = [];
  readMoreText: any;
  countNumber: number;
  fullText = true;
  showMore = false;
  showLess = false;
  rmTextShort = '';
  rmTextFull = '';
  inputWords = [];
  description = '';

  fileType:any;
  chooseFileName = 'Choose file';
  maxUploadSize = 30000000;
  _uploadPictureToMongoUrl = UrlJSON.uploadPictureToMongoUrl111;
  insertPostData: any = { picture: 'default.png',video: '', pictureChanged: false };
  public imagePath;
  pictureContentType: String;
  isVideo: any;
  url: any;

  columns_employees = [
    { name: 'Name' },
    { name: 'Role' },
    { name: 'Phone' }
  ];

  columns_information = [
    { name: 'Item'},
    { name: 'Infomation'}
  ]
  rows_employees = [
    { name: 'Name' },
    { name: 'Role' },
    { name: 'PhoneNumber' }
  ];

  company_employees = [];
  company_information = [];
  company_product = [];
  nProductCount = 0;
  business_offers = [];
  business_events = [];

  ngOnInit() {
    this.url = '../../../../assets/images/post/upload_bg.jpg';

    this.customerId = localStorage.getItem('userId');
    this.addEmployeeForm = this.formBuilder.group({
        name: ['', Validators.required],
        role: ['', Validators.required],
        phone: ['', [Validators.required]],
    }, {
    });

    this.addEventForm = this.formBuilder.group({
        name: ['', Validators.required],
        link: ['', Validators.required],
    }, {
    });

    this.addTransactionForm = this.formBuilder.group({
      name: ['', Validators.required],
      number: ['', Validators.required],
      link: ['', [Validators.required]],
    }, {
    });

    this.addProductForm = this.formBuilder.group({
      name: ['', Validators.required]
    }, {
    });

    this.route.params.subscribe(params => {
      this.id = params.id;
      this.getCompanyInfo();
    });
  }

  ngAfterViewInit() {
  }

  getCompanyInfo() {
    this.businessService.getCompanyInfosByID(this.id).subscribe(res => {
      this.currentCompanyData = res;
      this.userId = this.currentCompanyData.user_id;
      this.readMoreText = this.currentCompanyData.Description;
      this.countNumber = this.readMoreText.split(/\W+/).length;
      this.rmTextFull = this.readMoreText;
      this.inputWords = this.readMoreText.split(' ');
      if (this.inputWords.length > 100) {
        this.fullText = false;
        this.showMore = true;
        this.rmTextShort = this.inputWords.slice(0, 100).join(' ') + '...';
        this.description = this.rmTextShort;
      } else {
        if (this.inputWords.length < 100) {
          this.fullText = true;
          this.showMore = false;
          this.rmTextShort = this.inputWords.slice(0, 100).join(' ') + '...';
          this.description = this.readMoreText;
        }
      }

      let tmp_infos = [];

      tmp_infos.push({'item': 'Number', 'infomation': this.currentCompanyData.companyEmployees.length});
      tmp_infos.push({'item': 'Category', 'infomation': this.currentCompanyData.category});
      tmp_infos.push({'item': 'Country', 'infomation': this.currentCompanyData.country});
      tmp_infos.push({'item': 'City', 'infomation': this.currentCompanyData.city});
      tmp_infos.push({'item': 'Address', 'infomation': this.currentCompanyData.address});
      tmp_infos.push({'item': 'Tel', 'infomation': this.currentCompanyData.phone});
      tmp_infos.push({'item': 'Email', 'infomation': '<a href="mailto:'+this.currentCompanyData.email+'">'+this.currentCompanyData.email+'</a>'});
      tmp_infos.push({'item': 'FaceBook', 'infomation': this.currentCompanyData.facebook});
      tmp_infos.push({'item': 'Linkdin', 'infomation': this.currentCompanyData.linkdin});
      tmp_infos.push({'item': 'Registered Date', 'infomation': this.currentCompanyData.registerDate});

      this.company_information = [...tmp_infos];

      
      this.userService.getUserByID(this.userId).subscribe(res => {
        if(res !== null){
          let employees = {name: res.firstName + ' ' + res.lastName, role: 'Employer', phone: res.phoneNumber};
          this.currentCompanyData.companyEmployees.push(employees);
          this.columns_employees = [...this.columns_employees];
        }
        this.company_employees = this.currentCompanyData.companyEmployees.slice().reverse();
      });
      
      this.businessService.getEventsByBusinessId(this.id).subscribe(res => {
        if(res){
          this.business_events = res.slice().reverse();
        }
      });
      this.business_offers = this.currentCompanyData.companyTransactions;

      this.company_product = this.currentCompanyData.companyProducts.slice().reverse();
      for(let i = 0; i < this.company_product.length; i++) {
        this.company_product[i].originPicture = this.company_product[i].picture;
        this.company_product[i].picture = UrlJSON.displayPictureUrl + this.company_product[i].picture;
      }
      this.nProductCount = this.company_product.length;

      if (this.currentCompanyData.picture === 'default.png') {
      this.currentCompanyData.picture = '../../../../assets/images/avatar/default.png';
      } else {
        if (this.currentCompanyData.extraBlob  === '2') {
          this.currentCompanyData.picture = UrlJSON.displayAvatarFromFSUrl + this.currentCompanyData.picture;
        } else {
          this.currentCompanyData.picture = UrlJSON.displayPictureUrl + this.currentCompanyData.picture;
        }
      }
    });
  }
  readMore(flag) {
    if (flag) {
      this.showMore = false;
      this.fullText = true;
      this.showLess = true;
      this.description = this.readMoreText;
    } else {
      this.showLess = false;
      this.showMore = true;
      this.fullText = false;
      this.description = this.rmTextShort;
    }
  }

  validate() {
    if (this.addEmployeeForm.invalid) {
        this.submitValidFlg = false;
        return;
    }
    
    this.submitValidFlg = true;
  }

  openModal(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        this.submitted = true;
        if (this.addEmployeeForm.invalid) {
            return;
        }

        this.addEmployeeForm.value.id = this.id;

        this.businessService.addBusinessEmployee(this.addEmployeeForm.value)
            .subscribe(
                res => {
                    this.getCompanyInfo();
                },
                err => {
                    console.log(err);
                });
      }, (reason) => {
        
      });
      this.submitValidFlg = false;
      this.submitted = false;
  }

  openEventModal(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        this.submitted = true;
        if (this.addEventForm.invalid) {
            return;
        }

        this.addEventForm.value.id = this.id;

        let new_event = {userId: this.customerId, email: this.addEventForm.value.link, event: this.addEventForm.value.name};
        this.businessService.addBusinessEvent(new_event)
            .subscribe(
                res => {
                    this.getCompanyInfo();
                },
                err => {
                    console.log(err);
                });
          }, (reason) => {});

      this.submitValidFlg = false;
      this.submitted = false;
  }
  
  openTransactionModal(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        
        if (this.addTransactionForm.invalid) {
            return;
        }

        this.addTransactionForm.value.id = this.id;

        this.businessService.addBusinessTransaction(this.addTransactionForm.value)
            .subscribe(
                res => {
                    this.getCompanyInfo();
                },
                err => {
                    console.log(err);
                });
          }, (reason) => {});

      this.submitValidFlg = false;
      this.submitted = false;
  }

  openProductModal(content) {
    if(this.nProductCount > 5) {
      alert('You can upload max 6 of your products.');
      return;
    }
    
    this.modalService.open(content, { ariaLabelledBy: 'modal-title' }).result.then(() => {
      this.submitted = true;
      if (this.addProductForm.invalid) {
          return;
      }
      if (this.fileType) {
          return;
      }
      if (this.chooseFileName !== '') {
          this.addProductForm.value.picture = this.chooseFileName;
      }

      this.addProductForm.value.id = this.id;

      this.businessService.addBusinessProduct(this.addProductForm.value)
            .subscribe(
                res => {
                    this.getCompanyInfo();
                    this.chooseFileName = '';this.fileType = true;
                    this.url = '../../../../assets/images/post/upload_bg.jpg';
                },
                err => {
                    console.log(err);
                });
    }, () => {});
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

    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    this.http.post(this._uploadPictureToMongoUrl, formData).subscribe(
        res => {
            this.insertPostData.picture = res['fileName'];
            this.chooseFileName = res['fileName'];
        },
        err => console.log(err));

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      this.imagePath = event.target.files;
      this.pictureContentType = this.imagePath[0].type;
      this.isVideo = this.pictureContentType.split('/')[0];
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = () => { // called once readAsDataURL is completed
        this.url = reader.result; //add source to image
      }
    }
  }

  deleteBusinessEvent(modal, content) {

    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
    .result.then((result) => {
     
      this.businessService.deleteEvent(content)
      .subscribe(res => {
        if(res){
          this.getCompanyInfo();   
        }
      });
    }, (reason) => {});
      
    this.submitValidFlg = false;
    this.submitted = false;
  } 

  deleteBusinessTransaction(modal, content) {
    let delete_transaction = {userId: this.customerId, event: content};
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
    .result.then((result) => {
     
      this.businessService.deleteBusinessTransaction(delete_transaction)
            .subscribe(
                res => {
                    this.getCompanyInfo();
                },
                err => {
                    console.log(err);
                });
    }, (reason) => {});
      
    this.submitValidFlg = false;
    this.submitted = false;
  }

  deleteBusinessProduct(modal, content) {
    let delete_product = {userId: this.customerId, name: content};
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' })
    .result.then((result) => {
     
      this.businessService.deleteBusinessProduct(delete_product)
            .subscribe(
                res => {
                    this.getCompanyInfo();
                },
                err => {
                    console.log(err);
                });
    }, (reason) => {});
      
    this.submitValidFlg = false;
    this.submitted = false;
  }

  goToEvent(id) {
    this.router.navigate([`/social/event/${id}`]);
  }
}
