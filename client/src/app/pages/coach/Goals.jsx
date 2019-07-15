import React, { Component } from 'react'
import API from '../../../API'

class Goals extends Component {
    constructor(props) {
        super(props)

        this.state = {
            players: [],
            pages: [],
            currPage: 0,
            perPage: 2
        }
    }

    /***
     * LIFECYCLE HOOKS
     */
    componentDidMount() {
        this.loadPlayers()
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.players != this.state.players) {
            this.paginatePlayers()
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

    render() {
        let page = this.state.pages[this.state.currPage]

        let pageItems = page !== undefined ? page.map((player, key) => {
            return (
                <li className="list-group-item list-group-item-action clickable" key={key}>
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
                        </h1>
                    </div>
                    <div className="card-body">

                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h1 className="card-title mb-0">
                            Players
                        </h1>
                    </div>
                    <div className="card-body">
                        <ul className="list-group">
                            {pageItems}
                        </ul>

                        <ul className="pagination justify-content-center mt-1 mb-0">
                            <li className={`page-item ${this.state.currPage === 0 ? 'disabled' : ''}`}>
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
                            <li className={`page-item ${this.state.currPage === this.state.pages.length - 1 ? 'disabled' : ''}`}>
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