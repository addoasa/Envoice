import React, { Component } from 'react';
import Stopwatch from './Main/Stopwatch'
import InvoiceForm from './Main/InvoiceForm'
import RateForm from './Main/RateForm'
import { Button } from 'reactstrap';
import Moment from 'moment'
import MainInvoice from './userpg/MainInvoice'
import ListContainer from './userpg/ListContainer'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import User from './User';



import Axios from 'axios'
import logo from './logo.svg';
import './App.css';



class App extends Component {
  constructor(){
    super()
    this.state = {
      isLoaded:false,
      time:'00:00',
      root: 'pending',
      button1:'',
      invoices: 'pending',
      button1:'', 
      timerSet: false
    }
  }
  


  setTime = ()=> {
    const elapsedTime = Moment.duration((Moment().diff(this.state.timeStart)))
    // console.log('running time set: ');
    this.setState({
      time: Moment(),
      elapsedTime: elapsedTime
    })
    // console.log(this.state.time)
  }

  setTimeStart = ()=>{
    const timeStart  = Moment()
    // let elapsedTime = Moment.duration(Moment().diff(startTime))
    // elapsedTime.asSeconds()
    // console.log(elapsedTime);
    // console.log(elapsedTime.asSeconds());
    this.setState({
       timeStart: timeStart,
       timerSet:true
    })
  }

  stopTime = ()=>{
    this.setState({
      finalTime:this.state.timerSet,
      timeStart:0,
      timerSet:false
    })
  }
  resetTime = ()=>{
    this.setState({
      finalTime:0,
      timeStart:0,
      timerSet:false
    })
  }

  componentDidMount =  async ()=>{
    console.log('running')
    const response = await Axios.get('/main')
    setInterval(this.setTime, 500)
    const invoices = await Axios.get('/records')
    console.log(invoices);
    setInterval(this.setTime, 1000)    

    this.setState({
      root:response.data.message,
      invoices: invoices.data.records[0].title, 
      isLoaded:true
    })
  }

  handleChange = (event)=>{
    const {name, value} = event.target
    this.setState({[name]: value})
  }

  handleClick = (event)=>{
    const {name, value} = event.target
    this.setState({[name]:value})
  }

  sendData = (event)=>{
    event.preventDefault()
    const formData = {
      // timeElapsed:
      service: this.state.form1,
      rate: this.state.form2,
      // comment:
    }

    alert(`${formData.service} - ${formData.rate}` )
    }

  render() {
    return (
      
      <div className="App">

        <header className="App-header">
          <div>
          <Stopwatch
            time={this.state.time}
            elapsedTime={this.state.elapsedTime}
            // seconds={this.state.seconds}
            click={this.handleClick}
            timeStart={this.state.timeStart}
            timerSet={this.state.timerSet}
            setTimeStart={this.setTimeStart}
            stopTime={this.stopTime}
          />
          </div>
          <h1>Title</h1>
          <div>
          <InvoiceForm
            form1={this.state.form1}
            form2={this.state.form2}
            handleChange={this.handleChange}
            sendData={this.sendData}
          />
          </div>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            {this.state.isLoaded && this.state.invoices}<br/>
           {this.state.root}
          </a>
          <RateForm
            className="RateForm"
             />
                         </header>
         
      </div>
    );
  }
}

export default App;
