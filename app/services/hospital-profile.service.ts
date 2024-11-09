import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface HospitalProfile {
  id: number;
  name: string;
  type: string;
  profileImagePath?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HospitalProfileService {
  private apiUrl = 'http://localhost:8080';
  private hospitalProfileSubject = new BehaviorSubject<HospitalProfile | null>(null);
  
  constructor(private http: HttpClient) {}

  getHospitalProfile(): Observable<HospitalProfile | null> {
    return this.hospitalProfileSubject.asObservable();
  }

  loadHospitalProfile(emailAddress: string): void {
    this.http.get<HospitalProfile>(`${this.apiUrl}/hospital/profile/${emailAddress}`)
      .subscribe({
        next: (profile) => {
          this.hospitalProfileSubject.next(profile);
        },
        error: (error) => {
          console.error('Error loading hospital profile:', error);
        }
      });
  }

  updateProfile(profile: HospitalProfile): void {
    this.hospitalProfileSubject.next(profile);
  }
} 