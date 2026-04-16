import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
}

export interface Testimonial {
  name: string;
  role?: string;
  message: string;
  rating: number;
}

export interface HomeData {
  hero: {
    badge: string;
    headline: string[];
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
  about: {
    badge: string;
    title: string;
    description: string;
    highlights: string[];
    image: string;
  };
  stats: {
    value: number;
    suffix: string;
    label: string;
  }[];
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/assets/data/products.json');
  }

  getTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>('/assets/data/testimonials.json');
  }

  getHomeData(): Observable<HomeData> {
    return this.http.get<HomeData>('/assets/data/homepage.json');
  }
}
