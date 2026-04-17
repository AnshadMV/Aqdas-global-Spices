import { Component, inject, OnInit, AfterViewInit, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
import { ProductService, Product } from '../../services/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products.html',
})
export class Products implements OnInit, AfterViewInit {
  productService = inject(ProductService);
  route = inject(ActivatedRoute);
  platformId = inject(PLATFORM_ID);
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = ['All', 'Powder', 'Whole Spices', 'Masala'];
  activeCategory = 'All';
  isLoading = true;
  cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        
        // Render immediately, don't wait for queryParams microtask
        this.filterCategory(this.activeCategory);
        this.isLoading = false;
        this.cdr.detectChanges();
        
        // Listen to query params for category filtering
        this.route.queryParams.subscribe(params => {
          const category = params['category'];
          if (category && this.categories.includes(category)) {
            this.filterCategory(category);
          } else {
            this.filterCategory('All');
          }
        });
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterCategory(category: string) {
    this.activeCategory = category;
    if (category === 'All') {
      this.filteredProducts = this.allProducts;
    } else {
      this.filteredProducts = this.allProducts.filter(p => p.category === category);
    }
    this.cdr.detectChanges();
    this.reinitAnimations();
  }

  ngAfterViewInit() {
    this.initAnimations();
  }

  reinitAnimations() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        ScrollTrigger.refresh();
        this.initAnimations();
      }, 50);
    }
  }

  initAnimations() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Reset previous triggers for products
    ScrollTrigger.getAll().forEach(st => st.kill());

    // Fade in title and subtitle
    gsap.fromTo('.products-header',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
    );

    // Filter buttons animation
    gsap.fromTo('.filter-btn',
      { opacity: 0, scale: 0.95, y: 10 },
      { opacity: 1, scale: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'back.out(1.2)', delay: 0.1 }
    );

    // Products grid sequence
    gsap.fromTo('.product-card',
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.4, 
        stagger: 0.05, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.products-grid',
          start: 'top 85%',
        }
      }
    );
  }
}
