import React, {Component} from 'react'
import {Switch} from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import axios from 'axios'

import Navbar from './components/Navbar'
import Routes from './routes'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: props.user
        }
    }

    render() {
        return (
            <div>
                <Navbar user={this.state.user} />
                <div className="container-fluid">
                    <div className="row">
                        <Switch>
                            {renderRoutes(Routes)}
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}

export default App