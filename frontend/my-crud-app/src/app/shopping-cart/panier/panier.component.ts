// panier.component.ts

import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EcommService } from '../ecomm.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {

  constructor(private ecommService: EcommService) { }

  @Input() productAdded: any;

  total = 0;

  addTotal(prix: number, qte: number) {
    this.total += prix * qte;
  }
  
  @Output() onOrderFinished = new EventEmitter();

  paymentHandler: any = null;

  stripeAPIKey: string = 'pk_test_51O3PYjIcpnrfUv1SHiKt4MoFz4i02SbWnD17XsdF91dbKwGfAgE8ZdS25s15B97J8mylDCkdDmNjerwGEjMavcDm00tY0WPECA';

  ngOnInit() {
    this.invokeStripe();
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: this.stripeAPIKey,
          locale: 'auto',
          token: (stripeToken: any) => {
            console.log(stripeToken);
            alert('Payment has been successful!');
            // signal to the ecommerce component that the order is complete
            this.onOrderFinished.emit(false);
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }

  @ViewChild('htmlData') htmlData!: ElementRef;

  openPDF() {
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 100;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 20;
      PDF.addImage(FILEURI, 'PNG', 50, position, fileWidth, fileHeight);
      PDF.save('cart.pdf');
    });
  }

  checkoutProduct() {
    this.makePayment();
  }

  makePayment() {
    let amount = this.total;
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: this.stripeAPIKey,
      locale: 'auto',
      token: (stripeToken: string) => {
        this.processPayment(amount, stripeToken);
      },
    });
    paymentHandler.open({
      name: 'ItSolutionStuff.com',
      description: '3 widgets',
      amount: amount * 100,
    });
  }

  processPayment(amount: number, stripeToken: string) {
    console.log(stripeToken);
    const data = {
      amount: amount * 100,
      token: stripeToken
    }
    this.ecommService.sendPayment(data)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          alert("Operation successfully done");
          // print
          this.openPDF();
          // signal to the ecommerce component that the order is complete
          this.onOrderFinished.emit(false);
          // reset total to 0
          this.total = 0;
        },
        error: (e) => {
          console.log(e);
          alert("Error: Operation not done");
        },
      });
  }
}
