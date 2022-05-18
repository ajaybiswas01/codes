import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonserviceService } from 'src/app/services/commonservice.service';
import { AuthService } from '../auth.service';
import { apiUrl } from '../../app.constant';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  error: {errorTitle: '', errorDesc: ''};
  loginError: string;
  OrganizerID: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private commonserviceService: CommonserviceService
    ) {
    }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      zipcode: ['', Validators.required]
    });

    this.authService.logout();
    this.getOrganizerService()
  }
  get isLoggedIn() { return this.authService.isLoggedIn(); }

  get email() { return this.loginForm.get('email'); }
  get zipcode() { return this.loginForm.get('zipcode'); }
  getOrganizerService() {
    const payload = {
      Key: this.commonserviceService.authKey(),
    };
    this.commonserviceService.postservice(apiUrl.organizer, payload)
      .subscribe(data => {
        console.log('data====', data)
        this.OrganizerID = data.OrganizerID; 
      }, error => {
        console.error("Error!", error);
        alert(error);
      });
  }
  onSubmit() {
    this.submitted = true;
    this.authService.login(this.email.value, this.zipcode.value, this.OrganizerID).subscribe(data => {
      
      // if(this.isLoggedIn === false){
      //   this.router.navigateByUrl('register');
      // }
      console.log('isLoggedIn', this.isLoggedIn);
       if (this.authService.isLoggedIn) {
        console.log('dd', data);
        let pagePath: any;
        const getCart = localStorage.getItem('cartInfo');
        if(getCart !== null && this.isLoggedIn === true){
          pagePath = 'cart';
        } else if(this.isLoggedIn === false){
          pagePath = 'register';
        }else{
          pagePath = '/';
        }
          const redirect = this.authService.redirectUrl ? this.authService.redirectUrl : pagePath;
          this.router.navigate([redirect]);
        } else {
          this.loginError = 'Username or password is incorrect.';
        }
      },
      error => this.error = error
    );
  }
}
