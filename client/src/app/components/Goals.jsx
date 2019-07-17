import React, { Component } from 'react'
import API from '../../API'
import humanizeDuration from 'humanize-duration'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)
const range = moment().range(moment().utc().startOf('week').add(1, 'day'), moment().utc().endOf('week').add(1, 'day'))

class Goals extends Component {
    constructor(props) {
        super(props)

        this.state = {
            player: props.player,
            goals: [],
            workouts: []
        }
    }

    componentDidMount() {
        this.loadGoals()
        this.loadWorkouts()
    }

    async loadGoals() {
        try {
            let resp = await API.get('goals?active="true"')
            let allGoals = resp.data.body

            let playerGoals = allGoals.filter(goal => {
                return goal.user_id === this.state.player._id && goal.duration !== 0
            })

            this.setState({
                goals: playerGoals
            })
        } catch(err) {
            console.log(err)
        }
    }

    async loadWorkouts() {
        try {
            let resp = await API.get('workouts')
            let allWorkouts = resp.data.body

            let userWorkouts = allWorkouts.filter(workout => {
                return workout.user_id === this.state.player._id && range.contains(moment(workout.date))
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
            <div className="card">
                <div className="card-header">
                    <h1 className="card-title mb-0">
                        Weekly Goals
                    </h1>
                </div>
                <div className="card-body">
                    {
                        this.state.goals.map((goal, key) => {
                            let total = this.state.workouts.reduce((total, workout) => {
                                if(workout.muscle_group_id === goal.muscle_group_id)
                                    return total + workout.duration

                                return total
                            }, 0)

                            let isComplete = total >= goal.duration
                            let percentComplete = total / goal.duration > 1 ? 100 : total / goal.duration * 100

                            let bgClass = 'bg-danger'
                            bgClass = percentComplete >= (100/3) ? 'bg-warning' : bgClass
                            bgClass = percentComplete >= 100 ? 'bg-success' : bgClass

                            return (
                                <div key={key} className="mb-3">
                                    <strong>
                                        {goal.muscle_group.title} -&nbsp;
                                        <i className={`fa ${isComplete ? 'fa-check text-success' : 'fa-times text-danger'}`}></i>
                                    </strong>
                                    <div className="progress" style={{height: '2em'}}>
                                        <div 
                                            className={`progress-bar ${bgClass}`}
                                            style={{width: percentComplete + '%'}}
                                        >{Math.round(percentComplete)}%</div>
                                    </div>
                                    <small>{humanizeDuration(total * 60000, {delimiter: ' '})} out of {humanizeDuration(goal.duration * 60000, { delimiter: ' '})}</small>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default Goals