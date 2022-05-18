import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';
import { BlogpostFeaturedComponent } from '../blogpost/blogpost-featured/blogpost-featured.component';
import { CommonserviceService } from '../services/commonservice.service';
import { DataService } from '../services/data.service';
import { apiUrl } from 'src/app/app.constant';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  textFromChild: any;
  organizerData: any;
  cartInfo: any;
  cartInfoCount: any[];
  constructor( private titleService: Title, 
    private authService: AuthService, 
    private data: DataService, 
    private commonserviceService: CommonserviceService,
    private router: Router) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(msg => this.textFromChild = msg);
    console.log('this.textFromChild', this.textFromChild)
    const getCart = localStorage.getItem('cartInfo');
    const getCartCnt = localStorage.getItem('cartInfoCount');
    this.cartInfo = JSON.parse(getCart);
    if(getCartCnt != null){
      this.cartInfoCount = JSON.parse(getCartCnt);
    } else{
      this.cartInfoCount = [0,0]
    }
    console.log('cartInfo', this.cartInfo)
    this.getOrganizerService();
  }

  get isLoggedIn() { return this.authService.isLoggedIn(); }

  setPageTitle(title: string) {
    this.titleService.setTitle(title);
  }

  getOrganizerService() {
    const payload = {
      Key: this.commonserviceService.authKey(),
    };
    this.commonserviceService.postservice(apiUrl.organizer, payload)
      .subscribe(data => {
        this.organizerData = data;
        localStorage.setItem('organizer', JSON.stringify(data));
      }, error => {
        // console.error("Error!", error.error.message);
        // alert(error.error.message);
        
      });
  }

  cartClick() {
    this.router.navigateByUrl('cart');
  }


}
