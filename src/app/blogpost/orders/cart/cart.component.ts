import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DataService } from 'src/app/services/data.service';
import { CommonserviceService } from 'src/app/services/commonservice.service';
import { AuthService } from '../../../auth/auth.service';
import { apiUrl } from 'src/app/app.constant';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
    cartData:any[];
    cartCountInfo: any[];
    checkoutpath: any;
 
  constructor( private dataService: DataService, 
    private router: Router,
    private commonserviceService: CommonserviceService,
    private authService: AuthService,) {
 
  }
  get isLoggedIn() { return this.authService.isLoggedIn(); }
  ngOnInit() {
    const getCart = localStorage.getItem('cartInfo');
    const getCartCounts = localStorage.getItem('cartInfoCount');
    this.cartData = JSON.parse(getCart);
    this.cartCountInfo = JSON.parse(getCartCounts);
    
    if (this.isLoggedIn === true) {
      this.checkUrlFunc();
    } 
  }
  
  emptyCart(){
    localStorage.removeItem('cartInfo');
    localStorage.removeItem('cartInfoCount');
    this.cartData = [];
  }
  changeQty(pid: any,qty: any,replace: any, index: any){
      const cntData = this.cartData
      const actPrice =  this.cartData[index]['ItemTotalPrice']/cntData[index]['Qnt'];
    if(qty !== ''){
      qty=parseInt(qty) || 1;
 
    if(qty===1){
        cntData[index]['ItemTotalPrice']=cntData[index]['ItemTotalPrice']+actPrice
        cntData[index]['Qnt']++
    }else{
        cntData[index]['ItemTotalPrice']=cntData[index]['ItemTotalPrice']-actPrice
        cntData[index]['Qnt']--
    }
      if(cntData[index]['ItemTotalPrice']===0){
        cntData.splice(index, 1)
      }
    }else{ }
    let gx: any;
    const tp = cntData.reduce((n, { ItemTotalPrice }) => n + ItemTotalPrice, 0)
      const tc = cntData.reduce((n, { Qnt }) => n + Qnt, 0)
      gx = [tp, tc];
    this.dataService.changeMessage(gx);

    localStorage.setItem('cartInfoCount', JSON.stringify(gx));
    localStorage.setItem('cartInfo', JSON.stringify(cntData));    
  }

  checkUrlFunc(){
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const organizeData = JSON.parse(localStorage.getItem('organizer'));
    const classSelectVal = JSON.parse(localStorage.getItem('classSelect'));
    if (currentUser !== null) {
    const payload = {
      Key: this.commonserviceService.authKey(),
      OrganizerID: organizeData.OrganizerID,
      CustomerID:currentUser.CustomerID,
      OrderNr:classSelectVal.classSelect,
      DiscountCode: '',
      Credit:this.cartCountInfo[0],
    };
    this.commonserviceService.postservice(apiUrl.getCheckoutUrl, payload)
      .subscribe(data => {
        this.checkoutpath = data.URL;
      }, error => {
      });
    }
  }

  checkoutClick(){
    
    if (this.isLoggedIn === false) {
      this.router.navigateByUrl('login');
    } 
  }
}
