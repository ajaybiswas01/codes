import { Component, OnInit } from '@angular/core';
import { apiUrl } from 'src/app/app.constant';
import { CommonserviceService } from 'src/app/services/commonservice.service';
import { BlogpostService } from '../blogpost.service';
import { Category } from '../category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categories: Category;
  error: {};
  OrganizerID: any;
  constructor(private blogpostService: BlogpostService,
     private commonserviceService: CommonserviceService) { }

  ngOnInit() {
    // this.blogpostService.getCategories().subscribe(
    //   (data: Category) => this.categories = data
    // );
    this.getOrganizerService();
    this.getEventsService();
  }

  getOrganizerService() {
    const payload = {
      Key: this.commonserviceService.authKey(),
    };
    this.commonserviceService.postservice(apiUrl.organizer, payload)
      .subscribe(data => {
        console.log('data', data)
        this.OrganizerID = data.OrganizerID; 
      }, error => {
        console.error("Error!", error.error.message);
        alert(error.error.message);
      });
  }

  getEventsService() {
    const payload = {
      Key: this.commonserviceService.authKey(),
      OrganizerID: this.OrganizerID
    };
    this.commonserviceService.postservice(apiUrl.upcomingevents, payload)
      .subscribe(data => {
        console.log('data', data);
        this.categories = data
      }, error => {
        console.error("Error!", error.error.message);
        alert(error.error.message);
      });
  }

}
