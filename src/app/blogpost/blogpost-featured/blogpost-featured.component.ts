import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlogpostService } from '../blogpost.service';
import { Blogpost } from '../blogpost';
import { apiUrl } from 'src/app/app.constant';
import { CommonserviceService } from 'src/app/services/commonservice.service';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-blogpost-featured',
  templateUrl: './blogpost-featured.component.html',
  styleUrls: ['./blogpost-featured.component.css']
})
export class BlogpostFeaturedComponent implements OnInit {
  blogs: Blogpost;
  error: {};
  OrganizerID: any;
  popupShowHide: boolean;
  configPopup: boolean;
  speedClassPopup: boolean;
  attributesData: [];
  isChecked: boolean;
  totalPriceSum: any[] = [];
  itemPrice: any;
  totalPrice: any;
  eventId: any;
  speedClassData: [];
  cartItems: any[] = [];
  classSelect: number;
  orderNrID: number;
  selectedItemData: [];
  selectedItemCart: any[] = [];
  loggedInCheck: boolean;
  constructor(
    private blogpostService: BlogpostService,
    private commonserviceService: CommonserviceService,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    public cart: CartService
  ) {
    this.popupShowHide = false;
    this.configPopup = false;
    this.speedClassPopup = false;
    this.classSelect = 1;
    this.loggedInCheck = true;
    this.isChecked = false;
    localStorage.setItem('classSelect', JSON.stringify(this.classSelect));
  }
  @Input("allProductList") blogss: any = {};


  @Output() refresh: EventEmitter<string> = new EventEmitter();
  ngOnInit() {
    // this.blogpostService.getFeaturedBlogs().subscribe(
    //   (data: Blogpost) => this.blogs = data,
    //   error => this.error = error
    // );
    this.getOrganizerService();
    this.speedClassFunc();
    this.orderNrFunc();
  }
  get isLoggedIn() { return this.authService.isLoggedIn(); }
  getOrganizerService() {
    const payload = {
      Key: this.commonserviceService.authKey(),
    };
    this.commonserviceService.postservice(apiUrl.organizer, payload)
      .subscribe(data => {
        console.log('data', data.OrganizerID)
        this.OrganizerID = data.OrganizerID;
        this.getEventsService();
      }, error => {
        // console.error("Error!", error.error.message);
        // alert(error.error.message);

      });
  }

