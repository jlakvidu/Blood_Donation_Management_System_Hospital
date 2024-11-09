import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

interface Campaign {
  id?: number;
  title: string;
  date: string;
  venue: string;
  description: string;
  imagePath?: string;
  hospitalName: string;
  contactNumber: string;
  hospitalEmail?: string;
}

@Component({
  selector: 'app-view-campaigns',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './view-campaigns.component.html',
  styleUrl: './view-campaigns.component.css'
})
export class ViewCampaignsComponent implements OnInit {
  campaigns: Campaign[] = [];
  loading = false;
  showUpdateModal = false;
  loggedInHospitalEmail: string = '';
  selectedCampaign: Campaign = {
    title: '',
    date: '',
    venue: '',
    description: '',
    hospitalName: '',
    contactNumber: ''
  };
  myCampaigns: Campaign[] = [];
  otherCampaigns: Campaign[] = [];
  activeTab: 'my' | 'other' = 'my';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loggedInHospitalEmail = localStorage.getItem('hospitalEmailAddress') || '';
    this.loadCampaigns();
  }

  loadCampaigns() {
    this.loading = true;
    this.http.get<Campaign[]>('http://localhost:8080/campaign').subscribe({
      next: (data) => {
        this.myCampaigns = data.filter(camp => camp.hospitalEmail === this.loggedInHospitalEmail);
        this.otherCampaigns = data.filter(camp => camp.hospitalEmail !== this.loggedInHospitalEmail);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading campaigns:', error);
        this.showErrorAlert('Error loading campaigns');
        this.loading = false;
      }
    });
  }

  updateCampaign(campaign: Campaign) {
    this.selectedCampaign = { ...campaign };
    this.showUpdateModal = true;
  }

  closeUpdateModal() {
    this.showUpdateModal = false;
  }

  saveUpdate() {
    if (!this.selectedCampaign.id) return;

    Swal.fire({
      title: 'Updating Campaign',
      text: 'Please wait...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.http.put(`http://localhost:8080/campaign/update/${this.selectedCampaign.id}`, 
      this.selectedCampaign
    ).subscribe({
      next: () => {
        const index = this.campaigns.findIndex(c => c.id === this.selectedCampaign.id);
        if (index !== -1) {
          this.campaigns[index] = { ...this.selectedCampaign };
        }
        this.showSuccessAlert('Campaign updated successfully');
        this.closeUpdateModal();
      },
      error: (error) => {
        console.error('Error updating campaign:', error);
        this.showErrorAlert('Error updating campaign');
      }
    });
  }

  deleteCampaign(id: number | undefined) {
    if (!id) return;
    
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this campaign!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:8080/campaign/delete/${id}`).subscribe({
          next: () => {
            this.campaigns = this.campaigns.filter(camp => camp.id !== id);
            this.showSuccessAlert('Campaign deleted successfully');
          },
          error: (error) => {
            console.error('Error deleting campaign:', error);
            this.showErrorAlert('Error deleting campaign');
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

  goBack() {
    this.router.navigate(['/campaigns']);
  }

  canEditCampaign(campaign: Campaign): boolean {
    return this.loggedInHospitalEmail !== '' && 
           campaign.hospitalEmail === this.loggedInHospitalEmail;
  }

  setActiveTab(tab: 'my' | 'other') {
    this.activeTab = tab;
  }
}
