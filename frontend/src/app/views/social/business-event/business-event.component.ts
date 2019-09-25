import {Component, OnInit, ViewChild, ElementRef, forwardRef, AfterViewInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BusinessService} from 'src/app/shared/services/business.service';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
declare const google: any;

import {NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {HttpClient} from '@angular/common/http';
import {activityJSON} from '../../json/activityJSON';
import {UrlJSON} from '../../json/urlJSON';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from "../../../service/auth.service";
import { timeJSON } from '../../json/timeJSON';

export const DATEPICKER_VALUE_ACCESSOR =  {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => BusinessEventComponent),
  multi: true
};

class Address {
    id?: number;
    street?: string;
    additionalInfo?: string;
    lat?: number;
    lng?: number;
  }

  const now = new Date();

@Component({
  selector: 'app-business-event',
  templateUrl: './business-event.component.html',
  styleUrls: ['./business-event.component.scss'],
  providers: [DATEPICKER_VALUE_ACCESSOR]
})
export class BusinessEventComponent implements OnInit, ControlValueAccessor {
  
  selectedDate: any;
  disabled = false;

  // Function to call when the date changes.
  onChange = (date?: Date) => {

    if(this.endDate.getDate() < date.getDate() || this.minDate.getDate() < date.getDate()){
      this.toastr.success('Input Error', 'Please input correct starttime!', {progressBar: true});
      this.addEventForm.get('s_dp').setValue({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate()
      });
      this.addEventForm.controls['s_time'].setValue(this.timeArr[0].name);
    } else this.startDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());


  };

  onChangEndtime = (date?: Date) =>{
   
    if(this.startDate.getDate() > date.getDate() || this.minDate.getDate() < date.getDate()){

      this.toastr.success('Input Error', 'Please input correct endtime!', {progressBar: true});
      this.addEventForm.get('e_dp').setValue({
        year: this.startDate.getFullYear(),
        month: this.startDate.getMonth() + 1,
        day: this.startDate.getDate()
      });
      this.addEventForm.controls['e_time'].setValue(this.timeArr[1].name);
    } else this.endDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  // Function to call when the date picker is touched
  onTouched = () => {};

  writeValue(value: Date) {
    if (!value) return;
    this.selectedDate = {
      year: value.getFullYear(),
      month: value.getMonth(),
      day: value.getDate()
    }
    
  }
  registerOnChange(fn: (date: Date) => void): void {
    this.onChange = fn;
  }
  // Allows Angular to register a function to call when the input has been touched.
  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  // Write change back to parent
  onDateChange(value: Date, id: Number) {
    if(id == 1)
      this.onChange(value);
    else
      this.onChangEndtime(value);
  }

  // Write change back to parent
  onDateSelect(value: any,id: Number) {
    if(id == 1)
      this.onChange(new Date(value.year, value.month - 1, value.day));
    else
      this.onChangEndtime(new Date(value.year, value.month - 1, value.day));
  }

  @ViewChild('search') public searchElement: ElementRef;

  type = 0;
  submitted = false;
  submitValidFlg = false;
  loading: boolean;
  modalSmall: any;
  @ViewChild('photo') photo: ElementRef;
  chooseFileName = 'Choose File';
  role = '0';
  fileType: any;
  
  categoryArr = activityJSON;
  timeArr = timeJSON;
  offer = '';
  rangeCost= 0;

  rangeObjArr = [];

  itemOwn = false;
  id = '';

  // Add
  url: any;
  addEventForm: FormGroup;
  modal_btn = 'Create Event';
  maxUploadSize = 30000000; // byte
  _uploadPictureToMongoUrl = UrlJSON.uploadPictureToMongoUrl111;
  insertPostData: any = { picture: 'default.png',video: '', pictureChanged: false };
  public imagePath;
  pictureContentType: String;
  isVideo: any;
  businessId: any;
  myBusinessId: any;
  events: any[] = [];
  minDate: Date = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  startDate: Date = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  endDate: Date = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

  constructor(
      private formBuilder: FormBuilder,
      private businessService: BusinessService,
      private modalService: NgbModal,
      private http: HttpClient,
      private route: ActivatedRoute,
      private _auth: AuthService,
      private toastr: ToastrService
  ) {
    // this.minDate =  {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    this.minDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    
  }

  ngOnInit() {
    
      localStorage.setItem('userPage', '1');
      this.role = this._auth.getRole();

      this.url = '../../../../assets/images/post/upload_bg.jpg';

      this.addEventForm = this.formBuilder.group({
            category: ['', Validators.required],
            name: ['', [Validators.required, Validators.maxLength(64)]],
            location: ['', Validators.required],
            description: ['', Validators.required],
            s_dp: ['', Validators.required],
            s_time: ['', Validators.required],
            e_dp: ['', Validators.required],
            e_time: ['', Validators.required],
        }, {});

        this.addEventForm.controls['s_time'].setValue('12:00 AM');
        this.addEventForm.controls['e_time'].setValue('12:30 AM');
        

      this.route.params.subscribe(params => {
        this.businessId = params.id;
        this.fetchEventsById(this.businessId);
      });

      if(localStorage.getItem('userId') && localStorage.getItem('userId') != '-1') {
        this.businessService.getBusinessByID(localStorage.getItem('userId')).subscribe(res => {
            if(res){
                this.myBusinessId = res['_id'];
            }
        });
      }

    // this.searchControl = new FormControl();
    // this.initializeRouteAndComponents();
    // this.setGoogleMaps();
  }
 
  public fetchEventsById(id) {
    
    this.startDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    this.endDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    this.businessService.getEventsByBusinessId(id).subscribe(res => {
        if(res){
            const event = res.slice().reverse();
            this.events = event;
            for(let i = 0; i < event.length; i++){
                this.events[i].originPicture = this.events[i].picture;
                this.events[i].picture = UrlJSON.displayPictureUrl + this.events[i].picture;
                if(this.events[i].type == 1) this.events[i].property = 'Private';
                else this.events[i].property = 'Public';

                let date = this.events[i].createDate.split('T')[0];
                this.events[i].registerMonth = this.number2string(date.split('-')[1]);
                this.events[i].registerDate = date.split('-')[2];
            }
        }
    });
    this.events = [...this.events];
        
  }
  
  public number2string(month) {
      switch(month) {
          case "01":
            return "JAN";
          case "02":
            return "FEB";
          case "03":
            return "MAR";
          case "04":
            return "APR";
          case "05":
            return "MAY";
          case "06":
            return "JUN";
          case "07":
            return "JUL";
          case "08":
            return "AUG";
          case "09":
            return "SEP";
          case "10":
            return "OCT";
          case "11":
            return "NOV";
          case "12":
            return "DEC";
          default:
            return "JAN";
        }
  }
  
  addEvent(value, content) {
    this.modal_btn = 'Create Event';
      this.type = value;
      this.modalService.open(content, { ariaLabelledBy: 'modal-title' }).result.then(() => {
        this.submitted = true;
        if (this.addEventForm.invalid) {
            return;
        }
        if (this.fileType) {
            return;
        }
        if (this.chooseFileName !== '') {
            this.addEventForm.value.picture = this.chooseFileName;
        }
        this.addEventForm.value.startDate = this.addEventForm.value.s_dp.year + '-' + 
                this.addEventForm.value.s_dp.month + '-' + this.addEventForm.value.s_dp.day + ' ' + this.addEventForm.value.s_time;
        this.addEventForm.value.endDate = this.addEventForm.value.e_dp.year + '-' + 
            this.addEventForm.value.e_dp.month + '-' + this.addEventForm.value.e_dp.day + ' ' + this.addEventForm.value.e_time;
        this.addEventForm.value.type = this.type;
        this.addEventForm.value.businessId = this.businessId;
        this.addEventForm.value.userName = localStorage.getItem('userName');
        this.businessService.addEvent(this.addEventForm.value)
            .subscribe(
                () => {
                    this.loading = false;
                },
                () => {
                    this.loading = false;
            });
            this.fetchEventsById(this.businessId);
      }, () => {
        this.startDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        this.endDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      });
  }

  validate() {
    if (this.addEventForm.invalid) {
        this.submitValidFlg = false;
        return;
    }
    this.submitValidFlg = true;
  }

  edit(row, content) {
    this.modal_btn = 'Save';
    this.addEventForm.controls['category'].setValue(row.category);
    this.addEventForm.controls['name'].setValue(row.name);
    this.addEventForm.controls['location'].setValue(row.location);
    this.addEventForm.controls['description'].setValue(row.description);
    this.addEventForm.value.picture = row.originPicture;
    this.chooseFileName = row.originPicture;
    this.url = row.picture;

    let startDate = row.startDate.split(' ');
    this.addEventForm.get('s_dp').setValue({
      year: Number(startDate[0].split('-')[0]),
      month: Number(startDate[0].split('-')[1]),
      day: Number(startDate[0].split('-')[2])
    });
    this.addEventForm.controls['s_time'].setValue(startDate[1] + ' ' + startDate[2]);
    let endDate = row.endDate.split(' ');
    this.addEventForm.get('e_dp').setValue({
      year: Number(endDate[0].split('-')[0]),
      month: Number(endDate[0].split('-')[1]),
      day: Number(endDate[0].split('-')[2])
    });
    this.addEventForm.controls['e_time'].setValue(endDate[1] + ' ' + endDate[2]);

    this.minDate = new Date(Number(startDate[0].split('-')[0]), Number(startDate[0].split('-')[1]), Number(startDate[0].split('-')[2]));
    // this.startDate = new Date(Number(startDate[0].split('-')[0]), Number(startDate[0].split('-')[1]), Number(startDate[0].split('-')[2]));
    this.endDate = new Date(Number(endDate[0].split('-')[0]), Number(endDate[0].split('-')[1]), Number(endDate[0].split('-')[2]));

    this.type = row.type;
      this.submitValidFlg = true;
      this.modalService.open(content, { ariaLabelledBy: 'modal-title' }).result.then(() => {
        this.submitted = true;
        if (this.addEventForm.invalid) {
            return;
        }
        
        if (this.chooseFileName !== '') {
            this.addEventForm.value.picture = this.chooseFileName;
        }
        this.addEventForm.value._id = row._id;
        this.addEventForm.value.startDate = this.addEventForm.value.s_dp.year + '-' + 
                this.addEventForm.value.s_dp.month + '-' + this.addEventForm.value.s_dp.day + ' ' + this.addEventForm.value.s_time;
        this.addEventForm.value.endDate = this.addEventForm.value.e_dp.year + '-' + 
            this.addEventForm.value.e_dp.month + '-' + this.addEventForm.value.e_dp.day + ' ' + this.addEventForm.value.e_time;
        this.addEventForm.value.type = this.type;
        this.addEventForm.value.businessId = this.businessId;
        this.addEventForm.value.userName = localStorage.getItem('userName');
        this.businessService.editEvent(this.addEventForm.value)
            .subscribe(
                () => {
                    this.loading = false;
                },
                () => {
                    this.loading = false;
            });
        this.fetchEventsById(this.businessId);
        this.initFromGroup();
      }, () => {
        this.initFromGroup();
        this.startDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        this.endDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      });
  }
  
  delete(row) {
    this.businessService.deleteEvent(row)
    .subscribe(res => {
      if(res){
        this.fetchEventsById(this.businessId);   
      }
    });
  }

  initFromGroup() {
    this.addEventForm.controls['category'].setValue('');
    this.addEventForm.controls['name'].setValue('');
    this.addEventForm.controls['location'].setValue('');
    this.addEventForm.controls['description'].setValue('');
    this.addEventForm.value.picture = null;
    this.chooseFileName = null;
    this.url = '../../../../assets/images/post/upload_bg.jpg';

    this.addEventForm.get('s_dp').setValue('');
    this.addEventForm.controls['s_time'].setValue('');
    this.addEventForm.get('e_dp').setValue('');
    this.addEventForm.controls['e_time'].setValue('');
    this.addEventForm.controls['s_time'].setValue('12:00 AM');
    this.addEventForm.controls['e_time'].setValue('12:30 AM');
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

    changeProperty(value) {
        this.type = value;
    }


    // Google Map

    // setGoogleMaps(): void {
    //     this.maps.mapReady.subscribe(
    //         mapReady => this.directionsDisplay.setMap(mapReady),
    //         e => console.log('Error setting map in DirectionRenderer', e)
    //     );

    //     this.labelIndex = 0;

    //     this.mapsApiLoader
    //         .load()
    //         .then(() => {
    //             // services have to be initialized inside MapsApiLoader to work
    //             this.initializeGoogleMapsServices();

    //             this.setPlacesAutocomplete();

    //             // workaround to restrict Autocomplete to get addresses within the chosen city boundaries
    //             this.maps.boundsChange.subscribe(bounds => this.autoComplete.setBounds(bounds));

    //             this.setupPlaceChangedListener();
    //         })
    //         .catch(e => console.log('Error loading MapsApi', e));
    // }

    // setupPlaceChangedListener(): void {
    //     this.idListener = this.autoComplete.addListener('place_changed', () => {
    //         console.log('Setting listener');
    //         this.ngZone.run(() => {
    //             const place = this.autoComplete.getPlace();

    //             if (!place.place_id || place.geometry === undefined || place.geometry === null) {
    //                 console.log('Place not found');
    //                 return;
    //             }

    //             const latitude = place.geometry.location.lat();
    //             const longitude = place.geometry.location.lng();

    //             const address = {
    //                 street: place.formatted_address,
    //                 additionalInfo: '',
    //                 lat: latitude,
    //                 lng: longitude
    //             } as Address;

    //             this.addresses.push(address);

    //             this.markers.push({
    //                 lat: latitude,
    //                 lng: longitude,
    //                 label: this.alphabeticLabels[this.labelIndex++ % this.alphabeticLabels.length]
    //             });

    //             console.log('Markers list: ', JSON.stringify(this.markers));
    //             this.searchControl.reset();
    //             this.drawRoute();
    //         });
    //     });
    // }

    // drawRoute(): void {
    //     const length = this.markers.length;
    //     if (!(length >= 2)) {
    //         return;
    //     }

    //     this.setDirectionsRequest();

    //     if (length > 2) {
    //         if (length >= 12) {
    //             console.log('Google taxes for more than 10 waypoints. Be careful');
    //             return;
    //         }
    //         const waypoints: google.maps.DirectionsWaypoint[] = [];
    //         this.markers.slice(1, this.markers.length - 1)
    //             .forEach(coordinates => {
    //                 const way: google.maps.DirectionsWaypoint = {location: coordinates, stopover: null};
    //                 waypoints.push(way);
    //             });
    //         this.directionsRequest.waypoints = waypoints;
    //         console.log('Waypoints: ', JSON.stringify(waypoints));
    //     }

    //     this.callDirectionServiceRoute();

    // }

    // setDirectionsRequest(): void {
    //     this.directionsRequest.origin = _.first(this.markers);
    //     this.directionsRequest.destination = _.last(this.markers);
    //     this.directionsRequest.travelMode = google.maps.TravelMode.DRIVING;
    //     this.directionsRequest.optimizeWaypoints = true;
    // }

    // callDirectionServiceRoute(): void {
    //     this.directionsService.route(
    //         this.directionsRequest,
    //         (
    //             response: google.maps.DirectionsResult,
    //             status: google.maps.DirectionsStatus
    //         ) => {
    //             if (status === google.maps.DirectionsStatus.OK) {
    //                 this.directionsDisplay.setDirections(response);
    //                 this.calcDistance(response);
    //                 this.calcTotalAmount();
    //             } else {
    //                 console.log('Failed to display directions');
    //             }
    //         }
    //     );
    // }

    // calcDistance(response: google.maps.DirectionsResult) {
    //     const route: google.maps.DirectionsRoute = response.routes[0];
    //     let distance = 0;
    //     for (let i = 0; i < route.legs.length; i++) {
    //         distance += route.legs[i].distance.value;
    //     }
    //     this.distance = parseFloat((distance / 1000).toFixed(2));
    //     console.log('Distance total: ', this.distance);
    // }

    // calcTotalAmount(): void {
    //     this.calcDistancePrice();
    // }

    // calcDistancePrice(): void {
    //     this.distancePrice = this.distance * 4;
    //     if (this.distancePrice < 12) {
    //         this.distancePrice = 12;
    //     }
    // }

    // trackByIndex(index: number, obj: any): any {
    //     return index;
    // }

    // ngOnDestroy() {
    //     google.maps.event.removeListener(this.idListener);
    // }

    // initializeGoogleMapsServices(): void {
    //     this.directionsService = new google.maps.DirectionsService();
    //     this.directionsRequest = {} as google.maps.DirectionsRequest;
    //     this.directionsDisplay = new google.maps.DirectionsRenderer();
    // }

    // setPlacesAutocomplete(): void {
    //     this.autoComplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement);
    //     this.autoComplete.setTypes(['address']);
    //     this.autoComplete.setComponentRestrictions({country: 'br'});
    // }

    // initializeRouteAndComponents(): void {
    //     this.addresses = [];
    //     this.markers = [];
    // }
}
