import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  async submit(ev) {
    // User clicked submit
    let { token } = await this.props.stripe.createToken({ name: 'Name' });
    if (token) {
      let response = await fetch('http://acta.payment.dns-cloud.net/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId: token.id,
          amount: this.props.amount * 100
        })
      });
      console.log(response);
      if (response.ok) {
        console.log('Purchase Complete!');
        this.props.modelFn();
      }
    }
  }
  createOptions = (fontSize, padding) => {
    return {
      style: {
        base: {
          fontSize,
          color: '#424770',
          letterSpacing: '0.025em',
          fontFamily: 'Source Code Pro, monospace',
          '::placeholder': {
            color: '#aab7c4'
          },
          padding
        },
        invalid: {
          color: '#9e2146'
        }
      }
    };
  };
  render() {
    return (
      <div className="checkout">
        <Typography variant="h6" component="h6">
          Pay through Card -{this.props.amount}$
        </Typography>
        <br />
        <p>Would you like to complete the payment through card?</p>
        <br />
        <CardElement />
        <br />
        <br />
        <Button onClick={this.submit} color="primary">
          PAY
        </Button>
        <Button onClick={this.props.modelFn} color="primary">
          Close
        </Button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
