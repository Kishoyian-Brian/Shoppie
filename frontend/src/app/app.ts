import { Component } from '@angular/core';

import { LandingPage } from './components/landingpage/landingpage';
import { RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports:  [LandingPage, RouterOutlet],
  templateUrl: './app.html',
})
export class App {}
