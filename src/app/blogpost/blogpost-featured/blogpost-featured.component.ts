import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlogpostService } from '../blogpost.service';
import { Blogpost } from '../blogpost';
import { apiUrl } from 'src/app/app.constant';
import { CommonserviceService } from 'src/app/services/commonservice.service';
import { DataService } from 'src/app/services/data.service';

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
  isChecked: any;
  totalPriceSum: any[] = [];
  itemPrice: any;
  totalPrice: any;
  eventId: any;
  speedClassData: [];
  cartItems: any[] = [];
  classSelect: number;
  orderNrID: number;
  selectedItemData:any;
  constructor(
    private blogpostService: BlogpostService,
    private commonserviceService: CommonserviceService,
    private dataService: DataService
  ) {
    this.popupShowHide = false;
    this.configPopup = false;
    this.speedClassPopup = false;
    this.classSelect = 1;
  }

  ngOnInit() {
    // this.blogpostService.getFeaturedBlogs().subscribe(
    //   (data: Blogpost) => this.blogs = data,
    //   error => this.error = error
    // );
    this.getOrganizerService();
    this.speedClassFunc();
    this.orderNrFunc();
  }

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
    this.selectedItemData = ev;
    if (ev.fullyBooked !== true) {
      this.cartItems.push(ev);    
      const payload = {
        Key: this.commonserviceService.authKey(),
        OrganizerID: this.OrganizerID,
        EventID: ev.EventID,
      };
      this.eventId = ev.EventID;
      this.totalPrice =  ev.EventPrice;
      this.itemPrice = ev.EventPrice;
      this.commonserviceService.postservice(apiUrl.attributs, payload)
        .subscribe(data => {
          this.popupShowHide = true;
          this.configPopup = true;
          if(data.ListAttributs.length > 0){
            this.attributesData = data.ListAttributs;
          }
        }, error => {
        });
    }
  }
  popupClose(){
    this.popupShowHide = false;
  }
  checkboxFunc(ev: any, data: any){
    if(ev.currentTarget.checked === true){
      this.totalPriceSum.push(data);
    }
    if(ev.currentTarget.checked === false){
      for (let index = 0; index < this.totalPriceSum.length; index++) {
        const element = this.totalPriceSum[index];
        if (element.AttributID === ev.target.value) {
          this.totalPriceSum.splice(index, 1);
        }
        
      }
    }
    const f = this.totalPriceSum.reduce((n, {Price}) => n + Price, 0)
    const fg = Number(this.itemPrice) + Number(f);
    this.totalPrice = fg;

    this.dataService.changeMessage(this.totalPrice);
  }
  hamburgerMenu(){
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
  orderNrFunc(){
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
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
  speedClassFunc(){
    const payload = {
      Key: this.commonserviceService.authKey(),
      OrganizerID: this.OrganizerID,
    };
    this.commonserviceService.postservice(apiUrl.speedclasses, payload)
      .subscribe(data => {
        this.speedClassData=  data.ListSpeedClasses;
      }, error => {
      });
  }
  sendEventFunc(){
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.configPopup = false;
    this.speedClassPopup = true;
    const payload = {
      Key: this.commonserviceService.authKey(),
      OrganizerID: this.OrganizerID,
      CustomerID:currentUser.CustomerID,
      OrderNr:this.orderNrID,
      EventID:this.selectedItemData.EventID,
      EventDays:this.selectedItemData.EventDays,
      EventPrice:this.totalPrice,
      ClassID: this.classSelect,
    };
    this.commonserviceService.postservice(apiUrl.sendEvent, payload)
      .subscribe(data => {
        console.log('send', data)
        
      }, error => {
      });
  }
  classItemClick(event:any){
    this.classSelect = event.classID;
    this.getEventsService();
  }
}