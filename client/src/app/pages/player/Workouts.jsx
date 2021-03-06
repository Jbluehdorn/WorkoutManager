import React, { Component } from 'react'
import API from '../../../API'

import WorkoutLog from '../../components/WorkoutLog'
import WorkoutTotals from '../../components/WorkoutTotals'

class Workouts extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: window.user,
            workouts: []
        }

        this.loadWorkouts = this.loadWorkouts.bind(this)
    }
    
    componentDidMount() {
        this.loadWorkouts()
    }

    async loadWorkouts() {
        try {
            let resp = await API.get('workouts')
            let allWorkouts = resp.data.body

            let userWorkouts = allWorkouts.filter(workout => {
                return workout.user_id === this.state.user._id;
            })

            userWorkouts.sort((a, b) => {
                return new Date(b.date) - new Date(a.date)
            })

            this.setState({
                workouts: userWorkouts
            })

        } catch(err) {
            console.log(err)
        }
    }

    render() {
        return (
            <div>
                <WorkoutTotals player={window.user} workouts={this.state.workouts} />
                <WorkoutLog player={window.user} workouts={this.state.workouts} onChange={this.loadWorkouts} />
            </div>
        )
    }
}

export default Workouts