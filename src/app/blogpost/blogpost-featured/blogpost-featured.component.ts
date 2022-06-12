import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlogpostService } from '../blogpost.service';
import { Blogpost } from '../blogpost';
import { apiUrl } from 'src/app/app.constant';
import { CommonserviceService } from 'src/app/services/commonservice.service';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { formatDate } from "@angular/common";

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
  totalPriceOth: any[];
  eventId: any;
  speedClassData: [];
  cartItems: any[] = [];
  classSelect: number;
  orderNrID: number;
  selectedItemData: [];
  selectedItemCart: any[] = [];
  loggedInCheck: boolean;
  daysArray: any[];
  isCheckedValue: boolean;
  checkboxes: any;
  updatedArray: any[] = [];
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
    this.checkboxes = 0;
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
    this.updatedArray = []
    console.log('ev', ev);
    const format = 'dd-MM-yyyy';
    const myDate = ev.EventDate;
    const locale = 'en-US';
    let formattedDate: any;
    // formattedDate = formatDate(myDate, format, locale);

    console.log('formattedDate', formattedDate)

    let date: any;
    let dateArr = []
    for (let index = 0; index < ev.EventDays; index++) {
      let i = (index + 1)
      date = new Date(new Date(ev.EventDate).getTime() + (i * 24 * 60 * 60 * 1000));
      formattedDate = formatDate(date, format, locale);
      let f = formattedDate.split('-');
      dateArr.push({ days: f[0] + '/' + f[1], date: formattedDate, selected: false });
    }

    console.log('endDate', dateArr)
    this.daysArray = dateArr;
    let daysBok = ev.Daysbooked.split(';');
    console.log('daysBok', daysBok)
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
      this.totalPriceOth = [ev.EventPrice]
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
    this.updatedArray.push({ cardPrice: ev.EventPrice, qty: '', attrPrice: '', allTotal: ev.EventPrice })
    console.log('fsss', this.updatedArray)
  }
  popupClose() {
    this.popupShowHide = false;
  }
  checkboxFunc(ev: any, data: any) {
    console.log('data', data)
    if (ev.currentTarget.checked === true) {
      this.isChecked = false;
      // this.totalPriceSum.push(data);
    }
    // if (ev.currentTarget.checked === false) {
    //   this.isChecked = false;
    //   for (let index = 0; index < this.totalPriceSum.length; index++) {
    //     const element = this.totalPriceSum[index];
    //     if (element.AttributID === ev.target.value) {
    //       this.totalPriceSum.splice(index, 1);
    //     }

    //   }
    // }
    // const f = this.totalPriceSum.reduce((n, { Price }) => n + Price, 0);
    // console.log('f', f)
    // let fg : any;
    // if (ev.currentTarget.checked === false) {
    //   fg = Number(this.totalPrice) - Number(data.Price);
    // } else{
    //   fg = Number(this.totalPrice) + Number(f);
    // }

    // this.totalPrice = fg;
    
    
    let cnt: any;
    if (ev.currentTarget.checked === false) {
      this.isChecked = false;
      cnt = 0;
    } else {
      cnt = 1;
    }
    const f = data.Price * cnt;
    // this.totalPrice += f;
    for (let index = 0; index < this.attributesData.length; index++) {
      if (!this.updatedArray.some(el => el.idx === data['AttributID'])) {
        this.updatedArray.push({ qty: cnt, attrPrice: data.Price, allTotal: f, idx: data['AttributID'] })
      }
    }
    this.updatedArray.forEach((element: any, index) => {
      if (element.idx === data['AttributID']) {
        this.updatedArray[index]['qty'] = cnt;
        this.updatedArray[index]['attrPrice'] = data.Price;
        this.updatedArray[index]['allTotal'] = f;
      }
    });
    const totalChild = this.updatedArray.reduce((accum, item) => accum + item.allTotal, 0);
    console.log('totalChild', this.updatedArray)
    this.totalPrice = totalChild;



  }
  checkboxDays(ev: any, data: any) {
    console.log('data', data)
    console.log('dd', ev.currentTarget.checked)
    // if (ev.currentTarget.checked === true) {
    //   this.isCheckedValue = false;
    // }
    if (ev.currentTarget.checked === true) {
      this.daysArray.forEach(element => {
        if (element.selected === true) {
          this.isCheckedValue = true;
        }

      });
    } else {
      this.daysArray.forEach(element => {
        if (element.selected === false) {
          this.isCheckedValue = false;
        }
      });
    }


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
  onChangeFunc(ev: any, data: any, inx:any) {
    console.log('ev', ev)
    if (ev.target.value < 0  ) {
      console.log('t', ev.target.value)
 
      document.getElementById("cntId"+inx).setAttribute('value','0');
      return false;
    }
    let cnt: any;
    if (ev.target.value === '') {
      cnt = 0;
    } else {
      cnt = ev.target.value;
    }
    const f = data.Price * cnt;
    // this.totalPrice += f;
    for (let index = 0; index < this.attributesData.length; index++) {
      if (!this.updatedArray.some(el => el.idx === data['AttributID'])) {
        this.updatedArray.push({ qty: ev.target.value, attrPrice: data.Price, allTotal: f, idx: data['AttributID'] })
      }
    }
    this.updatedArray.forEach((element: any, index) => {
      if (element.idx === data['AttributID']) {
        this.updatedArray[index]['qty'] = ev.target.value;
        this.updatedArray[index]['attrPrice'] = data.Price;
        this.updatedArray[index]['allTotal'] = f;
      }
    });
    const totalChild = this.updatedArray.reduce((accum, item) => accum + item.allTotal, 0);
    this.totalPrice = totalChild;
  }
  onChangeNew(ev: any, data: any) {
    console.log('ev==', ev.target.value)
    const f = data.Price * ev.target.value;
    console.log('f', this.totalPriceOth)
    const fg = Number(this.itemPrice) + Number(f);
    this.totalPrice = fg;
  }

  classItemClick(event: any) {
    this.classSelect = event.classID;
    this.getEventsService();
  }
  sendEventLogin() {
    this.router.navigate(['login']);
  }
}
