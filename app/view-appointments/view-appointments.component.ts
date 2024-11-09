import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

interface Appointment {
  id: number;
  patientName: string;
  appointmentDateTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  bloodType: string;
  contactNumber: string;
  emailAddress: string;
  hospital: {
    id: number;
    name: string;
    emailAddress: string;
  };
}

interface NotificationDTO {
  recipientEmail: string;
  title: string;
  message: string;
  type: 'APPOINTMENT_CONFIRMED' | 'APPOINTMENT_CANCELLED' | 'OTHER';
}

@Component({
  selector: 'app-view-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-appointments.component.html',
  styleUrl: './view-appointments.component.css'
})
export class ViewAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  isLoading = false;
  error: string | null = null;
  private apiUrl = 'http://localhost:8080/appointments';
  private notificationUrl = 'http://localhost:8080/notifications';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.isLoading = true;
    const hospitalEmail = localStorage.getItem('hospitalEmailAddress');

    this.http.get<Appointment[]>(`${this.apiUrl}/get-appointments`)
      .subscribe({
        next: (appointments) => {
          this.appointments = appointments.filter(
            app => app.hospital.emailAddress === hospitalEmail
          );
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading appointments:', error);
          this.error = 'Failed to load appointments';
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to load appointments'
          });
        }
      });
  }

  private createNotification(appointment: Appointment, status: 'CONFIRMED' | 'CANCELLED') {
    const notification: NotificationDTO = {
      recipientEmail: appointment.emailAddress,
      title: this.getNotificationTitle(status),
      message: this.getNotificationMessage(appointment, status),
      type: status === 'CONFIRMED' ? 'APPOINTMENT_CONFIRMED' : 'APPOINTMENT_CANCELLED'
    };

    return this.http.post(`${this.notificationUrl}/create`, notification, {
      responseType: 'text',
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  private getNotificationTitle(status: 'CONFIRMED' | 'CANCELLED'): string {
    return `Blood Donation Appointment ${status}`;
  }

  private getNotificationMessage(
    appointment: Appointment,
    status: 'CONFIRMED' | 'CANCELLED'
  ): string {
    const hospitalName = appointment.hospital.name;

    if (status === 'CONFIRMED') {
      return `
            Dear ${appointment.patientName},
            
            Your blood donation appointment has been confirmed.
            
            Appointment Details:
            - Hospital: ${hospitalName}
            - Blood Type: ${appointment.bloodType}
            
            Please arrive 15 minutes before your scheduled time.
            
            Thank you for your commitment to saving lives through blood donation.
            
            Best regards,
            ${hospitalName}
        `;
    } else {
      return `
            Dear ${appointment.patientName},
            
            Your blood donation appointment has been cancelled.
            
            Appointment Details:
            - Hospital: ${hospitalName}
            - Blood Type: ${appointment.bloodType}
            
            If you would like to reschedule, please book a new appointment through our system.
            
            We apologize for any inconvenience caused.
            
            Best regards,
            ${hospitalName}
        `;
    }
  }

  updateStatus(appointmentId: number, newStatus: 'CONFIRMED' | 'CANCELLED') {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${newStatus.toLowerCase()} this appointment?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.patch(`${this.apiUrl}/${appointmentId}/status`, { status: newStatus })
          .subscribe({
            next: () => {
              const updatedAppointment = this.appointments.find(app => app.id === appointmentId);
              if (updatedAppointment) {
                this.createNotification(updatedAppointment, newStatus).subscribe({
                  next: (response: string) => {
                    this.loadAppointments();
                    Swal.fire({
                      icon: 'success',
                      title: 'Success!',
                      text: `Appointment ${newStatus.toLowerCase()} and notification sent.`
                    });
                  },
                  error: (error) => {
                    console.error('Error sending notification:', error);
                    this.loadAppointments();
                    Swal.fire({
                      icon: 'warning',
                      title: 'Partial Success',
                      text: `Appointment status updated but notification failed.`
                    });
                  }
                });
              }
            },
            error: (error) => {
              console.error('Error updating status:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Failed to update appointment status`
              });
            }
          });
      }
    });
  }

  deleteAppointment(appointmentId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/delete/${appointmentId}`)
          .subscribe({
            next: () => {
              this.appointments = this.appointments.filter(app => app.id !== appointmentId);
              Swal.fire(
                'Deleted!',
                'The appointment has been deleted.',
                'success'
              );
            },
            error: (error) => {
              console.error('Error deleting appointment:', error);
              Swal.fire(
                'Error!',
                'Failed to delete the appointment.',
                'error'
              );
            }
          });
      }
    });
  }
}
