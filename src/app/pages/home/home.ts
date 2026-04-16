import { Component, inject, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, Product, Testimonial, HomeData } from '../../services/product';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
  productService = inject(ProductService);
  el = inject(ElementRef);
  cdr = inject(ChangeDetectorRef);
  
  featuredProducts: Product[] = [];
  testimonials: Testimonial[] = [];
  homeData: HomeData | null = null;
  
  private ctx!: gsap.Context;

  ngOnInit() {
    this.ctx = gsap.context(() => {}, this.el.nativeElement);

    this.productService.getHomeData().subscribe(data => {
      this.homeData = data;
      this.checkDataLoaded();
    });

    this.productService.getProducts().subscribe(products => {
      this.featuredProducts = products.slice(0, 3);
      this.checkDataLoaded();
    });

    this.productService.getTestimonials().subscribe(testimonials => {
      this.testimonials = testimonials;
      this.checkDataLoaded();
    });
  }

  // Ensure all data is ready before animating
  private loadedCount = 0;
  private checkDataLoaded() {
    this.loadedCount++;
    if (this.loadedCount === 3) {
      this.cdr.detectChanges(); // Force DOM update
      // Request animation frame ensures the browser has painted the elements from detectChanges
      requestAnimationFrame(() => {
        setTimeout(() => this.initAnimations(), 100);
      });
    }
  }

  initAnimations() {
    this.ctx.add(() => {
      // 1. Hero Animations - Enhanced
      const tl = gsap.timeline();
      
      tl.fromTo('.hero-badge', 
          { y: 30, opacity: 0, scale: 0.9 }, 
          { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.2)' })
        .fromTo('.hero-title-line > span', 
          { y: 60, opacity: 0, rotationX: -20 }, 
          { y: 0, opacity: 1, rotationX: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }, '-=0.5')
        .fromTo('.hero-desc', 
          { y: 30, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.5')
        .fromTo('.hero-buttons > *', 
          { y: 30, opacity: 0, scale: 0.95 }, 
          { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' }, '-=0.5')
        .fromTo('.hero-bg-image', 
          { scale: 1.1, opacity: 0, x: 50 }, 
          { scale: 1, opacity: 1, x: 0, duration: 1.5, ease: 'power3.out' }, 0)
        .fromTo('.hero-bg-image .absolute', // The floating card
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' }, '-=0.8');

      // 2. Features Reveal
      gsap.fromTo('.feature-card', 
        { y: 60, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.features-section',
            start: 'top 85%',
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out'
        });

      // 3. Featured Products Highlight
      gsap.fromTo('.product-card', 
        { y: 80, opacity: 0, scale: 0.95 },
        {
          scrollTrigger: {
            trigger: '.products-section',
            start: 'top 85%',
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out'
        });

      // 4. About Section Split Reveal
      gsap.fromTo('.about-image', 
        { x: -80, opacity: 0, scale: 0.95 },
        {
          scrollTrigger: {
            trigger: '.about-section',
            start: 'top 80%',
          },
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out'
        });
        
      gsap.fromTo('.about-content > *', 
        { x: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.about-section',
            start: 'top 80%',
          },
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out'
        });

      // 5. Stats Counters
      const statsElements = document.querySelectorAll('.stat-value');
      if (statsElements.length) {
        gsap.fromTo('.stat-item', 
          { scale: 0.5, opacity: 0, y: 30 },
          {
            scrollTrigger: {
              trigger: '.stats-section',
              start: 'top 90%',
            },
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(2)'
          });
        
        statsElements.forEach((el) => {
          const target = { val: 0 };
          const endValue = parseFloat(el.getAttribute('data-value') || '0');
          gsap.to(target, {
            val: endValue,
            duration: 2.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.stats-section',
              start: 'top 90%',
            },
            onUpdate: function() {
              el.innerHTML = Math.floor(target.val).toString();
            }
          });
        });
      }

      // 6. Testimonials Stagger
      gsap.fromTo('.testimonial-card', 
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.testimonials-section',
            start: 'top 85%',
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out'
        });
      
      // 7. CTA Parallax/Reveal
      gsap.fromTo('.cta-content', 
        { scale: 0.8, opacity: 0, y: 50 },
        {
          scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 85%',
          },
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'back.out(1.5)'
        });

      // Initial layout calculation fix
      setTimeout(() => ScrollTrigger.refresh(), 500);
    });
  }

  ngOnDestroy() {
    this.ctx?.revert();
  }

  getIconSvg(iconName: string): string {
    const icons: Record<string, string> = {
      'sparkles': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />',
      'shield': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />',
      'award': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />',
      'leaf': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />', // simplified
      'truck': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />', // simplified
      'heart': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />'
    };
    return icons[iconName] || icons['sparkles'];
  }
}
