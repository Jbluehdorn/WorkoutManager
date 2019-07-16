import React, { Component } from 'react'
import API from '../../../API'

class Goals extends Component {
    constructor(props) {
        super(props)

        this.state = {
            players: [],
            filteredPlayers: [],
            selectedPlayers: [],
            pages: [],
            currPage: 0,
            perPage: 5,
            allGroups: [],
            searchPredicate: ''
        }
    }

    /***
     * LIFECYCLE HOOKS
     */
    componentDidMount() {
        this.loadPlayers()
        this.loadGroups()
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.filteredPlayers !== this.state.filteredPlayers) {
            this.paginatePlayers()
        }

        if(prevState.selectedPlayers !== this.state.selectedPlayers) {
            this.filter()
        }

        if(prevState.searchPredicate !== this.state.searchPredicate) {
            this.filter()
        }
    }

    /***
     *  METHODS
     */
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

    goToPage(page) {
        this.setState({
            currPage: page
        })
    }

    isFirstPage() {
        return this.state.currPage === 0
    }

    isLastPage() {
        return this.state.currPage === this.state.pages.length - 1 || this.state.pages.length === 0
    }

    paginatePlayers() {
        let players = this.state.filteredPlayers.slice()
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

    select(player) {
        let selected = this.state.selectedPlayers.slice()
        let filtered = this.state.filteredPlayers.slice()

        filtered = filtered.filter(filteredPlayer => {
            return filteredPlayer._id != player._id
        })

        selected.push(player)

        this.setState({
            selectedPlayers: selected,
            filteredPlayers: filtered
        })
    }

    selectAll() {
        let selected = this.state.selectedPlayers.slice()
        let filtered = this.state.filteredPlayers.slice()

        selected = selected.concat(filtered)

        this.setState({
            selectedPlayers: selected,
            filteredPlayers: [] 
        })
    }

    deselect(player) {
        let selected = this.state.selectedPlayers.slice()
        let filtered = this.state.filteredPlayers.slice()
        
        selected = selected.filter(selectedPlayer => {
            return selectedPlayer._id != player._id
        })

        filtered.push(player)

        this.setState({
            selectedPlayers: selected,
            filteredPlayers: filtered
        })
    }

    handleSearchPredicateChange(e) {
        this.setState({
            searchPredicate: e.target.value
        })
    }

    filter() {
        let allPlayers = this.state.players.slice()
        let selected = this.state.selectedPlayers.slice()

        let filtered = allPlayers.filter(player => {
            return player.name.toLowerCase().includes(this.state.searchPredicate.toLowerCase())
        })

        filtered = filtered.filter(player => {
            return selected.find(selPlayer => { return player._id === selPlayer._id }) === undefined
        })

        this.setState({
            filteredPlayers: filtered
        })
    }

    async loadPlayers() {
        try {
            let resp = await API.get(`users`)
            let allUsers = resp.data.body

            let players = allUsers.filter(user => {
                return user.role.title === 'player'
            })

            this.setState({
                players: players,
                filteredPlayers: players
            })
        } catch(err) {
            console.log(err)
        }
    }

    async loadGroups() {
        try {
            let resp = await API.get(`positionGroups`)
            let groups = resp.data.body

            this.setState({
                allGroups: groups
            })
        } catch(err) {
            console.log(err)
        }
    }

    render() {
        let page = this.state.pages[this.state.currPage]

        let pageItems = page !== undefined ? page.map((player, key) => {
            return (
                <li 
                    className="list-group-item list-group-item-action clickable" 
                    onClick={() => this.select(player)}
                    key={key}
                >
                    {player.name}
                </li>
            )
        }) : [<li className="list-group-item">There's nothing here</li>]

        return (
            <div>
                <div className="card mb-1">
                    <div className="card-header">
                        <h1 className="card-title mb-0">
                            Selected

                            &nbsp;<span className="badge badge-secondary">{this.state.selectedPlayers.length}</span>
                        </h1>
                    </div>
                    <div className="card-body">
                        {
                            this.state.selectedPlayers.map((player, key) => {
                                return (
                                    <span className="badge badge-pill badge-secondary mr-1">
                                        {player.name}
                                        &nbsp;
                                        <i className="fa fa-close clickable" onClick={() => this.deselect(player)}></i>
                                    </span>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h1 className="card-title mb-0">
                            Players
                        </h1>
                    </div>
                    <div className="card-body">
                        <div className="form-row mb-1">
                            <div className="col">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Search..." 
                                    value={this.state.searchPredicate}
                                    onChange={(e) => this.handleSearchPredicateChange(e)}/>
                            </div>

                            <div className="col">
                                <button className="btn btn-secondary" onClick={() => this.selectAll()}>
                                    Select All
                                </button>
                            </div>
                        </div>

                        <ul className="list-group">
                            {pageItems}
                        </ul>

                        <ul className="pagination justify-content-center mt-1 mb-0">
                            <li className={`page-item ${this.isFirstPage() ? 'disabled' : ''}`}>
                                <a href="#" className="page-link" onClick={() => this.decrementPage()}>
                                    {'<<'}
                                </a>
                            </li>
                            {
                                this.state.pages.map((page, key) => {
                                    return (
                                        <li className={`page-item ${this.state.currPage === key ? 'disabled' : ''}`}>
                                            <a href="#" className="page-link" onClick={() => this.goToPage(key)}>
                                                {key + 1}
                                            </a>
                                        </li>
                                    )
                                })
                            }
                            <li className={`page-item ${this.isLastPage() ? 'disabled' : ''}`}>
                                <a href="#" className="page-link" onClick={() => this.incrementPage()}>
                                    {'>>'}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Goals