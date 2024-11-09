import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

interface HospitalProfile {
  id: number;
  name: string;
  registrationNumber: string;
  type: string;
  address: string;
  emailAddress: string;
  contactNumber: string;
  bloodBankLicenseNumber: string;
  bloodBankCapacity: string;
  operatingDaysAndHours: string;
  specialInstructions: string;
  district?: string;
  password?: string;
  profileImagePath?: string;
}

interface BloodGroup {
  type: string;
  units: number;
}

@Component({
  selector: 'app-hospital-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './hospital-profile.component.html',
  styleUrl: './hospital-profile.component.css'
})
export class HospitalProfileComponent implements OnInit {
  hospitalData: HospitalProfile | any = {};
  isLoading = true;
  isEditMode = false;
  isUpdating = false;
  public apiUrl = 'http://localhost:8080';
  showModal = false;

  bloodGroups: BloodGroup[] = [
    { type: 'A+', units: 150 },
    { type: 'A-', units: 75 },
    { type: 'B+', units: 200 },
    { type: 'B-', units: 80 },
    { type: 'AB+', units: 100 },
    { type: 'AB-', units: 50 },
    { type: 'O+', units: 250 },
    { type: 'O-', units: 120 }
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadHospitalProfile();
  }

  private loadHospitalProfile(): void {
    const emailAddress = localStorage.getItem('hospitalEmailAddress');

    if (emailAddress) {
      this.isLoading = true;
      this.http.get<any>(`${this.apiUrl}/hospital/profile/${emailAddress}`)
        .subscribe({
          next: (response) => {
            this.hospitalData = {
              ...response,
              profileImagePath: response.profileImagePath
            };
            this.isLoading = false;
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error loading hospital profile:', error);
            this.isLoading = false;

            Swal.fire({
              icon: 'error',
              title: 'Error Loading Profile',
              text: 'Failed to load hospital profile. Please try again later.'
            });
          }
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'Please login to view your profile',
        confirmButtonText: 'Go to Login'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
    }
  }

  deleteHospitalById(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone. All hospital data will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete account'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/hospital/delete-hospital/${id}`).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Account Deleted',
              text: 'Your hospital account has been successfully deleted.',
              confirmButtonText: 'OK'
            }).then(() => {
              localStorage.clear();
              this.router.navigate(['/login']);
            });
          },
          error: (error) => {
            console.error('Error deleting hospital:', error);
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: 'Failed to delete hospital account. Please try again later.'
            });
          }
        });
      }
    });
  }

  enableEditMode(): void {
    this.isEditMode = true;
  }

  toggleModal(): void {
    this.showModal = !this.showModal;
  }

  updateHospital(): void {
    this.isUpdating = true;

    const bloodBankCapacity = parseInt(this.hospitalData.bloodBankCapacity);

    const updateData = {
      id: this.hospitalData.id,
      name: this.hospitalData.name,
      registrationNumber: this.hospitalData.registrationNumber,
      type: this.hospitalData.type,
      district: this.hospitalData.district,
      address: this.hospitalData.address,
      emailAddress: this.hospitalData.emailAddress,
      contactNumber: this.hospitalData.contactNumber,
      bloodBankLicenseNumber: this.hospitalData.bloodBankLicenseNumber,
      bloodBankCapacity: this.hospitalData.bloodBankCapacity,
      operatingDaysAndHours: this.hospitalData.operatingDaysAndHours,
      specialInstructions: this.hospitalData.specialInstructions,
      password: this.hospitalData.password,
      profileImagePath: this.hospitalData.profileImagePath
    };

    console.log('Update data being sent:', updateData);

    this.http.put<string>(`${this.apiUrl}/hospital/update-hospital`, updateData)
      .subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            text: 'Hospital profile updated successfully.',
          });

          if (bloodBankCapacity < 20) {
            Swal.fire({
              icon: 'warning',
              title: 'Low Blood Bank Capacity',
              text: 'Notifications will be sent to donors in your district.',
            });
          }

          this.isEditMode = false;
          this.isUpdating = false;
          this.toggleModal();
          this.loadHospitalProfile();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating hospital:', error);
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: error.error || 'Failed to update hospital profile. Please try again later.',
          });
          this.isUpdating = false;
        }
      });
  }

  parseInt(value: string): number {
    return Number.parseInt(value) || 0;
  }

  handleImageError(event: any): void {
    event.target.style.backgroundImage = 'url(assets/images/default-hospital.jpg)';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Please select an image file'
        });
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'File size should be less than 10MB'
        });
        return;
      }

      this.uploadImage(file);
    }
  }

  private uploadImage(file: File): void {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('hospitalId', this.hospitalData.id.toString());

    this.isLoading = true;

    this.http.post(`${this.apiUrl}/hospital/upload-profile-image`, formData)
      .subscribe({
        next: (response: any) => {
          this.hospitalData.profileImagePath = response.profileImagePath;
          localStorage.setItem('hospitalProfileImage', response.profileImagePath);

          window.dispatchEvent(new Event('profileImageUpdated'));

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Profile image updated successfully'
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: 'Failed to upload image. Please try again.'
          });
          this.isLoading = false;
        }
      });
  }
}