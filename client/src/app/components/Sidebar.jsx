import React, {Component} from 'react'
import { Link, withRouter } from 'react-router-dom'

class Sidebar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            routes: props.routes,
            path: props.location.pathname
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props !== nextProps) {
            this.setState({
                routes: nextProps.routes,
                path: nextProps.location.pathname
            })
        }
    }

    render() {
        return(
            <ul className="nav sidebar flex-column">
                {
                    this.state.routes.map((route, key) => {
                        if(!route.hideMenuItem) {
                            return(
                                <li className="nav-item" key={key}>
                                    <Link className={`nav-link text-center text-md-left ${this.state.path === route.path ? 'active' : ''}`} to={route.path}>
                                        <i className={`fa fa-${route.icon}`}></i> &nbsp;
                                        <span className="d-md-inline d-none">{route.name}</span>
                                    </Link>
                                </li>
                            )
                        }

                        return null
                    })
                }
            </ul>
        )
    }
}

export default withRouter(Sidebar)