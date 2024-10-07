import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

const API_URL = 'http://localhost:8080/api/test/';
const API_URL2=`http://localhost:8080/api/`;
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private storageService: StorageService) {}

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }
  getStudentData():Observable<any> {
    const token = this.storageService.getUser().accessToken;  // Replace with actual token or retrieve it from a service/storage
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Add the Bearer token to the headers
    });
  
    return this.http.get(API_URL2 + 'excel/students');
  }
  
  getExcel(): Observable<Blob> {
    return this.http.get(API_URL2 + 'excel/download', { responseType: 'blob' });
  }

  uploadExcel(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file); // Attach the file to form data

    // Make the HTTP POST request to upload the file
    return this.http.post(API_URL2 + `excel/upload`, formData, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      }),
      responseType: 'json'  // Response type expected
    });
  }

  getUserBoard(): Observable<any> {
    const token = this.storageService.getUser().accessToken;  // Replace with actual token or retrieve it from a service/storage
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Add the Bearer token to the headers
    });
  
    return this.http.get(API_URL + 'user', { headers: headers, responseType: 'text' });
  }
  
  getModeratorBoard(): Observable<any> {
    const token = this.storageService.getUser().accessToken;  // Replace with actual token or retrieve it from a service/storage
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Add the Bearer token to the headers
    });
    return this.http.get(API_URL + 'mod', { headers: headers, responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    const token = this.storageService.getUser().accessToken;  // Replace with actual token or retrieve it from a service/storage
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Add the Bearer token to the headers
    });
    return this.http.get(API_URL + 'admin', { headers: headers, responseType: 'text' });
  }
}
