import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

interface EmergencyRequest {
  id: number;
  patientName: string;
  bloodType: string;
  hospital: string;
  hospitalEmail: string;
  contactNumber: string;
  unitsNeeded: number;
  urgencyLevel: string;
  description: string;
  imagePath: string;
  createdAt: string;
}

@Component({
  selector: 'app-view-emerganzy-blood-need',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './view-emerganzy-blood-need.component.html',
  styleUrl: './view-emerganzy-blood-need.component.css'
})
export class ViewEmerganzyBloodNeedComponent implements OnInit {
  emergencyRequests: EmergencyRequest[] = [];
  loading = false;
  editingRequest: EmergencyRequest | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  loggedInHospitalEmail: string = '';
  myRequests: EmergencyRequest[] = [];
  otherRequests: EmergencyRequest[] = [];
  activeTab: 'my' | 'other' = 'my';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Component initialized');
    this.loggedInHospitalEmail = localStorage.getItem('hospitalEmailAddress') || '';
    console.log('Logged in hospital:', this.loggedInHospitalEmail);
    this.loadEmergencyRequests();
  }

  loadEmergencyRequests() {
    this.loading = true;
    this.http.get<EmergencyRequest[]>('http://localhost:8080/api/emergency').subscribe({
      next: (data) => {
        this.myRequests = data.filter(req => req.hospitalEmail === this.loggedInHospitalEmail);
        this.otherRequests = data.filter(req => req.hospitalEmail !== this.loggedInHospitalEmail);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading emergency requests:', error);
        this.showErrorAlert('Error loading emergency requests');
        this.loading = false;
      }
    });
  }

  canEditRequest(request: EmergencyRequest): boolean {
    return this.loggedInHospitalEmail !== '' && 
           request.hospitalEmail === this.loggedInHospitalEmail;
  }

  setActiveTab(tab: 'my' | 'other') {
    this.activeTab = tab;
  }

  goBack() {
    this.router.navigate(['/emergency']);
  }

  initiateCall(contactNumber: string) {
    const confirmed = confirm('Do you want to call this contact number?');
    if (confirmed) {
      window.location.href = `tel:${contactNumber}`;
    }
  }

  deleteRequest(requestId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this emergency request!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:8080/api/emergency/${requestId}`).subscribe({
          next: () => {
            this.loadEmergencyRequests();
            this.showSuccessAlert('Emergency request deleted successfully');
          },
          error: (error) => {
            console.error('Error deleting request:', error);
            this.showErrorAlert('Error deleting emergency request');
          }
        });
      }
    });
  }

  showSuccessAlert(message: string) {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  }

  showErrorAlert(message: string) {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  editRequest(request: EmergencyRequest) {
    this.editingRequest = { ...request };
    if (request.imagePath) {
      this.imagePreview = 'http://localhost:8080' + request.imagePath;
    }
    Swal.fire({
      title: 'Edit Emergency Request',
      html: `
        <form id="editForm" class="edit-form">
          <input id="patientName" class="swal2-input" placeholder="Patient Name" value="${request.patientName}">
          <select id="bloodType" class="swal2-input">
            ${this.bloodTypes.map(type => 
              `<option value="${type}" ${type === request.bloodType ? 'selected' : ''}>${type}</option>`
            ).join('')}
          </select>
          <input id="contactNumber" class="swal2-input" placeholder="Contact Number" value="${request.contactNumber}">
          <input id="unitsNeeded" type="number" class="swal2-input" placeholder="Units Needed" value="${request.unitsNeeded}">
          <select id="urgencyLevel" class="swal2-input">
            <option value="HIGH" ${request.urgencyLevel === 'HIGH' ? 'selected' : ''}>High</option>
            <option value="MEDIUM" ${request.urgencyLevel === 'MEDIUM' ? 'selected' : ''}>Medium</option>
            <option value="LOW" ${request.urgencyLevel === 'LOW' ? 'selected' : ''}>Low</option>
          </select>
          <textarea id="description" class="swal2-textarea" placeholder="Description">${request.description}</textarea>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return {
          patientName: (document.getElementById('patientName') as HTMLInputElement).value,
          bloodType: (document.getElementById('bloodType') as HTMLSelectElement).value,
          contactNumber: (document.getElementById('contactNumber') as HTMLInputElement).value,
          unitsNeeded: (document.getElementById('unitsNeeded') as HTMLInputElement).value,
          urgencyLevel: (document.getElementById('urgencyLevel') as HTMLSelectElement).value,
          description: (document.getElementById('description') as HTMLTextAreaElement).value,
        };
      }
    }).then((result) => {
      if (result.isConfirmed && this.editingRequest) {
        const formData = new FormData();
        Object.entries(result.value!).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
        
        this.http.put(`http://localhost:8080/api/emergency/${this.editingRequest.id}`, formData)
          .subscribe({
            next: () => {
              Swal.fire('Updated!', 'Emergency request has been updated.', 'success');
              this.loadEmergencyRequests();
            },
            error: (error) => {
              Swal.fire('Error!', 'Failed to update the request.', 'error');
              console.error('Error updating request:', error);
            }
          });
      }
      this.editingRequest = null;
    });
  }
}
