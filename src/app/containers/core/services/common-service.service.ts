import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  apiURL: any;

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.apiURL = environment.apiUrl;
  }


  showSuccess(msg) {
    this.toastr.success('', msg, {
      positionClass: 'toast-bottom-right',
      closeButton: true
    });
  }


  showError(msg) {
    this.toastr.error('', msg, {
      positionClass: 'toast-bottom-right',
      closeButton: true
    });
  }


  getHttpCall(senddata: any) {
    let headers: HttpHeaders = new HttpHeaders();
    let params = null;
    if (senddata.data) {
      params = new HttpParams();
      for (const key in senddata.data) {
        if (senddata.data.hasOwnProperty(key)) {
          params = params.append(key, senddata.data[key]);
        }
      }
    }

    if (senddata.contenttype) {
      headers = headers.append('content-type', senddata.contenttype);
    } else {
      headers = headers.append('content-type', 'application/json');
    }

    if (localStorage.getItem('admin-access-token')) {
      headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('admin-access-token'));
    }

    return this.http.get<any>(this.apiURL + senddata.url, { headers, params })
      .pipe(
        catchError(this.handleError('error ', []))
      );
  }


  postHttpCall(senddata: any) {
    let headers: HttpHeaders = new HttpHeaders();
    if (senddata.contenttype) {
      if (senddata.contenttype != 'formdata') {
        headers = headers.append('Content-Type', senddata.contenttype);
      }
    } else {
      headers = headers.append('Content-Type', 'Application/Json');
    }

    if (localStorage.getItem('admin-access-token')) {
      headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('admin-access-token'));
    }

    return this.http.post<any>(this.apiURL + senddata.url, senddata.data, { headers })
      .pipe(
        catchError(this.handleError('error ', []))
      );
  }


  putHttpCall(senddata: any) {
    let headers: HttpHeaders = new HttpHeaders();
    if (senddata.contenttype) {
      if (senddata.contenttype != 'formdata') {
        headers = headers.append('Content-Type', senddata.contenttype);
      }
    } else {
      headers = headers.append('Content-Type', 'Application/Json');
    }

    if (localStorage.getItem('admin-access-token')) {
      headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('admin-access-token'));
    }

    return this.http.put<any>(this.apiURL + senddata.url, senddata.data, { headers })
      .pipe(
        catchError(this.handleError('error ', []))
      );
  }


  deleteHttpCall(senddata: any) {
    let headers: HttpHeaders = new HttpHeaders();
    if (senddata.contenttype) {
      headers = headers.append('Content-Type', senddata.contenttype);
    } else {
      headers = headers.append('Content-Type', 'Application/Json');
    }

    if (localStorage.getItem('admin-access-token')) {
      headers = headers.append('Authorization', 'Bearer ' + localStorage.getItem('admin-access-token'));
    }

    return this.http.delete<any>(this.apiURL + senddata.url, { headers, params: senddata.params })
      .pipe(
        catchError(this.handleError('error ', []))
      );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(
        `Api status code: ${error.status}`,
        `Api status message : ${error.message}`
      );
      return throwError(error);
    };
  }

}
