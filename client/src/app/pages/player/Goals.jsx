import React, { Component } from 'react'
import GoalsComp from '../../components/Goals'

class Goals extends Component {
    render() {
        return (
            <GoalsComp player={window.user} />
        )
    }
}

export default Goals