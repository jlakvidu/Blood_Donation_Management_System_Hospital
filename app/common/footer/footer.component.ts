import { Component, OnInit, HostListener, Renderer2, ElementRef } from '@angular/core';
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
  isMobileKeyboardOpen = false;
  private excludedRoutes = ['/login', '/donor-form', '/signin', '/donor-registration'];
  
  constructor(
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkRoute();
    });
  }

  ngOnInit() {
    this.checkRoute();
    
    if (this.isMobileDevice()) {
      this.onResize(null);
    }
  }

  private checkRoute() {
    const currentUrl = this.router.url;
    this.showFooter = !this.excludedRoutes.some(route => currentUrl.includes(route));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const windowHeight = window.innerHeight;
    const screenHeight = window.screen.height;
    this.isMobileKeyboardOpen = windowHeight < screenHeight * 0.75;
    
    if (this.isMobileKeyboardOpen) {
      this.renderer.setStyle(this.el.nativeElement.querySelector('.footer'), 'display', 'none');
    } else {
      if (this.showFooter) {
        this.renderer.setStyle(this.el.nativeElement.querySelector('.footer'), 'display', 'block');
      }
    }
  }

  isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
}
