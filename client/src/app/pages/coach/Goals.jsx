import React, { Component } from 'react'
import API from '../../../API'
import humanizeDuration from 'humanize-duration'

class Goals extends Component {
    constructor(props) {
        super(props)

        this.state = {
            players: [],
            filteredPlayers: [],
            selectedPlayers: [],
            pages: [],
            currPage: 0,
            perPage: 10,
            allPositionGroups: [],
            searchPredicate: '',
            positionGroupPredicate: null,
            formShown: false,
            muscleGroups: [],
            saving: false
        }
    }

    /***
     * LIFECYCLE HOOKS
     */
    componentDidMount() {
        this.loadPlayers()
        this.loadPositionGroups()
        this.loadMuscleGroups()
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.filteredPlayers !== this.state.filteredPlayers) {
            this.paginatePlayers()
        }

        if(prevState.selectedPlayers !== this.state.selectedPlayers) {
            this.filter()
        }

        if(prevState.searchPredicate !== this.state.searchPredicate || prevState.positionGroupPredicate !== this.state.positionGroupPredicate) {
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
            return filteredPlayer._id !== player._id
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
            return selectedPlayer._id !== player._id
        })

        filtered.push(player)

        this.setState({
            selectedPlayers: selected,
            filteredPlayers: filtered
        })
    }

    deselectAll() {
        this.setState({
            selectedPlayers: [],
            filteredPlayers: this.state.players.slice()
        })
    }

    handleSearchPredicateChange(e) {
        this.setState({
            searchPredicate: e.target.value
        })
    }

    handlePositionSelectChange(e) {
        let groupID = parseInt(e.target.value)

        let groupPredicate = this.state.allPositionGroups.find(group => {
            return group.id === groupID
        })

        this.setState({
            positionGroupPredicate: groupPredicate
        })
    }

    filter() {
        let allPlayers = this.state.players.slice()
        let selected = this.state.selectedPlayers.slice()

        let filtered = allPlayers.filter(player => {
            let playerMatchesSearchPredicate = player.name.toLowerCase().includes(this.state.searchPredicate.toLowerCase())
            let playerMatchesGroupPredicate = !!this.state.positionGroupPredicate ? player.position_group.id === this.state.positionGroupPredicate.id : true
            
            return playerMatchesGroupPredicate && playerMatchesSearchPredicate
        })

        filtered = filtered.filter(player => {
            return selected.find(selPlayer => { return player._id === selPlayer._id }) === undefined
        })

        this.setState({
            filteredPlayers: filtered
        })
    }

    closeModal() {
        this.setState({
            formShown: false
        })
    }

    updateGroupDuration(e, groupID) {
        let duration = e.target.value
        let groups = this.state.muscleGroups.slice()

        groups.forEach(group => {
            if(group.id === groupID)
                group.duration = duration
        })

        this.setState({
            muscleGroups: groups
        })
    }

    resetMuscleGroups() {
        let groups = this.state.muscleGroups.slice()

        groups.forEach(group => {
            group.duration = 0
        })

        this.setState({
            muscleGroups: groups
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

    async loadPositionGroups() {
        try {
            let resp = await API.get(`positionGroups`)
            let groups = resp.data.body

            this.setState({
                allPositionGroups: groups
            })
        } catch(err) {
            console.log(err)
        }
    }
    
    async loadMuscleGroups() {
        try {
            let resp = await API.get(`muscleGroups`)
            let muscleGroups = resp.data.body

            muscleGroups.forEach(group => {
                group.duration = 0
            })

            this.setState({
                muscleGroups: muscleGroups
            })
        } catch(err) {
            console.log(err)
        }
    }

    async saveGoals() {
        let selectedPlayers = this.state.selectedPlayers.slice()
        let muscleGroups = this.state.muscleGroups.slice()

        this.setState({ saving: true})

        try {
            selectedPlayers.forEach(player => {
                muscleGroups.forEach(async group => {
                    await API.post(`goals`, {
                        user_id: player._id,
                        muscle_group_id: group.id,
                        duration: group.duration
                    })
                })
            })

            this.resetMuscleGroups()
            this.deselectAll()
            this.closeModal()
        } catch(err) {
            console.log(err)
        }

        this.setState({ saving: false })
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
                    {player.name} - {player.position_group.title}
                </li>
            )
        }) : [<li className="list-group-item" key={-1}>There's nothing here</li>]

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
                        <div className="h4">
                            {
                                this.state.selectedPlayers.map((player, key) => {
                                    return (
                                        <span className="badge badge-pill badge-secondary mr-1" key={key}>
                                            {player.name}
                                            &nbsp;
                                            <i className="fa fa-close clickable" onClick={() => this.deselect(player)}></i>
                                        </span>
                                    )
                                })
                            }
                        </div>

                        <div className="text-right">
                            <button className="btn btn-primary mr-1" disabled={this.state.selectedPlayers.length === 0} onClick={() => this.setState({formShown: true})}>
                                Set Goals <i className="fa fa-pencil"></i>
                            </button>
                            <button className="btn btn-danger" onClick={() => this.deselectAll()}>
                                Remove All <i className="fa fa-times-circle"></i>
                            </button>
                        </div>
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
                                <select className="form-control" onChange={(e) => this.handlePositionSelectChange(e)}>
                                    <option value={-1}>All Positions</option>
                                    {
                                        this.state.allPositionGroups.map((group, key) => {
                                            return (
                                                <option value={group.id} key={key}>{group.title}</option>
                                            )
                                        })
                                    }
                                </select>
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
                                <button className="page-link" onClick={() => this.decrementPage()}>
                                    {'<<'}
                                </button>
                            </li>
                            {
                                this.state.pages.map((page, key) => {
                                    return (
                                        <li className={`page-item ${this.state.currPage === key ? 'disabled' : ''}`} key={key}>
                                            <button className="page-link" onClick={() => this.goToPage(key)}>
                                                {key + 1}
                                            </button>
                                        </li>
                                    )
                                })
                            }
                            <li className={`page-item ${this.isLastPage() ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => this.incrementPage()}>
                                    {'>>'}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                 {/* SET GOALS MODAL */}
                <div className={`modal ${this.state.formShown ? 'shown' : ''}`} role="dialog" tabIndex="1">
                    <div className="modal-dialog shadow-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title mb-0">
                                    Goals
                                </h1>
                            </div>
                            <div className="modal-body">
                                {
                                    this.state.muscleGroups.map((group, key) => {
                                        return (
                                            <div className="form-group" key={key}>
                                                <label>{group.title} { group.duration > 0 && `- ${humanizeDuration(group.duration * 60000, {delimiter: ' '})}`}</label>
                                                <input 
                                                    type="range" 
                                                    className="form-control" 
                                                    value={group.duration} 
                                                    onChange={(e) => this.updateGroupDuration(e, group.id)}
                                                    step="5" 
                                                    min="0" 
                                                    max="180"/>
                                            </div>
                                        )
                                    })
                                }

                                <div className="text-right">
                                    <button className="btn btn-primary mr-1" onClick={() => this.saveGoals()} disabled={this.state.saving}>
                                        Save
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => this.closeModal()}>
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

export default Goals