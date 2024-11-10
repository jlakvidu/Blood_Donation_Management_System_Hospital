import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { HospitalProfileService } from '../services/hospital-profile.service';

interface LoginRequest {
  emailAddress: string;
  password: string;
}

@Component({
  selector: 'app-hospital-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './hospital-sign-in.component.html',
  styleUrl: './hospital-sign-in.component.css'
})
export class HospitalSignInComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';
  private apiUrl = 'http://localhost:8080/hospital/login';

  showForgotPassword = false;
  showOTPInput = false;
  showNewPassword = false;
  resetEmail = '';
  otp = '';
  newPassword = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private hospitalProfileService: HospitalProfileService
  ) { }

  ngOnInit() {
    if (localStorage.getItem('isHospitalLoggedIn') === 'true') {
      this.router.navigate(['/hospital-dashboard']);
    }

    this.loginForm = this.fb.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginRequest: LoginRequest = {
        emailAddress: this.loginForm.get('emailAddress')?.value.trim(),
        password: this.loginForm.get('password')?.value
      };

      this.sendLoginRequest(loginRequest);
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  private sendLoginRequest(loginRequest: LoginRequest) {
    this.http.post(this.apiUrl, loginRequest, { responseType: 'text' })
      .subscribe({
        next: (response: string) => {
          this.isLoading = false;
          console.log('Login response:', response);

          if (response === "Login successful") {
            localStorage.setItem('hospitalEmailAddress', loginRequest.emailAddress);
            localStorage.setItem('isHospitalLoggedIn', 'true');

            this.hospitalProfileService.loadHospitalProfile(loginRequest.emailAddress);

            window.dispatchEvent(new Event('storage'));
            
            this.router.navigate(['/hospital-dashboard']);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Login Failed',
              text: 'Invalid credentials'
            });
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Login error:', error);
          this.isLoading = false;

          let errorMessage = 'Login failed. Please try again.';

          if (error.status === 401) {
            errorMessage = error.error || 'Invalid email address or password';
          } else if (error.status === 404) {
            errorMessage = 'Hospital not found';
          } else if (error.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          }

          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: errorMessage
          });

          this.loginForm.patchValue({
            password: ''
          });
        }
      });
  }

  navigateToSignUp(event: Event) {
    event.preventDefault();
    Swal.fire({
      title: 'Redirecting...',
      text: 'Taking you to the registration page',
      icon: 'info',
      timer: 1000,
      showConfirmButton: false,
      willClose: () => {
        this.router.navigate(['/hospital-sign-up']);
      }
    });
  }

  toggleForgotPassword(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.showForgotPassword = !this.showForgotPassword;
    this.showOTPInput = false;
    this.showNewPassword = false;
    this.resetEmail = '';
    this.otp = '';
    this.newPassword = '';
  }

  requestPasswordReset() {
    if (!this.resetEmail) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter your email address',
        icon: 'error'
      });
      return;
    }

    this.http.post('http://localhost:8080/hospital/password/request-reset',
      { emailAddress: this.resetEmail },
      { responseType: 'text' }
    ).subscribe({
      next: (response) => {
        this.showOTPInput = true;
        Swal.fire({
          title: 'Success',
          text: 'OTP has been sent to your email',
          icon: 'success'
        });
      },
      error: (error) => {
        if (error.status === 404) {
          Swal.fire({
            title: 'Error',
            text: 'Hospital not found with this email',
            icon: 'error'
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: error.error || 'Failed to send OTP',
            icon: 'error'
          });
        }
      }
    });
  }

  verifyOTP() {
    if (!this.otp) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter the OTP',
        icon: 'error'
      });
      return;
    }

    this.http.post('http://localhost:8080/hospital/password/verify-otp',
      {
        emailAddress: this.resetEmail,
        otp: this.otp
      },
      { responseType: 'text' }
    ).subscribe({
      next: (response) => {
        this.showNewPassword = true;
        this.showOTPInput = false;
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'Invalid or expired OTP',
          icon: 'error'
        });
      }
    });
  }

  resetPassword() {
    if (!this.newPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Please enter a new password',
        icon: 'error'
      });
      return;
    }

    this.http.post('http://localhost:8080/hospital/password/reset',
      {
        emailAddress: this.resetEmail,
        newPassword: this.newPassword
      },
      { responseType: 'text' }
    ).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Success',
          text: 'Password has been reset successfully',
          icon: 'success'
        });
        this.toggleForgotPassword();
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'Failed to reset password',
          icon: 'error'
        });
      }
    });
  }
}
