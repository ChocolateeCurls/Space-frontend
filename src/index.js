import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { PanelGroup, Panel, Button, ButtonToolbar, ListGroup } from 'react-bootstrap';
import { AddMarketrate } from './components/addmarketrate';
import { EditMarketrate } from './components/editmarketrate';
import './css/index.css';
//import registerServiceWorker from './registerServiceWorker';

//main class
class Marketrate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            marketrates: [],
            id: 0,
            name: "",
            products: [],
            showAdd: false,
            showEdit: false,
            currentlyEditing: 0
        };
        this.showAddModal = this.showAddModal.bind(this);
        this.showEditModal = this.showEditModal.bind(this);
        this.addMarketrates = this.addMarketrates.bind(this);
        this.editMarketrate = this.editMarketrate.bind(this);
        this.deleteMarketrate = this.deleteMarketrate.bind(this);
    }

    componentDidMount() {

        //load the local storage data after the component renders
        /* var marketrates = (typeof localStorage["marketrates"] !== "undefined") ? JSON.parse(localStorage.getItem("marketrates")) : [
          {name: "Banana Smoothie", products: ["2 bananas", "1/2 cup vanilla yogurt", "1/2 cup skim milk", "2 teaspoons honey", "pinch of cinnamon"]},
          {name: "Spaghetti", products: ["Noodles", "Tomato Sauce", "Meatballs"]},
          {name: "Split Pea Soup", products: ["1 pound split peas", "1 onion", "6 carrots", "4 ounces of ham"]}
        ];*/

        axios.get('http://localhost:3001/get')
            .then(res => {
                console.log(res.status);
                const marketrates = res.data;
                console.log(marketrates);
                this.setState({ marketrates: marketrates });
            })

    }
    //Show Modals
    showAddModal() {
        this.setState({ showAdd: !this.state.showAdd });
    }
    showEditModal(index) { //show the edit modal
        this.setState({ showEdit: !this.state.showEdit, currentlyEditing: index });
        console.log(index);
    }

    //create new marketrate
    addMarketrates(marketrate) {
        let marketrates = this.state.marketrates;
        marketrates.push(marketrate);
        //localStorage.setItem('marketrates', JSON.stringify(marketrates));
        var headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        }

        axios.post('http://localhost:3001/insert', marketrate, { "headers": headers })
            .then(res => {
                console.log(res);
                console.log(res.data);
            });

        this.setState({ marketrates: marketrates });
        this.showAddModal();
    }
    editMarketrate(newName, newProducts, currentlyEditing) {//edit an exist marketrate
        let marketrate = this.state.marketrates;
        var marketrates = { _id: marketrate[currentlyEditing]._id, name: newName, products: newProducts };
        //localStorage.setItem('marketrates', JSON.stringify(marketrate));
        axios.put('http://localhost:3001/update/:id', marketrates)
            .then(res => {
                console.log(marketrate);
                console.log(res);
                console.log(res.data);
            });
        this.setState({ marketrates: marketrate });
        this.showEditModal(currentlyEditing);
    }
    deleteMarketrate(index) {
        let marketrate = this.state.marketrates.slice();
        marketrate.splice(index, 1);

        axios.delete('http://localhost:3001/delete/:id', marketrate)
            .then(res => {
                console.log(res);
                console.log(res.data);
            });

        //localStorage.setItem('marketrates', JSON.stringify(marketrate));
        this.setState({ marketrates: marketrate, currentlyEditing: 0 });
    }

    render() {
        const marketrates = this.state.marketrates;
        console.log(marketrates);
        return (
            <div className="jumbotron">
                <h1 className="text-primary">Marketrates...</h1>
                <PanelGroup accordion id="recipes">
                    {
                        marketrates.map((marketrate, index) => (
                            <Panel eventKey={index} key={index}>
                                <Panel.Heading className="title text-center"><h3>{marketrate.name}</h3></Panel.Heading>
                                <Panel.Title toggle><h5>Listed Products:</h5></Panel.Title>
                                <Panel.Body collapsible>

                                    <ListGroup className="row">
                                        {
                                            Array.from(Object.keys(marketrate.products), k => marketrate.products[k]).map((product, index) => (
                                                <div className="col-md-4" key={index}>
                                                    <h2>
                                                        {product}
                                                    </h2>
                                                </div>
                                            ))
                                        }
                                    </ListGroup>
                                    <ButtonToolbar>
                                        <Button bsStyle="warning" onClick={() => { this.showEditModal(index) }}>Edit</Button>
                                        <Button bsStyle="danger" onClick={() => {
                                            if (window.confirm('Are you sure, you want to delete the item?'))
                                                this.deleteMarketrate(index)
                                        }}>Delete</Button>
                                    </ButtonToolbar>
                                </Panel.Body>
                                <EditMarketrate onShow={this.state.showEdit} onEdit={this.editMarketrate}
                                    onEditModal={() => { this.showEditModal(this.state.currentlyEditing) }}
                                    currentlyEditing={this.state.currentlyEditing}
                                    marketrate={marketrates[this.state.currentlyEditing]} />
                            </Panel>
                        ))}
                </PanelGroup>
                <Button bsStyle="primary" onClick={this.showAddModal}>Add Marketrate</Button>
                <AddMarketrate onShow={this.state.showAdd} onAdd={this.addMarketrates} onAddModal={this.showAddModal} />
            </div>
        );
    }
};

ReactDOM.render(<Marketrate />, document.getElementById('root'));
//registerServiceWorker();