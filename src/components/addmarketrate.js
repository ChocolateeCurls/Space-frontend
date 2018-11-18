//import the necessary files
import React from 'react';
import {Modal,ControlLabel,FormGroup,FormControl,Button} from 'react-bootstrap';
//create a class for displaying the modal for adding a new Marketrate and export it
export class AddMarketrate extends React.Component {
  constructor(props) {//create a state to handle the new Marketrate
    super(props);
    this.state = {name: "", products: ""};
    this.handleMarketrateNameChange = this.handleMarketrateNameChange.bind(this);
    this.handleMarketrateProductsChange = this.handleMarketrateProductsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  handleMarketrateNameChange(e) {//change the name to reflect user input
    this.setState({name: e.target.value});
  }
  handleMarketrateProductsChange(e) {//change the products to reflect user input
    this.setState({products: e.target.value});
  }
  handleSubmit(event) {//get the Marketrate data, manipulate it and call the function for creating a new Marketrate
    event.preventDefault();
    const onAdd = this.props.onAdd;
    const regExp = /\s*,\s*/;
    var newName = this.state.name;
    var newProducts = this.state.products.split(regExp);
    var newMarketrate = {name: newName, products: newProducts};
    onAdd(newMarketrate);

    this.setState({name: "", products: ""});
  }
  handleCancel() {
    const onAddModal = this.props.onAddModal;
    this.setState({name: "", products: ""});
    onAddModal();
  }
  render() {
    const onShow = this.props.onShow;
    var regex1 = /^\S/;
    var regex2 = /^[^,\s]/;
   var regex3 = /[^,\s]$/;
    const validMarketrate = regex1.test(this.state.name) && regex2.test(this.state.products) && regex3.test(this.state.products);
    return(
      <Modal show={onShow} onHide={this.handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>New Marketrate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup controlId="formControlsName">
            <ControlLabel>Marketrate Name</ControlLabel>
            <FormControl type="text" required onChange={this.handleMarketrateNameChange} value={this.state.name} placeholder="Enter Name" />
          </FormGroup>
          <FormGroup controlId="formControlsproducts">
            <ControlLabel>Marketrate products</ControlLabel>
            <FormControl componentClass="textarea" type="text" required onChange={this.handleMarketrateProductsChange} value={this.state.products} placeholder="Enter products (separate by commas)" />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={!validMarketrate} bsStyle="success" onClick={this.handleSubmit}>Save Market Rate</Button>
        </Modal.Footer>
      </Modal>
    );
  }
};