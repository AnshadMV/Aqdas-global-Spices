import { Component, inject, OnInit, PLATFORM_ID, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ProductService, Product } from '../../services/product';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit, AfterViewInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  productService = inject(ProductService);
  title = inject(Title);
  meta = inject(Meta);
  platformId = inject(PLATFORM_ID);
  cdr = inject(ChangeDetectorRef);
  
  product: Product | undefined;
  isLoading = true;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        const id = parseInt(idStr, 10);
        this.isLoading = true;
        this.productService.getProductById(id).subscribe({
          next: (prod) => {
            if (prod) {
              this.product = prod;
              this.isLoading = false;
              this.cdr.detectChanges();
              this.title.setTitle(`${prod.name} | Premium Spices`);
              this.meta.updateTag({ name: 'description', content: prod.description });
              if (isPlatformBrowser(this.platformId)) {
                setTimeout(() => this.initAnimations(), 50);
              }
            } else {
              this.router.navigate(['/products']);
            }
          },
          error: () => {
             this.isLoading = false;
             this.cdr.detectChanges();
             this.router.navigate(['/products']);
          }
        });
      }
    });
  }

  ngAfterViewInit() {
  }

  initAnimations() {
    if (!isPlatformBrowser(this.platformId)) return;

    const tl = gsap.timeline();
    
    tl.fromTo('.pdp-image-container', 
      { opacity: 0, scale: 0.98 }, 
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' })
      .fromTo('.pdp-badge',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '-=0.3')
      .fromTo('.pdp-title',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '-=0.2')
      .fromTo('.pdp-price',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '-=0.2')
      .fromTo('.pdp-desc',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '-=0.2')
      .fromTo('.pdp-features > div',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }, '-=0.2')
      .fromTo('.pdp-action',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' }, '-=0.1');
  }
}
