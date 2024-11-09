import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Donor {
  id: number;
  name: string;
  age: number;
  address: string;
  bloodType: string;
  district: string;
  contactNumber: string;
  emailAddress: string;
  lastDonationDate?: string;
}

@Component({
  selector: 'app-view-donors',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './view-donors.component.html',
  styleUrls: ['./view-donors.component.css']
})
export class ViewDonorsComponent implements OnInit {
  donors: Donor[] = [];
  filteredDonors: Donor[] = [];
  selectedDistrict: string = '';
  isLoading: boolean = false;
  districts: string[] = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle'
  ];
  
  private apiUrl = 'http://localhost:8080/donor';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAllDonors();
  }

  loadAllDonors(): void {
    this.isLoading = true;
    this.http.get<Donor[]>(`${this.apiUrl}/get-all`)
      .subscribe({
        next: (response) => {
          console.log('Donors data:', response);
          this.donors = response;
          this.filteredDonors = response;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading donors:', error);
          this.isLoading = false;
        }
      });
  }

  onDistrictChange(): void {
    if (!this.selectedDistrict) {
      this.filteredDonors = this.donors;
      return;
    }

    this.isLoading = true;
    this.http.get<Donor[]>(`${this.apiUrl}/donors-by-district/${this.selectedDistrict}`)
      .subscribe({
        next: (response) => {
          this.filteredDonors = response;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading donors by district:', error);
          this.isLoading = false;
        }
      });
  }

  clearFilter(): void {
    this.selectedDistrict = '';
    this.filteredDonors = this.donors;
  }

  isRecentDonation(date: string | undefined): string {
    if (!date) return 'Never donated';
    
    const donationDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - donationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      return 'This week';
    } else if (diffDays <= 30) {
      return 'This month';
    } else if (diffDays <= 90) {
      return 'Last 3 months';
    } else if (diffDays <= 180) {
      return '6 months ago';
    } else {
      return donationDate.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
}
