import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonserviceService } from 'src/app/services/commonservice.service';
import { AuthService } from '../auth.service';
import { apiUrl } from '../../app.constant';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  submitted = false;
  returnUrl: string;
  error: {errorTitle: '', errorDesc: ''};
  loginError: string;
  OrganizerID: any;
  addressInfo: [];
  emailCheckStatus: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private commonserviceService: CommonserviceService
    ) {
    }

  ngOnInit() {
    this.signupForm = this.fb.group({
      socialSecurityNumber: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      address: ['', Validators.required],
      zipcode: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      email: ['', Validators.required],
      ownTransponder: ['', Validators.required],
      gender: ['', Validators.required],
      bike: ['', Validators.required],
      cubic: ['', Validators.required],
      yearModell: ['', Validators.required],
      tireMake: ['', Validators.required],
      tireSize: ['', Validators.required],
    });
    this.getOrganizerService()
    this.getAddressFunc();
  }

  get socialSecurityNumber() { return this.signupForm.get('socialSecurityNumber'); }
  get firstname() { return this.signupForm.get('firstname'); }
  get lastname() { return this.signupForm.get('lastname'); }
  get address() { return this.signupForm.get('address'); }
  get city() { return this.signupForm.get('city'); }
  get country() { return this.signupForm.get('country'); }
  get email() { return this.signupForm.get('email'); }
  get ownTransponder() { return this.signupForm.get('ownTransponder'); }
  get gender() { return this.signupForm.get('gender'); }
  get bike() { return this.signupForm.get('bike'); }
  get zipcode() { return this.signupForm.get('zipcode'); }
  get cubic() { return this.signupForm.get('cubic'); }
  get yearModell() { return this.signupForm.get('yearModell'); }
  get tireMake() { return this.signupForm.get('tireMake'); }
  get tireSize() { return this.signupForm.get('tireSize'); }
 
  getAddressFunc(){
    const payload = {
      Key: this.commonserviceService.authKey(),
    };
    this.commonserviceService.postservice(apiUrl.getAddress, payload)
      .subscribe(data => {
        console.log('getdata====', data)
        this.addressInfo = data
      }, error => {
        console.error("Error!", error);
        alert(error);
      });
  }
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
    console.log('for==', this.signupForm.value);
    this.submitted = true;
    const payload = {
      Key: this.commonserviceService.authKey(),
      OrganizerID: this.OrganizerID,
      SocialSecurityNumber: this.socialSecurityNumber.value,
      Firstname: this.firstname.value,
      Lastname: this.lastname.value,
      address: this.address.value,
      Zipcode: this.zipcode.value,
      City: this.city.value,
      Country: this.country.value,
      Email: this.email.value,
      OwnTransponder: this.ownTransponder.value,
      Gender: this.gender.value,
      Bike: this.bike.value,
      Cubic: this.cubic.value,
      yearModell: this.yearModell.value,
      tireMake: this.tireMake.value,
      tireSize: this.tireSize.value,
    };
    this.commonserviceService.postservice(apiUrl.createAccount, payload)
      .subscribe(data => {
        console.log('data====', data)
 
      }, error => {
        console.error("Error!", error);
        this.error = error
        alert(error);
      });
    
  }
  emailCheck(){
    const payload = {
      Key: this.commonserviceService.authKey(),
      OrganizerID: this.OrganizerID,
      Email: this.email.value,
    }
    this.commonserviceService.postservice(apiUrl.checkEmail, payload)
      .subscribe(data => {
        console.log('data====', data)
        this.emailCheckStatus = data;
      }, error => {
        console.error("Error!", error);
        this.error = error
        alert(error);
      });
  }
  
}
