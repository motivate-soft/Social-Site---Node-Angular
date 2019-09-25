import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlJSON } from '../../views/json/urlJSON';
import { analyzeAndValidateNgModules } from '@angular/compiler';
@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  private _makingBusinessUrl = UrlJSON.makingBusinessUrl;
  private _addBusinessUrl = UrlJSON.addBusinessUrl;
  private _addEventUrl = UrlJSON.addEventUrl;
  private _editEventUrl = UrlJSON.editEventUrl;
  private _deleteEventUrl = UrlJSON.deleteEventUrl;
  private _addBusinessEmployeeUrl = UrlJSON.addBusinessEmployeeUrl;
  private _addBusinessEventUrl = UrlJSON.addBusinessEventUrl;
  private _addBusinessTransactionUrl = UrlJSON.addBusinessTransactionUrl;
  private _addBusinessProductUrl = UrlJSON.addBusinessProductUrl;
  private _deleteBusinessEventUrl = UrlJSON.deleteBusinessEventUrl;
  private _deleteBusinessTransactionUrl = UrlJSON.deleteBusinessTransactionUrl;
  private _deleteBusinessProductUrl = UrlJSON.deleteBusinessProductUrl;
  private _getBusinessUrl = UrlJSON.getBusinessUrl;
  private _getBusinessByIdUrl = UrlJSON.getBusinessByIdUrl;
  private _getBusinessByBusinessIdUrl = UrlJSON.getBusinessByBusinessIdUrl;
  private _getBusinessIdByPostIDUrl = UrlJSON.getBusinessIdByPostIDUrl;
  private _getEventsByBusinessIdUrl = UrlJSON.getEventsByBusinessIdUrl;
  private _setOfflineStatusByIDUrl = UrlJSON.setOfflineStatusByIDUrl;
  private _setOnlineStatusByIDUrl = UrlJSON.setOnlineStatusByIDUrl;
  private _getCompanyInfoUrl = UrlJSON.getCompanyInfoUrl;
  private _getLogoPictureUrl = UrlJSON.getLogoPictureUrl;
  private _getBusinessesForSearchUrl = UrlJSON.getBusinessesForSearchUrl;
  private _getAllBusinesUrl = UrlJSON.getAllBusinessUrl;
  private _loadFromLocalToDbUrl = UrlJSON.loadFromLocalToDbUrl;
  private _loadFromLocalBusinessToDbUrl = UrlJSON.loadFromLocalBusinessToDbUrl;
  private _createBusinessDummyDataUrl = UrlJSON.createBusinessDummyDataUrl;
  private _getBusinessPerIndexUrl = UrlJSON.getBusinessPerIndexUrl;
  constructor( private http: HttpClient ) { }

  makingBusiness(business, customerId) {
    return this.http.post<any>(this._makingBusinessUrl, { business: business, customerId: customerId } );
  }
  addBusiness(business) {
    return this.http.post<any>(this._addBusinessUrl, business) ;
  }
  addEvent(event) {
    return this.http.post<any>(this._addEventUrl, event) ;
  }
  editEvent(event) {
    return this.http.post<any>(this._editEventUrl, event) ;
  }
  deleteEvent(id) {
    return this.http.post<any>(this._deleteEventUrl, id) ;
  }
  addBusinessEmployee(employee) {
    return this.http.post<any>(this._addBusinessEmployeeUrl, employee);
  }
  addBusinessEvent(event) {
    return this.http.post<any>(this._addBusinessEventUrl, event);
  }
  addBusinessTransaction(transaction) {
    return this.http.post<any>(this._addBusinessTransactionUrl, transaction);
  }
  addBusinessProduct(product) {
    return this.http.post<any>(this._addBusinessProductUrl, product);
  } 
  deleteBusinessEvent(event){
    return this.http.post<any>(this._deleteBusinessEventUrl, event);
  }
  deleteBusinessTransaction(event){
    return this.http.post<any>(this._deleteBusinessTransactionUrl, event);
  }
  deleteBusinessProduct(event){
    return this.http.post<any>(this._deleteBusinessProductUrl, event);
  }
  getAllBusiness() {
    return this.http.get<any>(this._getAllBusinesUrl);
  }
  getBusinesses(page, searchData) {
    return this.http.post<any>(`${this._getBusinessUrl}/${page}`, searchData);
  }
  getBusinessByID(id) {
    return this.http.get<any>(`${this._getBusinessByIdUrl}/${id}`);
  }
  getBusinessByBusinessID(id) {
    return this.http.get<any>(`${this._getBusinessByBusinessIdUrl}/${id}`);
  }
  getBusinessIdByPostID(id) {
    return this.http.get<any>(`${this._getBusinessIdByPostIDUrl}/${id}`);
  }
  getEventsByBusinessId(id) {
    return this.http.get<any>(`${this._getEventsByBusinessIdUrl}/${id}`);
  }
  setOfflineStatusByID(id) {
    return this.http.get<any>(`${this._setOfflineStatusByIDUrl}/${id}`);
  }
  setOnlineStatusByID(id) {
    return this.http.get<any>(`${this._setOnlineStatusByIDUrl}/${id}`);
  }
  getBusinessesForSearch(page, searchData) {
    return this.http.post<any>(`${this._getBusinessesForSearchUrl}/${page}`, searchData);
  }
  getCompanyInfosByID(id) {
    return this.http.get<any>(`${this._getCompanyInfoUrl}/${id}`);
  }
  getLogoPicture(companyId) {
    return this.http.post<any>(`${this._getLogoPictureUrl}`, { companyId: companyId });
  }
  loadFromLocalToDb() {
    return this.http.get<any>(this._loadFromLocalToDbUrl);
  }
  loadFromLocalBusinessToDb() {
    return this.http.get<any>(this._loadFromLocalBusinessToDbUrl);
  }
  createBusinessDummyData(businessCount) {
    return this.http.get<any>(`${this._createBusinessDummyDataUrl}/${businessCount}`);
  }
  getBusinessPerIndex(page, searchData) {
    return this.http.post<any>(`${this._getBusinessPerIndexUrl}/${page}`, searchData);
  }
}
