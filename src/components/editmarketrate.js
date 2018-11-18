//import the necessary files
import React from 'react';
import {Modal,ControlLabel,FormGroup,FormControl,Button} from 'react-bootstrap';
//import { stat } from 'fs';
//create a class for displaying the modal for editing an existing Marketrate and export it
export class EditMarketrate extends React.Component {
  constructor(props) {//create a state to handle the Marketrate to be edited
    super(props);
    this.state = {name: "", products: ""};
    this.handleMarketrateNameChange = this.handleMarketrateNameChange.bind(this);
    this.handleMarketrateProductsChange = this.handleMarketrateProductsChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  static getDerivedStateFromProps(props, state) {//make the Marketrate prop a state
    const prevName = state.prevName;
    const prevProducts = state.prevProducts;
    const name = prevName !== props.marketrate.name ? props.marketrate.name : state.name;
    const products = prevProducts !== props.marketrate.products.join(",") ? props.marketrate.products.join(",") : state.products;
    return {
      prevName: props.marketrate.name, name,
      prevProducts: props.marketrate.products.join(","), products,
    }
  }
  handleMarketrateNameChange(e) {//change the name to reflect user input
    this.setState({name: e.target.value});
  }
  handleMarketrateProductsChange(e) {//change the products to reflect user input
    this.setState({products: e.target.value});
  }
  handleEdit(e) {//get the Marketrate data, manipulate it and call the function for editing an existing Marketrate
    e.preventDefault();
    const onEdit = this.props.onEdit;
    const currentlyEditing = this.props.currentlyEditing;
    const regExp = /\s*,\s*/;
    var name = this.state.name;
    var products = this.state.products.split(regExp);
    onEdit(name, products, currentlyEditing);
  }
  handleCancel() {
    const onEditModal = this.props.onEditModal;
    this.setState({name: this.props.marketrate.name, products: this.props.marketrate.products.join(",")});
    onEditModal();
  }
  render() {
    const onShow = this.props.onShow;
    var regex1 = /^\S/;
    var regex2 = /^[^,\s]/;
    var regex3 = /[^,\s]$/;
    const validMarketrate = regex1.test(this.state.name) 
    && regex2.test(this.state.products) 
    && regex3.test(this.state.products);
    return(
      <Modal show={onShow} onHide={this.handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Marketrate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup controlId="formControlsName">
            <ControlLabel>Marketrate Name</ControlLabel>
            <FormControl type="text" required onChange={this.handleMarketrateNameChange} value={this.state.name} placeholder="Enter Name" />
          </FormGroup>
          <FormGroup controlId="formControlsProducts">
            <ControlLabel>Marketrates products</ControlLabel>
            <FormControl componentClass="textarea" type="text" required onChange={this.handleMarketrateProductsChange} 
            value={this.state.products} placeholder="Enter products(separate by commas)" />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={!validMarketrate} bsStyle="success" onClick={this.handleEdit}>Save Marketrate</Button>
        </Modal.Footer>
      </Modal>
    );
  }
};