import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
@Component({
  selector : 'menu',
  template : `
  <nav class="navbar navbar-expand-lg navbar-light bg-light d-print-none">
  <a class="navbar-brand" href="#" routerLink = '/products'><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROSGhNugPi-wkkvEePwHNppt8AaZRlUk-y9yEapagLNUaXxy_G" class="logo mr-2"/>Trend Shopping</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item active">
        <a class="nav-link" routerLink = '/products'>Products <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" routerLink = '/billing'>Billing</a>
      </li>
      <li class="nav-item">
        <a class="nav-link"  routerLink = '/checkout'>Checkout</a>
      </li>      
    </ul>
  </div>
   

        <div class="navbar navbar-dark bg-white shadow-sm">
		<div class="container d-flex justify-content-between"> 
      <span class="cart-count">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 19.25 19.25" style="enable-background:new 0 0 19.25 19.25;" xml:space="preserve" width="32px" height="32px">
          <g>
            <g id="Layer_1_107_">
              <g>
                <path d="M19.006,2.97c-0.191-0.219-0.466-0.345-0.756-0.345H4.431L4.236,1.461     C4.156,0.979,3.739,0.625,3.25,0.625H1c-0.553,0-1,0.447-1,1s0.447,1,1,1h1.403l1.86,11.164c0.008,0.045,0.031,0.082,0.045,0.124     c0.016,0.053,0.029,0.103,0.054,0.151c0.032,0.066,0.075,0.122,0.12,0.179c0.031,0.039,0.059,0.078,0.095,0.112     c0.058,0.054,0.125,0.092,0.193,0.13c0.038,0.021,0.071,0.049,0.112,0.065c0.116,0.047,0.238,0.075,0.367,0.075     c0.001,0,11.001,0,11.001,0c0.553,0,1-0.447,1-1s-0.447-1-1-1H6.097l-0.166-1H17.25c0.498,0,0.92-0.366,0.99-0.858l1-7     C19.281,3.479,19.195,3.188,19.006,2.97z M17.097,4.625l-0.285,2H13.25v-2H17.097z M12.25,4.625v2h-3v-2H12.25z M12.25,7.625v2     h-3v-2H12.25z M8.25,4.625v2h-3c-0.053,0-0.101,0.015-0.148,0.03l-0.338-2.03H8.25z M5.264,7.625H8.25v2H5.597L5.264,7.625z      M13.25,9.625v-2h3.418l-0.285,2H13.25z" fill="#FF0000"/>
                <circle cx="6.75" cy="17.125" r="1.5" fill="#FF0000"/>
                <circle cx="15.75" cy="17.125" r="1.5" fill="#FF0000"/>
              </g>
            </g>
          </g>
        </svg>
      <em>{{cart.cartItemsList.length}}</em></span>
		</div>
	</div>

         
</nav>

       
  `,

  styles:[`
    .logo{
      height: 60px;
      width: auto;
    }
    /* Add application styles & imports to this file! */
 
.cart-count {
  color: #FFF;
  position: relative;
}
.cart-count em {
  height: 24px;
  background-color: black;
  font-style: normal;
  padding: 0;
  border-radius: 50px;
  position: absolute;
  top: -5px;
  right: -14px;
  width: 24px;
  text-align: center;
  line-height: 24px;
  color: #FFF;
  font-weight: bold;
}

.cart-total {
  padding: 1em;
  margin: 0;
  display: flex;
  flex-flow: row;
  align-items: normal;
  justify-content: space-between;
}
    
  `]
})

export class MenuDir{
 

 constructor(
    public cart: CartService
  ){
    
  }

   ngOnInit() {
     
     
    
  }
}