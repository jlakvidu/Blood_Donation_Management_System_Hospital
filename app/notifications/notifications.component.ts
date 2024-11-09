import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notifications',
  template: `
    <div class="notification-container">
      <p>Notifications will be sent automatically when blood bank capacity is low.</p>
    </div>
  `,
  styles: [`
    .notification-container {
      text-align: center;
      margin-top: 20px;
    }
  `]
})
export class NotificationsComponent {
  constructor(private http: HttpClient) { }
}