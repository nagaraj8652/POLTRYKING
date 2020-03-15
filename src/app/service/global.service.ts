import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GlobalService {
  
  private REST_API_SERVER = "http://lawprotectorsipr.in/poltry/Poltry_API/";

  constructor(private httpClient: HttpClient) { }

  public getRequest(url):Observable<any> {
    return this.httpClient.get(this.REST_API_SERVER+url);
  }

  public postData(url,Data): Observable<any>{

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');

    return this.httpClient.post(`${this.REST_API_SERVER}` + url, Data);
  }

  public postupload(url,Data): Observable<any>{

    return this.httpClient.post(`${this.REST_API_SERVER}` + url, Data);
  }

  POSTFileUpload(URL,Data): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
         observe: 'response'
      })
    };

 
    //console.log(httpOptions);
    return this.httpClient.post(`${this.REST_API_SERVER}` + URL, Data.data, httpOptions);
  }

}
