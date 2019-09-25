import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlJSON } from '../../views/json/urlJSON';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private _insertAddPostUrl = UrlJSON.insertAddPostUrl;
  private _updatePostUrl = UrlJSON.updatePostUrl;
  private _deletePostUrl = UrlJSON.deletePostUrl;
  private _favoritePostUrl = UrlJSON.favoritePostUrl;
  private _favoritePostDeleteUrl = UrlJSON.favoritePostDeleteUrl;
  private _sendRecommendUrl = UrlJSON.sendRecommendUrl;
  private _confirmRecommendUrl = UrlJSON.confirmRecommendUrl;
  private _deleteRecommendUrl = UrlJSON.deleteRecommendUrl;
  private _addCommentUrl = UrlJSON.addCommentUrl;
  private _getAllPostsUrl = UrlJSON.getAllPostsUrl;
  private _getAllPostsForDatatableUrl = UrlJSON.getAllPostsForDatatableUrl;
  private _getPostDataByIdUrl = UrlJSON.getPostDataByIdUrl;
  private _getPostsDataByUserIdUrl = UrlJSON.getPostsDataByUserIdUrl;

  constructor( private http: HttpClient ) { }

  insertPost(insertData) {
    return this.http.post<any>(this._insertAddPostUrl, insertData);
  }

  updatePost(updateData) {
    return this.http.post<any>(this._updatePostUrl, updateData);
  }

  deletePost(deleteData) {
    return this.http.post<any>(this._deletePostUrl, deleteData);
  }

  favoritePost(favoriteData) {
    return this.http.post<any>(this._favoritePostUrl, favoriteData);
  }

  favoriteDelete(favoriteData) {
    return this.http.post<any>(this._favoritePostDeleteUrl, favoriteData);
  }

  sendRecommended(send) {
    return this.http.post<any>(this._sendRecommendUrl, send);
  }

  confirmRecommended(confirm) {
    return this.http.post<any>(this._confirmRecommendUrl, confirm);
  }

  deleteRecommended(data) {
    return this.http.post<any>(this._deleteRecommendUrl, data);
  }

  addComment(data) {
    return this.http.post<any>(this._addCommentUrl, data);
  }

  getAllPosts(page, searchData) {
    return this.http.post<any>(`${this._getAllPostsUrl}/${page}`, searchData);
  }

  getAllPostsForDatatable(searchData) {
    return this.http.post<any>(this._getAllPostsForDatatableUrl, searchData);
  }

  getPostDataById(id) {
    return this.http.get<any>(`${this._getPostDataByIdUrl}/${id}`);
  }

  getPostsDataByUserId(id) {
    return this.http.get<any>(`${this._getPostsDataByUserIdUrl}/${id}`);
  }

}
