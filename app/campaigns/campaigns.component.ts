import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface Campaign {
  id?: number;
  title: string;
  date: string;
  venue: string;
  description: string;
  imagePath?: string;
  hospitalName: string;
  contactNumber: string;
  district: string;
}

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './campaigns.component.html',
  styleUrl: './campaigns.component.css'
})
export class CampaignsComponent implements OnInit {
  campaign: Campaign = {
    title: '',
    date: '',
    venue: '',
    description: '',
    hospitalName: '',
    contactNumber: '',
    district: ''
  };
  selectedFile: File | null = null;
  loading = false;
  hospitalEmailAddress: string = '';
  hospitalDistrict: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.hospitalEmailAddress = localStorage.getItem('hospitalEmailAddress') || '';
    if (this.hospitalEmailAddress) {
      this.loadHospitalDetails();
    }
  }

  loadHospitalDetails() {
    this.http.get(`http://localhost:8080/hospital/details/${this.hospitalEmailAddress}`).subscribe({
      next: (response: any) => {
        console.log('Hospital details:', response);
        this.campaign.hospitalName = response.hospitalName;
        this.campaign.contactNumber = response.contactNumber;
        this.campaign.district = response.district;
        this.hospitalDistrict = response.district;
      },
      error: (error) => {
        console.error('Error loading hospital details:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load hospital details'
        });
      }
    });
  }

  onFileSelect(event: any) {
    this.selectedFile = event.target.files[0];
  }

  createCampaign() {
    if (!this.selectedFile) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select an image'
      });
      return;
    }

    if (!this.campaign.hospitalName || !this.campaign.contactNumber || !this.campaign.district) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hospital details are missing'
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', this.campaign.title);
    formData.append('date', this.campaign.date);
    formData.append('venue', this.campaign.venue);
    formData.append('description', this.campaign.description);
    formData.append('hospitalName', this.campaign.hospitalName);
    formData.append('contactNumber', this.campaign.contactNumber);
    formData.append('hospitalEmail', this.hospitalEmailAddress);
    formData.append('district', this.campaign.district);
    formData.append('image', this.selectedFile);

    console.log('Form data:', {
      title: this.campaign.title,
      date: this.campaign.date,
      venue: this.campaign.venue,
      description: this.campaign.description,
      hospitalName: this.campaign.hospitalName,
      contactNumber: this.campaign.contactNumber,
      district: this.campaign.district
    });

    this.loading = true;
    this.http.post<Campaign>('http://localhost:8080/campaign', formData).subscribe({
      next: () => {
        this.resetForm();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Campaign created successfully!'
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error creating campaign:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error creating campaign'
        });
        this.loading = false;
      }
    });
  }

  private resetForm() {
    const hospitalName = this.campaign.hospitalName;
    const contactNumber = this.campaign.contactNumber;
    const district = this.campaign.district;
    this.campaign = {
      title: '',
      date: '',
      venue: '',
      description: '',
      hospitalName,
      contactNumber,
      district
    };
    this.selectedFile = null;
  }

  viewCampaigns() {
    this.router.navigate(['/view-campaigns']);
  }
}
