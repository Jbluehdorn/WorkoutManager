import React, { Component } from 'react'
import API from '../../../API'

const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

class Players extends Component {
    constructor(props) {
        super(props)

        this.state = {
            players: [],
            perPage: 5,
            currPage: 0,
            pages: [],
            newPlayerDialogOpen: false,
            positionGroups: [],
            playerFormData: {
                name: '',
                role_id: 1,
                group_id: null,
                email: ''
            },
            saving: false
        }
    }

    // LIFECYCLE HOOKS
    componentDidMount() {
        this.loadPlayers()
        this.loadPositionGroups()
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(prevState.players !== this.state.players) {
            this.paginatePlayers()
        }
    }
    
    // METHODS
    incrementPage() {
        let currPage = this.state.currPage

        this.setState({
            currPage: ++currPage
        })
    }

    decrementPage() {
        let currPage = this.state.currPage

        this.setState({
            currPage: --currPage
        })
    }

    isFirstPage() {
        return this.state.currPage === 0
    }

    isLastPage() {
        return this.state.currPage === this.state.pages.length - 1 || this.state.pages.length === 0
    }

    async loadPlayers() {
        try {
            let resp = await API.get(`users`)
            let allUsers = resp.data.body

            let players = allUsers.filter(user => {
                return user.role.title === 'player'
            })

            this.setState({
                players: players
            })
        } catch(err) {
            console.log(err)
        }
    }

    paginatePlayers() {
        let players = this.state.players.slice()
        let cursor = 0
        let pages = []
        let perPage = this.state.perPage

        do {
            let start = cursor * perPage
            let end = start + perPage
            let page = players.slice(start, end)
            if(page.length > 0)
                pages.push(page)
            cursor++
        } while(cursor < Math.floor(players.length / perPage) + 1)

        this.setState({
            pages: pages
        })
    }

    async loadPositionGroups() {
        try {
            let resp = await API.get(`positionGroups`)
            let groups = resp.data.body

            this.setState({
                positionGroups: groups,
                playerFormData: {
                    ...this.state.playerFormData,
                    group_id: groups[0].id
                }
            })
        } catch(err) {
            console.log(err)
        }
    }

    updatePlayFormData(e) {
        let { name, value } = e.target

        let formdata = Object.assign({}, this.state.playerFormData)
        formdata[name] = parseInt(value) >= 0 ? parseInt(value) : value

        this.setState({
            playerFormData: formdata
        })
    }

    isFormValid() {
        return emailRegex.test(this.state.playerFormData.email) &&
            !!this.state.playerFormData.name
    }

    async savePlayer() {
        this.setState({
            saving: true
        })

        try {
            await API.post(`users`, this.state.playerFormData)

            this.clearForm()
            this.loadPlayers()
            this.setState({
                newPlayerDialogOpen: false
            })
        } catch(err) {
            console.log(err)
        }

        this.setState({
            saving: false
        })
    }

    clearForm() {
        let formData = Object.assign({}, this.state.playerFormData)

        formData.email = ''
        formData.name = ''
        formData.group_id = this.state.positionGroups[0].id

        this.setState({

        })
    }

    render() {
        let positionGroupOptionItems = this.state.positionGroups.map((group, key) => {
            return (
                <option value={parseInt(group.id)} key={key}>
                    {group.title}
                </option>
            )
        })

        return(
            <div className="container-fluid p-0">
                <div className="row">
                    <div className="col-3">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title mb-0">Players</h3>
                            </div>
                            <div className="card-body p-1">
                                <input type="text" className="form-control mb-1" placeholder="Search..."/>
                                <select className="form-control mb-1">
                                    <option value="-1">Position Group....</option>
                                    {
                                        positionGroupOptionItems
                                    }
                                </select>

                                <ul className="list-group">
                                    { this.state.pages[this.state.currPage] &&
                                        this.state.pages[this.state.currPage].map((player, key) => {
                                            return(
                                                <li className="list-group-item" key={key}>
                                                    {player.name}
                                                </li>
                                            )
                                        })
                                    }
                                    { this.state.pages.length === 0 &&
                                        <li className="list-group-item text-center">
                                            <i className="fa fa-spinner fa-spin"></i>
                                        </li>
                                    }
                                </ul>

                                <ul className="pagination d-flex mb-1">
                                    <li className={`page-item flex-grow-1 ${this.isFirstPage() ? 'disabled' : ''}`}>
                                        <button className="page-link btn-block py-1" onClick={() => this.decrementPage()}>
                                            {'<<'}
                                        </button>
                                    </li>
                                    <li className={`page-item flex-grow-1 ${this.isLastPage() ? 'disabled' : ''}`}>
                                        <button className="page-link btn-block py-1" onClick={() => this.incrementPage()}>
                                            {'>>'}
                                        </button>
                                    </li>
                                </ul>

                                <button className="btn btn-primary btn-block" onClick={() => this.setState({ newPlayerDialogOpen: true})}>
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* CREATE PLAYER MODAL */}
                <div className={`modal ${this.state.newPlayerDialogOpen ? 'shown' : ''}`} role="dialog" tabIndex="1">
                    <div className="modal-dialog shadow-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title mb-0">New Player</h1>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Name:</label>
                                    <input 
                                        name="name" 
                                        value={this.state.playerFormData.name} 
                                        onChange={e => this.updatePlayFormData(e)}
                                        type="text" 
                                        className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <label>Email:</label>
                                    <input 
                                        name="email"
                                        value={this.state.playerFormData.email}
                                        onChange={e => this.updatePlayFormData(e)}
                                        type="text" 
                                        className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <label>Position:</label>
                                    <select 
                                        type="number" 
                                        name="group_id" 
                                        className="form-control" 
                                        value={this.state.playerFormData.group_id}
                                        onChange={(e) => this.updatePlayFormData(e)}>
                                        {
                                            positionGroupOptionItems
                                        }
                                    </select>
                                </div>

                                <code>
                                    {JSON.stringify(this.state.playerFormData)}
                                </code>
                            </div>
                            <div className="modal-footer py-2">
                                <div className="text-right">
                                    <button className="btn btn-primary mr-1" onClick={() => this.savePlayer()} disabled={this.state.saving || !this.isFormValid()}>
                                        Save
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => this.setState({ newPlayerDialogOpen: false })}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Players