import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = 'http://localhost:8080/api/reports';

  constructor(private http: HttpClient) { }

  generateDistrictReport(district: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.baseUrl}/district/${district}`, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  generateHospitalReport(district: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.baseUrl}/hospitals/${district}`, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  generateCampaignReport(startDate: Date, endDate: Date): Observable<HttpResponse<Blob>> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get(`${this.baseUrl}/campaigns`, {
      params,
      observe: 'response',
      responseType: 'blob'
    });
  }

  generateEmergencyReport(startDate: Date, endDate: Date): Observable<HttpResponse<Blob>> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get(`${this.baseUrl}/emergencies`, {
      params,
      observe: 'response',
      responseType: 'blob'
    });
  }

  generateAppointmentReport(startDate: Date, endDate: Date): Observable<HttpResponse<Blob>> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get(`${this.baseUrl}/appointments`, {
      params,
      observe: 'response',
      responseType: 'blob'
    });
  }
} 