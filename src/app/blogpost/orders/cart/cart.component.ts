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
export class CartComponent implements OnInit {
  cartData: any[];
  cartCountInfo: any[];
  checkoutpath: any;
  orderNrID: number;

  constructor(private dataService: DataService,
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
      this.orderNrFunc();
      

    }
  }

  emptyCart() {
    localStorage.removeItem('cartInfo');
    localStorage.removeItem('cartInfoCount');
    this.cartData = [];
    this.dataService.changeMessage([]);
    window.location.reload();
  }
  changeQty(pid: any, qty: any, replace: any, index: any) {
    const cntData = this.cartData
    const actPrice = this.cartData[index]['ItemTotalPrice'] / cntData[index]['Qnt'];
    if (qty !== '') {
      qty = parseInt(qty) || 1;

      if (qty === 1) {
        cntData[index]['ItemTotalPrice'] = cntData[index]['ItemTotalPrice'] + actPrice
        cntData[index]['Qnt']++
      } else {
        cntData[index]['ItemTotalPrice'] = cntData[index]['ItemTotalPrice'] - actPrice
        cntData[index]['Qnt']--
      }
      if (cntData[index]['ItemTotalPrice'] === 0) {
        cntData.splice(index, 1)
      }
    } else { }
    let gx: any;
    const tp = cntData.reduce((n, { ItemTotalPrice }) => n + ItemTotalPrice, 0)
    const tc = cntData.reduce((n, { Qnt }) => n + Qnt, 0)
    gx = [tp, tc];
    this.dataService.changeMessage(gx);

    localStorage.setItem('cartInfoCount', JSON.stringify(gx));
    localStorage.setItem('cartInfo', JSON.stringify(cntData));
  }
  orderNrFunc() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const organizeData = JSON.parse(localStorage.getItem('organizer'));
    if (currentUser !== null) {
      const payload = {
        Key: this.commonserviceService.authKey(),
        OrganizerID: organizeData.OrganizerID,
        CustomerID: currentUser.CustomerID,
      };
      this.commonserviceService.postservice(apiUrl.getOrderNr, payload)
        .subscribe(data => {
          this.orderNrID = data.OrderNr;
          this.getDiscountFunc();
        }, error => {
          // console.error("Error!", error.error.message);
          // // alert(error.error.message);
          // this.error = error.error.message;
        });
    }
  }
  getDiscountFunc() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const organizeData = JSON.parse(localStorage.getItem('organizer'));
    if (currentUser !== null) {
      const payload = {
        Key: this.commonserviceService.authKey(),
        OrganizerID: organizeData.OrganizerID,
        CustomerID: currentUser.CustomerID,
      };
      this.commonserviceService.postservice(apiUrl.getDiscounts, payload)
        .subscribe(data => {
          console.log('data', data)
           this.checkUrlFunc();
        }, error => {
          // console.error("Error!", error.error.message);
          // // alert(error.error.message);
          // this.error = error.error.message;
        });
    }
  }
  checkUrlFunc() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const organizeData = JSON.parse(localStorage.getItem('organizer'));
    const classSelectVal = JSON.parse(localStorage.getItem('classSelect'));
    console.log('xxx', this.orderNrID)
    if (currentUser !== null) {
      const payload = {
        Key: this.commonserviceService.authKey(),
        OrganizerID: organizeData.OrganizerID,
        CustomerID: currentUser.CustomerID,
        OrderNr: this.orderNrID,
        DiscountCode: 0,
        Credit: this.cartCountInfo[0],
      };
      this.commonserviceService.postservice(apiUrl.getCheckoutUrl, payload)
        .subscribe(data => {
          const spu = data.URL.split('?')
          const url = spu[0] + '?ONR=' + this.cartCountInfo[0];
          this.checkoutpath = data.URL;
        }, error => {
        });
    }
  }

  checkoutClick() {

    if (this.isLoggedIn === false) {
      this.router.navigateByUrl('login');
    }
  }
}
