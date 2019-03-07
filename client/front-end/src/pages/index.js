import React, { Component } from 'react';
import Footer from '../components/footer/Footer';
import Navigation from '../components/nav/nav';

class index extends Component {
  render() {
    return (
      <div className="container">
      <Navigation/>

      <Footer/>
      </div>
    )
  }
}

export default index
