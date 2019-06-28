import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'

class Navbar extends Component {
    render() {
        return (
            <div>
                <ul>
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/todos">Todos</NavLink>
                    </li>
                </ul>
            </div>
        )
    }
}

export default Navbar