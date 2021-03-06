import React, { Component } from 'react';
import './Main-styles.css'
import jspdf from 'jspdf'

import moment from 'moment';
import Axios from 'axios';
import '../App.css';
import User from '../User';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import MyModalWithGrid from '../InvoiceModal/InvoiceModal'
import RegistrationModal from '../RegistrationModal/RegistrationModal'
import Modal from 'react-bootstrap/Modal'


import {
    InputGroup,
    InputGroupAddon,
    InputGroupButtonDropdown,
    InputGroupDropdown,
    Input,
    Button,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
  } from "reactstrap";

class InvoiceForm extends Component {
    constructor(props) {
        super(props);
        this.state = {earnings: 0.00,
                extra_fees:0.00
          }
        }

    componentDidMount= ()=>{
            this.fetchUserInfo()
            const start= setInterval(this.calculateEarnings,500)
            this.setState({interval:start})
            this.updateInvoiceData()
        }

    submitForm=(event)=>{
        console.log();
        event.preventDefault()
        const invoice = (this.state.invoiceData)

        //     // Need to add Client Email, User Email, User Phone Number, User Address


        const doc = new jspdf()

        const printPdf = ()=>{
            doc.setFontSize(13);
            doc.text(15,20,`${invoice.business_name}`);

            doc.setFontSize(13);
            doc.text(15,27,`This is place holder for  useraddress`);

            doc.setFontSize(13);
            doc.text(15,34,`This is place holder for phone and email`);

            doc.setFontSize(35);
            doc.text(11,57, ` ${invoice.title}`);

            doc.setFontSize(10);
            doc.text(175,20,`${invoice.invoice_number}`);
            //line
            doc.line(200,63,15,63)

            doc.setFontSize(10);
            doc.text(15,68,`DATE: {data.date}`);

            doc.setFontSize(20);
            doc.text(15,82,`For:`);

            doc.setFontSize(20);
            doc.text(15,120,`Description:`);


            const splitTitle = doc.splitTextToSize(` ${invoice.description}`, 280);
            doc.setFontSize(13);
            doc.text(15, 130, splitTitle);
            // doc.text(15,120,`Description: ${data.description}`);

            doc.setFontSize(13);
            doc.text(15,90,`${invoice.client_name}`);

            doc.setFontSize(13);
            doc.text(15,97,`${invoice.client_email} ${invoice.client_phone}`);

            doc.setFontSize(13);
            doc.text(15,104,`${invoice.client_address} ${invoice.client_city} ${invoice.client_zip}`);
            //line

            doc.setFontSize(15);
            doc.text(15,190,`${invoice.extra_details}`);

            doc.setFontSize(15);
            doc.text(130,190,`Rate: $${invoice.rate}.00 `);

            doc.setFontSize(15);
            doc.text(130,200,`Time Logged: ${invoice.logged_time}`);

            //line
            doc.line(200,212,20,212)

            doc.setFontSize(18);
            doc.text(115,240,`Total Amount:`);

            doc.setFontSize(20);
            doc.text(170,240,`$${invoice.total_amount}.00`);
            
            doc.save('invoicepdf.pdf')
        }

        printPdf()

        this.props.sendData(invoice)


        // clearInterval(this.state.interval)
    }
    createAuthHeader = ()=>{
        const token = localStorage.getItem('token')
        const header = {
        headers:{'Authorization':  "bearer " +token}
        }
        localStorage.setItem('authorization', header)
        return header
    }



    fetchUserInfo = async ()=>{
        const header = this.createAuthHeader()
        const user = localStorage.getItem('id')
        const response = await Axios.get(`/users/${user}`,header)
        console.log(response.data)

        this.setState({userInfo:response.data})
    }


    calculateEarnings= ()=>{
        const billable_hours = this.props.timerValue ? this.props.timerValue.seconds : 0
        //  ? this.props.timerValue.seconds/3600 : 0
        console.log(billable_hours)
        const earnings = (billable_hours * parseInt(this.state.rate)/3600).toFixed(2)
        this.setState({
            billable_hours: billable_hours,
            earnings: earnings,
            total_amount: (parseInt( earnings) + parseInt(this.state.extra_fees))})
        console.log(this.state.earnings)
        }

    handleChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
        this.updateInvoiceData()
    };

    updateInvoiceData =()=>{
      this.setState({invoiceData: {
            // Need to add Client Email, User Email, User Phone Number, User Address
            // Job Information
            title: this.state.jobtitle,
            invoice_number: this.state.invoice_number,
            date: moment(),
            description:this.state.description,
            extra_details: this.state.extra_details,
            logged_time: moment().format('hh:mm:ss a'),
            //Billing Information

            billable_hours: this.state.billable_hours,
            rate:this.state.rate,
            hourly_earnings:this.state.earnings,
            extra_fees:parseInt(this.state.extra_fees).toFixed(2),// extra fees need an input field and they can be added to the "total_amount"
            total_amount:this.state.total_amount, //+extra_fees
            // client information
            client_name:this.state.name,
            client_email: this.state.client_email,
            client_phone: this.state.client_phone,
            client_address:this.state.client_address,
            client_city:this.state.client_city,
            client_zip: parseInt(this.state.client_zip),
            user_id: parseInt(localStorage.getItem('id')),
        }
      })
        this.props.liftState(this.state.invoice)

    }
    // this.props.liftState(this.state.object)
    render() {
        let modalClose = () => this.setState({modalShow:false});
    console.log(this.state.invoiceData)
        return (
            <React.Fragment>
              <div className="app-txt-wrap">
                <h3>{this.state.name}</h3>
                <h1>{this.state.jobtitle}</h1>
                <h3>{this.state.rate}</h3>
                 <h4>{this.state.comments}</h4>
              </div>

                <form className="form-group" onSubmit={this.submitForm}>
                    {/*client information  */}
                    <h4>Client Information</h4>
                    <div class="form-group">
                    <label for="exampleDropdownFormEmail2">Name</label>
                      <input className="form-control mb-2 input-lg" name='client_name' type="text" placeholder="Client Name" onChange={this.handleChange}/>
                    </div>
                    <div class="form-group">
                      <label for="exampleDropdownFormEmail2">Email</label>
                      <input className="form-control mb-2 input-lg" name='client_email' type="text" placeholder="example@business.com" onChange={this.handleChange}/>
                    </div>
                    <div class="form-group">
                      <label for="exampleDropdownFormEmail2">Phone Number</label>
                      <input className="form-control mb-2 input-lg" name='client_phone' type="text" placeholder="Client Phone Number" onChange={this.handleChange}/>
                    </div>
                    <div class="form-group">
                      <label for="exampleDropdownFormEmail2">City</label>
                      <input className="form-control mb-2 input-lg" name='client_city' type="text" placeholder="Client City" onChange={this.handleChange}/>
                    </div>
                    <div class="form-group">
                      <label for="exampleDropdownFormEmail2">Address</label>
                      <input className="form-control mb-2 input-lg" name='client_address' type="text" placeholder="Client Address" onChange={this.handleChange}/>
                    </div>
                    <div class="form-group">
                      <label for="exampleDropdownFormEmail2">Client Zipcode</label>
                      <input className="form-control mb-2 input-lg" name='client_zip' type="text" placeholder="Client Zip Code" onChange={this.handleChange}/>
                    </div>


                    {/* job information  */}
                    <div class="form-group">
                    <h4>Job Information</h4>
                      <label for="exampleDropdownFormEmail2">Title</label>
                      <input className="form-control mb-2 input-lg" name='jobtitle' type="text" placeholder="Invoice Title" onChange={this.handleChange}/>
                      <label for="exampleDropdownFormEmail2">Name</label>
                      <input className="form-control mb-2 input-lg" name='name' type="text" placeholder="Name" onChange={this.handleChange}/>
                      <label for="exampleDropdownFormEmail2">Description</label>
                      <textarea className="form-control input-lg" name='description' placeholder='Description' onChange={this.handleChange}/>
                      <label for="exampleDropdownFormEmail2">Extra Details</label>
                      <textarea className="form-control input-lg" name='extra_details' placeholder='Extra Details' onChange={this.handleChange}/>
                    </div>

                   {/* Bill information */}
                   <div class="form-group">
                    <h4>Billing Information</h4>
                    <label for="exampleDropdownFormEmail2">Rate</label>
                    <input className="form-control mb-2 input-lg" name='rate' type="text" placeholder="Rate" onChange={this.handleChange}/>
                    <label for="exampleDropdownFormEmail2">Extra Fees</label>
                    <input className="form-control mb-2 input-lg" name='extra_fees' type="text" placeholder="Extra Fees" onChange={this.handleChange}/>
                    <label for="exampleDropdownFormEmail2">Invoice No.</label>
                    <input className="form-control mb-2 input-lg" name='invoice_number' type="text" placeholder="InvoiceNo." onChange={this.handleChange}/>
                  </div>


                    <h1 className="f-white" >{`$${this.state.earnings}`}</h1>
                    <h1 className="f-white" >{`$${this.state.total_amount}`}</h1>
                    <button className="btn btn-success btn-lg btn-block">Submit</button>

                </form>
                <Modal
      {...this.props}
      aria-labelledby="contained-modal-title-vcenter"
      size="lg"
      centered
      >
            <h4>{this.state.invoice_number}</h4>

      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1 id="modal-title">{this.state.jobtitle}</h1> 
        </Modal.Title>
      </Modal.Header>
      <Modal.Header>
        <Modal.Title className="client-data" >
        <h5>{this.state.client_name}</h5>
            <h5> {this.state.client_email}</h5>
            <h5>{parseInt(this.state.client_phone)}</h5>
            <h5>{this.state.client_address}</h5>
            <h5>{this.state.client_city}</h5>
            <h5> {this.state.client_zip}</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row className="show-grid">
            <Col xs={12} md={12}>
            
              <h3></h3>
              <p className="modal-description"><span className="description-bold">Description:   </span>{this.state.description}</p>
            </Col>
          </Row>
        </Container>
        <Row className="show-grid">
            <Col xs={12} md={2} className="text-right">
              <p className="modal-rate">Rate: $ {this.state.rate}</p>
              <p className="modal-time">Total Time: {moment().format('hh:mm:ss a')}</p>
            </Col>
          </Row>
      </Modal.Body>

      <Modal.Footer>
        <h1>Total: {this.state.total_amount}</h1>
      </Modal.Footer>
      <Modal.Footer>
        <Button onClick={this.props.onHide}>Close</Button>
      </Modal.Footer>
      </Modal>

            </React.Fragment>
         );

        }
}

export default InvoiceForm
