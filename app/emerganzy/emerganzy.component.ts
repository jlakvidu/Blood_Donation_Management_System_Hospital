import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

interface Hospital {
  id: number;
  name: string;
  registrationNumber: string;
  type: string;
  district: string;
  address: string;
  emailAddress: string;
  contactNumber: string;
  bloodBankLicenseNumber: string;
  bloodBankCapacity: string;
  operatingDaysAndHours: string;
  specialInstructions: string;
  password?: string;
}

interface Donor {
  email: string;
  district: string;
  bloodType: string;
}

@Component({
  selector: 'app-emerganzy',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './emerganzy.component.html',
  styleUrl: './emerganzy.component.css'
})
export class EmerganzyComponent implements OnInit {
  bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  loggedInHospitalEmail: string = '';
  hospitalDistrict: string = '';

  emergencyRequest = {
    patientName: '',
    bloodType: '',
    hospital: '',
    hospitalEmail: '',
    district: '',
    contactNumber: '',
    unitsNeeded: 1,
    urgencyLevel: '',
    description: ''
  };

  isEditMode = false;
  editingId: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {

    this.loggedInHospitalEmail = localStorage.getItem('hospitalEmailAddress') || '';
    if (!this.loggedInHospitalEmail) {
      alert('Please log in first');
      this.router.navigate(['/login']);
      return;
    }

    this.emergencyRequest.hospitalEmail = this.loggedInHospitalEmail;

    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('edit') === 'true' && queryParams.get('id')) {
      this.isEditMode = true;
      this.editingId = Number(queryParams.get('id'));
      this.loadRequestForEdit(this.editingId);
    }

    this.loadHospitalDetails();
  }

  loadRequestForEdit(id: number) {
    this.http.get(`http://localhost:8080/api/emergency/${id}`)
      .subscribe({
        next: (request: any) => {
          if (request.hospitalEmail !== this.loggedInHospitalEmail) {
            alert('You are not authorized to edit this request');
            this.router.navigate(['/view-emergency']);
            return;
          }

          this.emergencyRequest = request;
        },
        error: (error) => {
          console.error('Error loading request:', error);
          alert('Error loading request for edit');
        }
      });
  }

  loadHospitalDetails() {
    this.http.get<any>(`http://localhost:8080/hospital/details/${this.loggedInHospitalEmail}`)
      .subscribe({
        next: (details) => {
          console.log('Hospital Details Received:', details);

          if (!details.district) {
            console.error('Hospital district is missing from response');
            alert('Hospital district information is missing. Please update your hospital profile.');
            return;
          }

          this.emergencyRequest.district = details.district;
          this.hospitalDistrict = details.district;
          this.emergencyRequest.hospital = details.hospitalName;
          this.emergencyRequest.contactNumber = details.contactNumber;
          this.emergencyRequest.hospitalEmail = details.emailAddress;

          console.log('Updated Emergency Request:', this.emergencyRequest);
          console.log('Hospital District:', this.hospitalDistrict);
        },
        error: (error) => {
          console.error('Error loading hospital details:', error);
          alert('Error loading hospital details. Please try again.');
        }
      });
  }

  submitRequest() {
    const requestData = {
      patientName: this.emergencyRequest.patientName,
      bloodType: this.emergencyRequest.bloodType,
      hospital: this.emergencyRequest.hospital,
      district: this.hospitalDistrict,
      hospitalEmail: this.loggedInHospitalEmail,
      contactNumber: this.emergencyRequest.contactNumber,
      unitsNeeded: this.emergencyRequest.unitsNeeded,
      urgencyLevel: this.emergencyRequest.urgencyLevel,
      description: this.emergencyRequest.description || ''
    };

    const url = this.isEditMode
      ? `http://localhost:8080/api/emergency/${this.editingId}`
      : 'http://localhost:8080/api/emergency';

    const headers = { 'Content-Type': 'application/json' };

    this.isEditMode
      ? this.http.put(url, requestData, { headers })
      : this.http.post(url, requestData, { headers })
        .subscribe({
          next: (response) => {
            alert(`Emergency request ${this.isEditMode ? 'updated' : 'created'} successfully!`);
            this.notifyMatchingDonors();
            this.router.navigate(['/view-emergency']);
          },
          error: (error) => {
            console.error('Error:', error);
            alert(`Error ${this.isEditMode ? 'updating' : 'creating'} emergency request`);
          }
        });
  }

  notifyMatchingDonors() {
    if (!this.hospitalDistrict) {
      console.error('Hospital district is not initialized');
      alert('Hospital district information is missing. Email notifications cannot be sent.');
      return;
    }

    console.log('Hospital District:', this.hospitalDistrict);
    console.log('Emergency Request:', this.emergencyRequest);

    const emailRequest = {
      bloodType: this.emergencyRequest.bloodType,
      district: this.hospitalDistrict,
      hospitalName: this.emergencyRequest.hospital,
      urgencyLevel: this.emergencyRequest.urgencyLevel,
      unitsNeeded: this.emergencyRequest.unitsNeeded,
      contactNumber: this.emergencyRequest.contactNumber
    };

    if (!emailRequest.district) {
      console.error('District is missing in email request:', emailRequest);
      alert('District information is missing. Cannot send notifications.');
      return;
    }

    console.log('Email Request Payload:', emailRequest);

    const headers = { 'Content-Type': 'application/json' };

    this.http.post('http://localhost:8080/api/notify-donors', emailRequest, {
      headers: headers,
      observe: 'response'
    }).subscribe({
      next: (response: any) => {
        console.log('Full Response:', response);
        if (response.body && response.body.notifiedCount !== undefined) {
          console.log(`Notification sent to ${response.body.notifiedCount} donors`);
          alert(`Notification sent to ${response.body.notifiedCount} donors`);
        } else {
          console.error('Invalid response format:', response);
        }
      },
      error: (error) => {
        console.error('Full Error Object:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
        alert('Failed to send notifications to donors. Please try again.');
      }
    });
  }

  resetForm() {
    const savedDistrict = this.emergencyRequest.district;
    const savedHospitalEmail = this.loggedInHospitalEmail;
    const savedHospital = this.emergencyRequest.hospital;
    const savedContactNumber = this.emergencyRequest.contactNumber;

    this.emergencyRequest = {
      patientName: '',
      bloodType: '',
      hospital: savedHospital,
      hospitalEmail: savedHospitalEmail,
      district: savedDistrict,
      contactNumber: savedContactNumber,
      unitsNeeded: 1,
      urgencyLevel: '',
      description: ''
    };
  }

  viewEmergencyRequests() {
    this.router.navigate(['/view-emergency']);
  }
}
