import { Component } from '@angular/core';

@Component({
  selector: 'app-brand',
  template: `
    <img src="assets/brand/code4learn-mark.png" alt="" width="192" height="192">
    <span>Code<span class="accent">4</span>Learn</span>
  `,
  styleUrl: './brand.component.css'
})
export class BrandComponent {}
