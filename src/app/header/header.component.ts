import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';
import { BlogpostFeaturedComponent } from '../blogpost/blogpost-featured/blogpost-featured.component';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  textFromChild: any;

  constructor( private titleService: Title, private authService: AuthService, private data: DataService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(msg => this.textFromChild = msg)
  }

  get isLoggedIn() { return this.authService.isLoggedIn(); }

  setPageTitle(title: string) {
    this.titleService.setTitle(title);
  }


}
