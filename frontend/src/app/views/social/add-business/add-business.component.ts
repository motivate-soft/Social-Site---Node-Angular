import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {BusinessService} from 'src/app/shared/services/business.service';
import {ToastrService} from 'ngx-toastr';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';
import {countryJSON} from '../../json/countryJSON';
import {activityJSON} from '../../json/activityJSON';
import {currencyJSON} from '../../json/currencyJSON';
import {typeJSON} from '../../json/typeJSON';
import {UrlJSON} from '../../json/urlJSON';
import {offerTypeJSON} from '../../json/offerTypeJSON';
import {Router, ActivatedRoute} from '@angular/router';
import {BiggerMatch} from '../../item/_helpers/bigger-match.validator';

import {AuthService} from "../../../service/auth.service";

@Component({
    selector: 'app-add-business',
    templateUrl: './add-business.component.html',
    styleUrls: ['./add-business.component.scss']
})

export class AddBusinessComponent implements OnInit, OnDestroy {
    addBusinessForm: FormGroup;
    submitted = false;
    loading: boolean = false;

    phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/ , '-' , /\d/, /\d/];

    modalSmall: any;
    @ViewChild('smallModal_view') smallModal_view: ElementRef;
    @ViewChild('closeModal_view') closeModal_view: ElementRef;
    chooseFileName = 'Choose File';
    choosePictureName = 'Choose File';
    chooseLogoFileName = 'Choose File';
    role = '0';
    fileType = false;
    choosePicture = '';
    chooseLogo = '';

    _uploadPictureUrl = UrlJSON.uploadPictureUrl;
    _uploadPictureToMongoUrl = UrlJSON.uploadPictureToMongoUrl;

    dateMask = [/[0,1]/, /\d/, '/', /[0-3]/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

    countryArr = countryJSON;
// typeArr = typeJSON;
    typeArr = [{id: 1, name: 'Group'}, {id: 0, name: 'Private'}];
    currencyArr = currencyJSON;
    categoryArr = activityJSON;
    offerTypeArr = offerTypeJSON;

    submitValidFlg = false;

    modal_title = 'Save';
    modal_content = 'Saved Successfully.';

    offer = '';
    isUpdate = false;
    businessId = '';

    public linkColor: string;

    uploader: FileUploader = new FileUploader({url: this._uploadPictureUrl});

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private businessService: BusinessService,
        private modalService: NgbModal,
        private http: HttpClient,
        private el: ElementRef,
        private router: Router,
        private route: ActivatedRoute,
        private _auth: AuthService
    ) {
    }

    ngOnInit() {

        this.addBusinessForm = this.formBuilder.group({
            category: ['', Validators.required],
            businessName: ['', [Validators.required, Validators.maxLength(20)]],
            country: ['', Validators.required],
            city: ['', Validators.required],
            email: ['', [Validators.required,Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
            phone: ['', [Validators.required]],
            address: ['', Validators.required],
            facebook: ['', Validators.required],
            linkdin: ['', Validators.required],
            offerType: ['gold'],
            Description: ['', Validators.required]

        }, {
        });
        this.loading = true;
        localStorage.setItem('userPage', '1');
        this.role = this._auth.getRole();
        if(localStorage.getItem('userId') && localStorage.getItem('userId') != '-1'){
            this.businessService.getBusinessByID(localStorage.getItem('userId')).subscribe(res => {
                if(res){
                    for(let key in res){
                        if(this.addBusinessForm.controls[key]){
                            this.addBusinessForm.controls[key].setValue(res[key]);
                        }
                    }
                    this.chooseLogoFileName = res['logo'];
                    this.choosePictureName = res['picture'];
                    this.addBusinessForm.controls['businessName'].setValue(res.businessName);
                    this.isUpdate = true;
                    this.businessId = res._id;
                }

                this.loading = false;

            });
        }


    }

    ngOnDestroy() {
    }

    _keyPress(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        const inputChar = String.fromCharCode(event.keyCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            return false;
        }
    }

    get f() {
        return this.addBusinessForm.controls;
    }

    addItem() {
        this.submitted = true;
        if (this.addBusinessForm.invalid) {
            return;
        }
        if (this.fileType) {
            return;
        }
        if (this.choosePicture !== '') {
            this.addBusinessForm.value.picture = this.choosePicture;
        }

        if (this.chooseLogo !== '') {
            this.addBusinessForm.value.logo = this.chooseLogo;
        }
        // this.addBusinessForm.value.startDate = moment(this.addBusinessForm.value.dateRange.startDate).format('YYYY.MM.DD');
        // this.addBusinessForm.value.endDate = moment(this.addBusinessForm.value.dateRange.endDate).format('YYYY.MM.DD');
        this.loading = true;
        this.addBusinessForm.value.user_id = localStorage.getItem('userId');
        this.addBusinessForm.value.color = this.linkColor;
        this.addBusinessForm.value.offerType = this.role === '1' ? this.addBusinessForm.value.offerType : 'simple';
        this.addBusinessForm.value.isUpdate = this.isUpdate;
        this.addBusinessForm.value.businessId = this.businessId;
        
        this.businessService.addBusiness(this.addBusinessForm.value)
            .subscribe(
                res => {
                    this.modal_title = 'Save';
                    this.modal_content = 'Saved Successfully.';
                    const el: HTMLElement = this.smallModal_view.nativeElement as HTMLElement;
                    el.click();
                    this.loading = false;
                },
                err => {
                    console.log(err);
                    this.loading = false;
                });
    }

    validate() {

        if (this.addBusinessForm.invalid) {
            this.submitValidFlg = false;
            return;
        }
        this.submitValidFlg = true;
    }

    cancel() {
        this.router.navigate([`/item/list`]);
    }

    openSmall(content) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'sm'})
            .result.then((result) => {
        }, (reason) => {
            console.log('Err!', reason);
        });
    }

    closeModal() {
        const element: HTMLElement = document.getElementById('closebutton') as HTMLElement;
        element.click();
        this.router.navigate([`/social/list`]);
    }

    onFileSelected(event, type) {
        this.fileType = event.target.files[0].type === '' || event.target.files[0].type.indexOf('image') === -1;
        if (this.fileType) {
            return;
        }
        this.chooseFileName = event.target.files[0].name;
        let inputEl: HTMLInputElement;

        if(type === 'logo') {
            inputEl = this.el.nativeElement.querySelector('#logo');
        } else {
            inputEl = this.el.nativeElement.querySelector('#picture');
        }
        const fileCount: number = inputEl.files.length;
        const formData = new FormData();
        if (fileCount > 0) { // a file was selected
            for (let i = 0; i < fileCount; i++) {
                formData.append('file', inputEl.files.item(i));
            }
            this.http
            .post(this._uploadPictureToMongoUrl, formData).subscribe(
                res => {

                    if(type === 'logo'){
                        this.chooseLogoFileName = res['fileName'];
                        this.chooseLogo = res['fileName'];
                    } else {
                        this.choosePictureName = res['fileName'];
                        this.choosePicture = res['fileName'];
                    }
                },
                err => console.log(err)
                );
        }
    }
}


