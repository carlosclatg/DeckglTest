import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

export default class MovieItem extends React.Component {

    componentDidMount() {
      console.log(ReactDOM.findDOMNode(this))
    }

    handleNvEnter = (event) => {
      console.log("Nv Enter:", event);
    };

    sendEvent = () => {
        const event = new CustomEvent("nv-enter",  { bubbles: true, detail: new Date() });
        this.nv.dispatchEvent(event)
    }
    
  
    render() {
      return (
        <div ref={elem => this.nv = elem} >
          <button onClick={this.sendEvent}>SEND EVENT TO OUT COMPONENT</button>
        </div>
      );
    }
  
  }