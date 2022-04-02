import { Component, OnInit } from '@angular/core';
import { apiUrl } from 'src/app/app.constant';
import { CommonserviceService } from 'src/app/services/commonservice.service';
import { BlogpostService } from '../blogpost.service';
import { Blogpost } from '../blogpost';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blogpost-list',
  templateUrl: './blogpost-list.component.html',
  styleUrls: ['./blogpost-list.component.css']
})
export class BlogpostListComponent implements OnInit {

  title = 'Blogs';
  blogs: Blogpost;
  error: {};
  OrganizerID: any;
  constructor(
    private titleService: Title,
    private blogpostService: BlogpostService,
    private commonserviceService: CommonserviceService
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.title);

    // this.blogpostService.getBlogs().subscribe(
    //   (data: Blogpost) => this.blogs = data,
    //   error => this.error = error
    // );
    this.getOrganizerService();
    
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
        console.log('data', this.OrganizerID);
        this.blogs = data.listOfUpcomingEvents
      }, error => {
        console.error("Error!", error.error.message);
        // alert(error.error.message);
        this.error = error.error.message;
      });
  }
  buyNowFunc(ev){
    console.log(ev);
  }
}
