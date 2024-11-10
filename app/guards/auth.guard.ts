import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isHospitalLoggedIn = localStorage.getItem('isHospitalLoggedIn') === 'true';
    
    if (!isHospitalLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
    
    return true;
  }
} 