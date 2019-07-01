import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'

class Navbar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: props.user
        }
    }

    render() {
        return (
            <div className="navbar navbar-dark navbar-dark bg-dark shadow p-0">
                <a href="/" className="navbar-brand ml-2">
                    <img src="static/images/logo.png" className="mr-2" alt="Logo" height="30" />

                    {this.state.user.nickname}
                </a>

                <ul className="navbar-nav ml-auto mr-3">
                    <li className="nav-item">
                        <NavLink className="nav-link" title="Log out" to="/logout">
                            <i className="fa fa-sign-out"></i>
                        </NavLink>
                    </li>
                </ul>
            </div>
        )
    }
}

export default Navbar