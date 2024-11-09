import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DonorReportDialogComponent } from './donor-report-dialog/donor-report-dialog.component';
import { ReportService } from '../services/report.service';
import { CampaignReportDialogComponent } from './campaign-report-dialog/campaign-report-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { EmergencyReportDialogComponent } from './emergency-report-dialog/emergency-report-dialog.component';
import { AppointmentReportDialogComponent } from './appointment-report-dialog/appointment-report-dialog.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatButtonModule,
    MatInputModule,
    MatNativeDateModule
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  reports = [
    {
      title: 'Donor Analytics',
      icon: 'volunteer_activism',
      description: 'View donor statistics, blood type distribution, and donation patterns',
      color: '#e91e63'
    },
    {
      title: 'Hospital Statistics',
      icon: 'local_hospital',
      description: 'Track hospital requests, inventory status, and emergency responses',
      color: '#2196f3'
    },
    {
      title: 'Campaign Performance',
      icon: 'campaign',
      description: 'Analyze campaign effectiveness and donation drives',
      color: '#4caf50'
    },
    {
      title: 'Emergency Analysis',
      icon: 'emergency',
      description: 'Monitor emergency request patterns and response times',
      color: '#f44336'
    },
    {
      title: 'Appointment Analytics',
      icon: 'event_available',
      description: 'Track appointment schedules and attendance rates',
      color: '#ff9800'
    },
    {
      title: 'Notification Metrics',
      icon: 'notifications',
      description: 'Measure notification effectiveness and response rates',
      color: '#9c27b0'
    }
  ];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private reportService: ReportService
  ) {}

  generateReport(report: any): void {
    if (report.title === 'Donor Analytics') {
      const dialogRef = this.dialog.open(DonorReportDialogComponent, {
        width: '400px',
        data: report
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.reportService.generateDistrictReport(result.district).subscribe({
            next: (response) => {
              const blob = response.body;
              if (!blob) return;
              const filename = `donor-report-${result.district}.pdf`;
              
              const downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(blob);
              downloadLink.download = filename;
              
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
              
              this.snackBar.open('Report downloaded successfully', 'Close', {
                duration: 3000
              });
            },
            error: (error) => {
              console.error('Error generating report:', error);
              this.snackBar.open('Error generating report', 'Close', {
                duration: 3000
              });
            }
          });
        }
      });
    } else if (report.title === 'Hospital Statistics') {
      const dialogRef = this.dialog.open(DonorReportDialogComponent, {
        width: '400px',
        data: report
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.reportService.generateHospitalReport(result.district).subscribe({
            next: (response) => {
              const blob = response.body;
              if (!blob) return;
              const filename = `hospital-report-${result.district}.pdf`;
              
              const downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(blob);
              downloadLink.download = filename;
              
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
              
              this.snackBar.open('Hospital report downloaded successfully', 'Close', {
                duration: 3000
              });
            },
            error: (error) => {
              console.error('Error generating hospital report:', error);
              this.snackBar.open('Error generating hospital report', 'Close', {
                duration: 3000
              });
            }
          });
        }
      });
    } else if (report.title === 'Campaign Performance') {
      const dialogRef = this.dialog.open(CampaignReportDialogComponent, {
        width: '400px',
        data: report
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.reportService.generateCampaignReport(result.startDate, result.endDate).subscribe({
            next: (response) => {
              const blob = response.body;
              if (!blob) return;
              
              const filename = `campaign-report-${result.startDate.toISOString().split('T')[0]}-to-${result.endDate.toISOString().split('T')[0]}.pdf`;
              
              const downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(blob);
              downloadLink.download = filename;
              
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
              
              this.snackBar.open('Campaign report downloaded successfully', 'Close', {
                duration: 3000
              });
            },
            error: (error) => {
              console.error('Error generating campaign report:', error);
              this.snackBar.open('Error generating campaign report', 'Close', {
                duration: 3000
              });
            }
          });
        }
      });
    } else if (report.title === 'Emergency Analysis') {
      const dialogRef = this.dialog.open(EmergencyReportDialogComponent, {
        width: '400px',
        data: report
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.reportService.generateEmergencyReport(result.startDate, result.endDate).subscribe({
            next: (response) => {
              const blob = response.body;
              if (!blob) return;
              const filename = `emergency-report-${result.startDate.toISOString().split('T')[0]}-to-${result.endDate.toISOString().split('T')[0]}.pdf`;
              
              const downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(blob);
              downloadLink.download = filename;
              
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
              
              this.snackBar.open('Emergency report downloaded successfully', 'Close', {
                duration: 3000
              });
            },
            error: (error) => {
              console.error('Error generating emergency report:', error);
              this.snackBar.open('Error generating emergency report', 'Close', {
                duration: 3000
              });
            }
          });
        }
      });
    } else if (report.title === 'Appointment Analytics') {
      const dialogRef = this.dialog.open(AppointmentReportDialogComponent, {
        width: '400px',
        data: report
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.reportService.generateAppointmentReport(result.startDate, result.endDate).subscribe({
            next: (response) => {
              const blob = response.body;
              if (!blob) return;
              const filename = `appointment-report-${result.startDate.toISOString().split('T')[0]}-to-${result.endDate.toISOString().split('T')[0]}.pdf`;
              
              const downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(blob);
              downloadLink.download = filename;
              
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
              
              this.snackBar.open('Appointment report downloaded successfully', 'Close', {
                duration: 3000
              });
            },
            error: (error) => {
              console.error('Error generating appointment report:', error);
              this.snackBar.open('Error generating appointment report', 'Close', {
                duration: 3000
              });
            }
          });
        }
      });
    }
  }

  viewHistory(report: any): void {
    // Implement view history logic
    console.log('Viewing history for:', report.title);
  }
}
