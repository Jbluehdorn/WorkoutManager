import React, {Component} from 'react'
import {Switch} from 'react-router-dom'
import { renderRoutes } from 'react-router-config'

import Navbar from './components/Navbar'
import Routes from './routes'

class App extends Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <Navbar />
                </div>
                <div className="row">
                    <Switch>
                        {renderRoutes(Routes)}
                    </Switch>
                </div>
            </div>
        )
    }
}

export default App