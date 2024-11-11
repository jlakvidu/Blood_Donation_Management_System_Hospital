import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HospitalProfileService } from '../../services/hospital-profile.service';

interface HospitalProfile {
  id: number;
  name: string;
  type: string;
  profileImagePath?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isSidebarOpen = false;
  hospitalData: HospitalProfile = {
    id: 0,
    name: '',
    type: ''
  };
  public apiUrl = 'http://localhost:8080';
  bloodUnits = 250;
  staffMembers = 15;
  private profileImageListener: any;
  private profileSubscription: any;
  shouldShowHeader = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private hospitalProfileService: HospitalProfileService
  ) {
    this.profileImageListener = () => {
      this.loadHospitalProfile();
    };
    window.addEventListener('profileImageUpdated', this.profileImageListener);
    window.addEventListener('storage', this.checkAuthStatus.bind(this));
  }

  ngOnInit(): void {
    this.checkAuthStatus();
    const emailAddress = localStorage.getItem('hospitalEmailAddress');
    if (emailAddress) {
      this.hospitalProfileService.loadHospitalProfile(emailAddress);
    }

    this.profileSubscription = this.hospitalProfileService.getHospitalProfile()
      .subscribe(profile => {
        if (profile) {
          this.hospitalData = profile;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
    window.removeEventListener('profileImageUpdated', this.profileImageListener);
    window.removeEventListener('storage', this.checkAuthStatus.bind(this));
  }

  private loadHospitalProfile(): void {
    const emailAddress = localStorage.getItem('hospitalEmailAddress');

    if (emailAddress) {
      this.http.get<any>(`${this.apiUrl}/hospital/profile/${emailAddress}`)
        .subscribe({
          next: (response) => {
            this.hospitalData = {
              ...response,
              profileImagePath: response.profileImagePath
            };
            console.log('Hospital data loaded:', this.hospitalData);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error loading hospital profile:', error);
            if (error.status === 401) {
              this.router.navigate(['/login']);
            }
          }
        });
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  handleImageError(event: any): void {
    event.target.style.backgroundImage = 'url(assets/images/default-hospital.jpg)';
  }

  navigateToHospitalProfile(): void {
    this.router.navigate(['/hospital-profile']).then(() => {
      if (this.isSidebarOpen) {
        this.toggleSidebar();
      }
    });
  }

  logout(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of the system',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('hospitalEmailAddress');
        localStorage.removeItem('isHospitalLoggedIn');

        this.router.navigate(['/login']).then(() => {
          Swal.fire({
            title: 'Logged Out!',
            text: 'You have been successfully logged out',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });

          setTimeout(() => {
            window.location.reload();
          }, 1500);
        });

        if (this.isSidebarOpen) {
          this.toggleSidebar();
        }
      }
    });
  }

  private checkAuthStatus(): void {
    this.shouldShowHeader = localStorage.getItem('isHospitalLoggedIn') === 'true';
  }
}