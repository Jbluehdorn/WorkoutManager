import React, {useState, useEffect} from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { useAuth0 } from "../react-auth0-wrapper"
import API from '../API'

import NavBar from './components/Navbar'
import Sidebar from './components/Sidebar'

import {PlayerRoutes, CoachRoutes} from '../routes'

const ConnectedIndex = (props) => {
    const {isAuthenticated, loginWithRedirect, loading, auth0User} = useAuth0()
    const [user, setUser] = useState(null)
    const [routesToUse, setRoutesToUse] = useState([])

    useEffect(() => {
        const redirect = async () => {
            if(!isAuthenticated && !loading) {
                await loginWithRedirect({
                    appState: {targetUrl: '/'}
                })
            }
        } 
        redirect()

        const fetchUser = async () => {
            if(!!auth0User) {
                let resp = await API.get(`users/${auth0User.email}`)
                setUser(resp.data.body)
                window.user = resp.data.body
                switch(resp.data.body.role.id) {
                    case 1:
                        setRoutesToUse(PlayerRoutes)
                        break
                    case 2:
                        setRoutesToUse(CoachRoutes)
                        break 
                }
            }
        }
        fetchUser()
    }, [isAuthenticated, loginWithRedirect, loading, auth0User, setUser, setRoutesToUse, props])

    if(!loading && !!isAuthenticated && !!user) {
        return(
            <BrowserRouter>
                <header>
                    <NavBar user={user}/>
                </header>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-2 bg-light p-0">
                            <Sidebar routes={routesToUse} />
                        </div>
                        <div className="col-sm-10">
                            <Switch>
                                {
                                    routesToUse.map((route, key) => {
                                        if(!!route.redirect) {
                                            return (
                                                <Route 
                                                    path={route.path} 
                                                    exact={!!route.exact} 
                                                    key={key} 
                                                    render={() => (
                                                        <Redirect to={route.redirect} />
                                                    )}
                                                />
                                            )
                                        }

                                        return <Route path={route.path} component={route.component} key={key}/>
                                    })
                                }
                            </Switch>
                        </div>
                    </div>
                </div>
                
            </BrowserRouter>
        )
    }
    
    return(
        <div className="container text-center">
            <i className="fa fa-spin fa-spinner"></i>
        </div>
    )
}

// const Index = connect(null, mapDispatchToProps)(ConnectedIndex)

// export default Index

export default ConnectedIndex