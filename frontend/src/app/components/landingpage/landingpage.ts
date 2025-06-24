import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.html',
  styleUrls: ['./landingpage.css'],
  standalone: true,
  imports: [CommonModule], 
})
export class Landingpage implements OnInit {
  products = [
    {
      name: 'Wireless Earbuds',
      description: 'High quality sound and Bluetooth 5.0',
      price: '$49',
      image: 'https://source.unsplash.com/400x300/?earbuds',
    },
    {
      name: 'Smart Watch',
      description: 'Track fitness and receive notifications',
      price: '$89',
      image: 'https://source.unsplash.com/400x300/?watch',
    },
    {
      name: 'Running Shoes',
      description: 'Comfortable and durable for all terrains',
      price: '$69',
      image: 'https://source.unsplash.com/400x300/?shoes',
    },
    {
      name: 'Laptop Backpack',
      description: 'Stylish and waterproof for 15-inch laptops',
      price: '$39',
      image: 'https://source.unsplash.com/400x300/?backpack',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  isActiveRoute(path: string): boolean {
    return this.router.url === path;
  }
}
