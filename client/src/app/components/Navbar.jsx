import React from 'react'
import { useAuth0 } from '../../react-auth0-wrapper'

let NavBar = (props) => {
    const { logout } = useAuth0()

    return (
        <div className="navbar navbar-dark bg-dark p-0">
            <a href="/" className="navbar-brand ml-2">
                    <img src="logo.png" className="mr-2" alt="Logo" height="30" />

                    {
                        !!props.user && (
                            <span>{props.user.name}</span>
                        )
                    }
                </a>

                <ul className="navbar-nav ml-auto mr-3">
                    <li className="nav-item">
                        <a className="nav-link" title="Log out" href="/" onClick={() => { logout() }}>
                            <i className="fa fa-sign-out"></i>
                        </a>
                    </li>
                </ul>
        </div>
    )
}

export default NavBar