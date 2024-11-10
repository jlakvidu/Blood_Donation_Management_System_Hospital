import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospital-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './hospital-sign-up.component.html',
  styleUrl: './hospital-sign-up.component.css'
})
export class HospitalSignUpComponent implements OnInit {
  signupForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  private apiUrl = 'http://localhost:8080/hospital/add-hospital';
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isScrolled = false;

  districts: string[] = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale',
    'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Jaffna',
    'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya', 'Trincomalee',
    'Batticaloa', 'Ampara', 'Kurunegala', 'Puttalam', 'Anuradhapura',
    'Polonnaruwa', 'Badulla', 'Moneragala', 'Ratnapura', 'Kegalle'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      type: ['', Validators.required],
      address: ['', Validators.required],
      district: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      bloodBankLicenseNumber: ['', Validators.required],
      bloodBankCapacity: ['', [Validators.required, Validators.min(0)]],
      operatingDaysAndHours: ['', Validators.required],
      specialInstructions: [''],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.signupForm.get(fieldName);
    if (control?.errors) {
      if (control.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['pattern']) {
        if (fieldName === 'contactNumber') {
          return 'Please enter a valid 10-digit phone number';
        }
        if (fieldName === 'password') {
          return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        }
      }
      if (control.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  isFormValid(): boolean {
    const isValid = this.signupForm.valid &&
      this.signupForm.get('password')?.value === this.signupForm.get('confirmPassword')?.value;

    console.log('Form Valid:', this.signupForm.valid);
    console.log('Password Match:', this.signupForm.get('password')?.value === this.signupForm.get('confirmPassword')?.value);
    console.log('Form Errors:', this.signupForm.errors);
    console.log('Form Values:', this.signupForm.value);

    return isValid;
  }

  isAllFieldsFilled(): boolean {
    const controls = this.signupForm.controls;
    for (const controlName in controls) {
      const control = controls[controlName];
      if (control.errors?.['required'] || control.value === '') {
        return false;
      }
    }
    return true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (!this.isAllFieldsFilled()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields',
      });
      return;
    }

    if (this.signupForm.valid) {
      this.isLoading = true;

      const formData = new FormData();

      const formValues = this.signupForm.value;
      Object.keys(formValues).forEach(key => {
        if (key !== 'confirmPassword') {
          formData.append(key, formValues[key]);
        }
      });

      if (this.selectedFile) {
        formData.append('profileImage', this.selectedFile);
      }

      this.http.post(this.apiUrl, formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful!',
            text: 'Please sign in to continue',
            confirmButtonColor: '#3085d6',
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((result) => {
            this.router.navigate(['/login']);
          });
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 409) {
            Swal.fire({
              icon: 'error',
              title: 'Registration Failed',
              text: 'Email address is already registered. Please use a different email.',
            });
          } else if (error.status === 400) {
            Swal.fire({
              icon: 'error',
              title: 'Invalid Data',
              text: 'Please check your inputs and try again.',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Registration Failed',
              text: 'An error occurred. Please try again later.',
            });
          }
        }
      });
    } else {
      let errorMessage = '';
      Object.keys(this.signupForm.controls).forEach(key => {
        const control = this.signupForm.get(key);
        if (control?.invalid) {
          errorMessage += `${this.getErrorMessage(key)}\n`;
        }
      });

      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: errorMessage || 'Please fix the validation errors',
      });
    }
  }

  navigateToSignIn(event: Event) {
    event.preventDefault();
    Swal.fire({
      title: 'Redirecting...',
      text: 'Taking you to the sign in page',
      icon: 'info',
      timer: 1000,
      showConfirmButton: false,
      willClose: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }
}
