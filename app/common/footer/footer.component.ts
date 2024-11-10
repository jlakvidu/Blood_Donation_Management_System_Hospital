import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  showFooter = true;
  
  constructor(private router: Router) {
    // Subscribe to router events to check current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Hide footer on login and signup pages
      this.showFooter = !['/login', '/hospital-sign-up'].includes(event.url);
    });
  }

  ngOnInit() {
    // Check initial route
    this.showFooter = !['/login', '/hospital-sign-up'].includes(this.router.url);
  }
}
