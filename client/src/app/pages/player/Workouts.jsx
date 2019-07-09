import React, { Component } from 'react'

import WorkoutLog from '../../components/WorkoutLog'

class Workouts extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: window.user
        }
    }

    render() {
        return (
            <WorkoutLog />
        )
    }
}

export default Workouts