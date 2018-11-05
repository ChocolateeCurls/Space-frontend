//import the necessary files
import React from 'react';
import ReactDOM from 'react-dom';
import {PanelGroup,Panel,Button,ButtonToolbar,ListGroup,ListGroupItem} from 'react-bootstrap';
import {AddRecipe} from '../src/components/addrecipe.js';
import {EditRecipe} from '../src/components/editrecipe.js';
import './css/index.css';
import registerServiceWorker from './registerServiceWorker';
import axios from 'axios';

//create the main class for displaying the marketrates
class Recipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      marketrates: [],
      showAdd: false,
      showEdit: false,
      currentlyEditing: 0
    };
    this.showAddModal = this.showAddModal.bind(this);
    this.showEditModal = this.showEditModal.bind(this);
    this.addRecipe = this.addRecipe.bind(this);
    this.editRecipe = this.editRecipe.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
  }
  componentDidMount() {
    
    //load the local storage data after the component renders
    /* var marketrates = (typeof localStorage["marketrates"] !== "undefined") ? JSON.parse(localStorage.getItem("marketrates")) : [
      {name: "Banana Smoothie", ingredients: ["2 bananas", "1/2 cup vanilla yogurt", "1/2 cup skim milk", "2 teaspoons honey", "pinch of cinnamon"]},
      {name: "Spaghetti", ingredients: ["Noodles", "Tomato Sauce", "Meatballs"]},
      {name: "Split Pea Soup", ingredients: ["1 pound split peas", "1 onion", "6 carrots", "4 ounces of ham"]}
    ];*/
    
    //using axios to conenct CRUD & Rest API
    axios.get('http://localhost:8080/get').then(res =>{
        console.log(res.status);
        const marketrates = res.data;
        this.setState({marketrates: marketrates});
    })
  }
  showAddModal() {//show the new recipe modal
    this.setState({showAdd: !this.state.showAdd});
  }
  showEditModal(index) {//show the edit recipe modal
    this.setState({currentlyEditing: index, showEdit: !this.state.showEdit});
  }


  addRecipe(recipe) {//create a new recipe
    let marketrates = this.state.marketrates;
    marketrates.push(recipe);
    //localStorage.setItem('marketrates', JSON.stringify(marketrates));
    axios.post('http://localhost:8080/post', recipe)
      .then(res =>{
        console.log(res);
        console.log(res.data);
      });
   
    this.setState({marketrates: marketrates});
    this.showAddModal();
  }


  editRecipe(newName, newIngredients, currentlyEditing) {//edit an existing recipe
    let marketrates = this.state.marketrates;
    marketrates[currentlyEditing] = {name: newName, ingredients: newIngredients};
    //localStorage.setItem('marketrates', JSON.stringify(marketrates));
    
    axios.post('http://localhost:8080/update/:id', marketrates)
      .then(res =>{
        console.log(res);
        console.log(res.data);
      })

    this.setState({marketrates: marketrates});
    this.showEditModal(currentlyEditing);
  }



  deleteRecipe(index) {//delete an existing recipe
    let marketrates = this.state.marketrates.slice();
    marketrates.splice(index, 1);
    //localStorage.setItem('marketrates', JSON.stringify(marketrates));
    
    axios.post('http://localhosy:8080/delete/:id', marketrates)
    .then(res =>{
      console.log(res);
      console.log(res.data);
    })

    this.setState({marketrates: marketrates, currentlyEditing: 0});
  }

  render() {
    const marketrates = this.state.marketrates;
    var currentlyEditing = this.state.currentlyEditing;
    return(
      <div className="jumbotron">
        <h1>Novo's Market Rates</h1>
        <PanelGroup accordion id="marketrates">
          {marketrates.map((recipe, index) => (
            <Panel eventKey={index} key={index}>
              <Panel.Heading>
                <Panel.Title className="title" toggle>{recipe.name}</Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>
                <ListGroup>
                  {recipe.ingredients.map((ingredient, index) => (
                    <ListGroupItem key={index}>{ingredient}</ListGroupItem>
                  ))}
                </ListGroup>
                <ButtonToolbar>
                  <Button bsStyle="warning" onClick={() => {this.showEditModal(index)}}>Edit</Button>
                  <Button bsStyle="danger" onClick={() => {this.deleteRecipe(index)}}>Delete</Button>
                </ButtonToolbar>
              </Panel.Body>
              <EditRecipe onShow={this.state.showEdit} onEdit={this.editRecipe} onEditModal={() => {this.showEditModal(currentlyEditing)}} currentlyEditing={currentlyEditing} recipe={marketrates[currentlyEditing]} />
            </Panel>
          ))}
        </PanelGroup>
        <Button bsStyle="primary" onClick={this.showAddModal}>Add Market Rate</Button>
        <AddRecipe onShow={this.state.showAdd} onAdd={this.addRecipe} onAddModal={this.showAddModal} />
      </div>
    );
  }
};
ReactDOM.render(<Recipe />, document.getElementById('root'));
registerServiceWorker();