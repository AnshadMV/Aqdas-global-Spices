import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.html',
})
export class Products implements OnInit {
  productService = inject(ProductService);
  route = inject(ActivatedRoute);
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = ['All', 'Powder', 'Whole Spices', 'Masala'];
  activeCategory = 'All';
  isLoading = true;

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        
        // Render immediately, don't wait for queryParams microtask
        this.filterCategory(this.activeCategory);
        this.isLoading = false;
        
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
  }
}
