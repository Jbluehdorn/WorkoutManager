import React, {useState, useEffect} from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { useAuth0 } from "../react-auth0-wrapper";
import API from '../API'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'

import NavBar from './components/Navbar'

import {PlayerRoutes, CoachRoutes} from '../routes'

let Index = () => {
    const {isAuthenticated, loginWithRedirect, loading, auth0User} = useAuth0()
    const [user, setUser] = useState(null)

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
            }
        }
        fetchUser()
    }, [isAuthenticated, loginWithRedirect, loading, auth0User, setUser])

    if(!loading && !!isAuthenticated && !!user) {
        return(
            <BrowserRouter>
                <header>
                    <NavBar user={user}/>
                </header>
                <Switch>
                    { user.role.id === 1 &&
                        CoachRoutes.map((route, key) => {
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
                    { user.role.id === 2 &&
                        PlayerRoutes.map((route, key) => {
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
            </BrowserRouter>
        )
    }
    
    return(
        <div className="container text-center">
            <i className="fa fa-spin fa-spinner"></i>
        </div>
    )
}

export default Index