  getEventsService() {
    const payload = {
      Key: this.commonserviceService.authKey(),
      OrganizerID: this.OrganizerID,
      SpeedClass: this.classSelect
    };
    this.commonserviceService.postservice(apiUrl.upcomingevents, payload)
      .subscribe(data => {
        this.blogs = data.listOfUpcomingEvents
      }, error => {
        // console.error("Error!", error.error.message);
        // // alert(error.error.message);
        // this.error = error.error.message;
      });
  }
  buyNowFunc(ev: any) {
    console.log('ev', ev);
    this.totalPrice = 0;
    if (ev.fullyBooked !== true) {
      this.cartItems.push(ev);
      const payload = {
        Key: this.commonserviceService.authKey(),
        OrganizerID: this.OrganizerID,
        EventID: ev.EventID,
      };
      this.eventId = ev.EventID;
      this.totalPrice = ev.EventPrice;
      this.itemPrice = ev.EventPrice;
      this.attributesData = []
      this.commonserviceService.postservice(apiUrl.attributs, payload)
        .subscribe(data => {
          this.popupShowHide = true;
          this.configPopup = true;
          if (data.ListAttributs.length > 0) {
            this.attributesData = data.ListAttributs;
          }
        }, error => {
        });
    }
    this.selectedItemData = ev;
  }
  popupClose() {
    this.popupShowHide = false;
  }
  checkboxFunc(ev: any, data: any) {
    console.log('data', data)
    if (ev.currentTarget.checked === true) {
      this.isChecked = false;
      this.totalPriceSum.push(data);
    }
    if (ev.currentTarget.checked === false) {
      this.isChecked = false;
      for (let index = 0; index < this.totalPriceSum.length; index++) {
        const element = this.totalPriceSum[index];
        if (element.AttributID === ev.target.value) {
          this.totalPriceSum.splice(index, 1);
        }

      }
    }
    const f = this.totalPriceSum.reduce((n, { Price }) => n + Price, 0)
    const fg = Number(this.itemPrice) + Number(f);
    this.totalPrice = fg;


  }
  sendEventFunc() {
    // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // if (currentUser !== null) {
    // this.configPopup = false;
    // this.speedClassPopup = true;
    // const payload = {
    //   Key: this.commonserviceService.authKey(),
    //   OrganizerID: this.OrganizerID,
    //   CustomerID:currentUser.CustomerID,
    //   OrderNr:this.orderNrID,
    //   EventID:this.selectedItemData.EventID,
    //   EventDays:this.selectedItemData.EventDays,
    //   EventPrice:this.totalPrice,
    //   ClassID: this.classSelect,
    // };
    // this.commonserviceService.postservice(apiUrl.sendEvent, payload)
    //   .subscribe(data => {
    //     console.log('send', data)

    //   }, error => {
    //   });
    // }


    if (!this.selectedItemCart.some(el => el.EventID === this.selectedItemData['EventID'])) {
      this.selectedItemCart.push({ EventID: this.selectedItemData['EventID'], Qnt: 1, ItemTotalPrice: this.totalPrice, EventName: this.selectedItemData['EventName'] });
    } else {
      const vb = this.selectedItemCart.filter(el => el.EventID === this.selectedItemData['EventID'])
      vb[0]['Qnt'] = vb[0]['Qnt'] + 1;
      vb[0]['ItemTotalPrice'] = vb[0]['ItemTotalPrice'] + this.totalPrice;
    }
    this.popupShowHide = false;


    const getCart = localStorage.getItem('cartInfo');
    const getCartCnt = localStorage.getItem('cartInfoCount');
    const getCtData = JSON.parse(getCart);
    const getCt = JSON.parse(getCartCnt);
    let gx: any;
    let sendData: any[];


    if (getCartCnt === null) {
      const tp = this.selectedItemCart.reduce((n, { ItemTotalPrice }) => n + ItemTotalPrice, 0)
      const tc = this.selectedItemCart.reduce((n, { Qnt }) => n + Qnt, 0)
      gx = [tp, tc];
      sendData = this.selectedItemCart
    } else {
      gx = [this.selectedItemData['EventPrice'] + getCt[0], +getCt[1] + 1];

      if (!getCtData.some(el => el.EventID === this.selectedItemData['EventID'])) {
        // this.selectedItemCart.push({EventID: this.selectedItemData['EventID'], Qnt:1, ItemTotalPrice: this.totalPrice, EventName:this.selectedItemData['EventName'] });
        const gr = { EventID: this.selectedItemData['EventID'], Qnt: 1, ItemTotalPrice: this.selectedItemData['EventPrice'], EventName: this.selectedItemData['EventName'] }
        sendData = [...getCtData, ...[gr]];

      } else {
        const vb = getCtData.filter(el => el.EventID === this.selectedItemData['EventID'])

        vb[0]['Qnt'] = vb[0]['Qnt'] + 1;
        vb[0]['ItemTotalPrice'] = vb[0]['ItemTotalPrice'] + this.totalPrice;
        sendData = getCtData

      }
    }

    this.dataService.changeMessage(gx);

    localStorage.setItem('cartInfoCount', JSON.stringify(gx));
    localStorage.setItem('cartInfo', JSON.stringify(sendData));
  }
  hamburgerMenu() {
    const payload = {
      Key: this.commonserviceService.authKey(),
      OrganizerID: this.OrganizerID,
      EventID: this.eventId,
    };
    this.commonserviceService.postservice(apiUrl.meny, payload)
      .subscribe(data => {
        console.log('data', data);

      }, error => {
        // console.error("Error!", error.error.message);
        // // alert(error.error.message);
        // this.error = error.error.message;
      });
  }
  orderNrFunc() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser !== null) {
      const payload = {
        Key: this.commonserviceService.authKey(),
        OrganizerID: this.OrganizerID,
        CustomerID: currentUser.CustomerID,
      };
      this.commonserviceService.postservice(apiUrl.getOrderNr, payload)
        .subscribe(data => {
          this.orderNrID = data.OrderNr;
        }, error => {
          // console.error("Error!", error.error.message);
          // // alert(error.error.message);
          // this.error = error.error.message;
        });
    }
  }
  speedClassFunc() {
    const payload = {
      Key: this.commonserviceService.authKey(),
      OrganizerID: this.OrganizerID,
    };
    this.commonserviceService.postservice(apiUrl.speedclasses, payload)
      .subscribe(data => {
        this.speedClassData = data.ListSpeedClasses;
      }, error => {
      });
  }

  classItemClick(event: any) {
    this.classSelect = event.classID;
    this.getEventsService();
  }
  sendEventLogin() {
    this.router.navigate(['login']);
  }
}
