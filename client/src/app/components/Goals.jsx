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
            workouts: [],
            loading: false
        }
    }

    componentDidMount() {
        this.reload()
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.player !== this.props.player) {
            this.setState({
                player: this.props.player
            })
        }

        if(prevState.player !== this.state.player) {
            this.reload()
        }
    }

    reload() {
        this.loadGoals()
        this.loadWorkouts()
    }

    async loadGoals() {
        this.setState({ loading: true })

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

        this.setState({ loading: false })
    }

    async loadWorkouts() {
        this.setState({ loading: true })

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

        this.setState({ loading: false })
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
                        !this.state.loading &&
                        (this.state.goals.length ? this.state.goals.map((goal, key) => {
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
                        }) : <div className="text-center">No Current Goals Set</div>)
                    }
                    {
                        this.state.loading &&
                        <div className="text-center">
                            <i className="fa fa-spin fa-spinner"></i>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default Goals