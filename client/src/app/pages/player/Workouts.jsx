import React, { Component } from 'react'

import WorkoutLog from '../../components/WorkoutLog'
import WorkoutTotals from '../../components/WorkoutTotals'

class Workouts extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: window.user
        }
    }

    render() {
        return (
            <div>
                <WorkoutTotals user={window.user} />
                <WorkoutLog user={window.user} />
            </div>
        )
    }
}

export default Workouts