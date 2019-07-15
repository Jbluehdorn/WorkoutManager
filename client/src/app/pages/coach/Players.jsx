import React, { Component } from 'react'
import API from '../../../API'

class Players extends Component {
    constructor(props) {
        super(props)

        this.state = {
            players: []
        }
    }

    componentDidMount() {
        this.loadPlayers();
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
        return(
            <div>
                <h1>Players</h1>
                <p>
                    <code>
                        {JSON.stringify(this.state.players)}
                    </code>
                </p>
            </div>
        )
    }
}

export default Players