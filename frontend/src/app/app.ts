import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Landingpage } from './components/landingpage/landingpage';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Landingpage, RouterModule],
  templateUrl: './app.html',
})
export class App {}
