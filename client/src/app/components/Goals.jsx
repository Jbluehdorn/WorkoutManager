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
            loading: false,
            admin: props.admin ? props.admin : false,
            manageGoalsDialogShown: false,
            muscleGroups: [],
            saving: false,
            onChange: props.onChange ? props.onChange : function() {return;}
        }
    }

    componentDidMount() {
        this.loadMuscleGroups()
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

        if(prevState.goals !== this.state.goals) {
            this.mapMuscleGroupDurations()
        }
    }

    reload() {
        this.loadGoals()
        this.loadWorkouts()
    }

    mapMuscleGroupDurations() {
        let groups = this.state.muscleGroups.slice()
        let goals = this.state.goals.slice()

        groups.forEach(group => {
            let goal = goals.find(goal => {
                return goal.muscle_group_id === group.id
            })

            group.duration = goal ? goal.duration : 0
        })

        this.setState({
            muscleGroups: groups
        })
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

    async loadMuscleGroups() {
        try {
            let resp = await API.get(`muscleGroups`)
            let groups = resp.data.body

            groups.forEach(group => {
                group.duration = 0
            })

            this.setState({
                muscleGroups: groups
            })
        } catch(err) {
            console.log(err)
        }
    }

    async saveGoals() {
        let muscleGroups = this.state.muscleGroups.slice()

        this.setState({ saving: true })

        try {
            for(let i = 0; i < muscleGroups.length; i++) {
                let group = muscleGroups[i]
                
                await API.post(`goals`, {
                    user_id: this.state.player._id,
                    muscle_group_id: group.id,
                    duration: group.duration
                })
            }

            this.loadGoals()
            this.closeAndResetForm()
            this.state.onChange()
        } catch(err) {
            console.log(err)
        }

        this.setState({ saving: false })
    }

    closeAndResetForm() {
        this.mapMuscleGroupDurations()

        this.setState({
            manageGoalsDialogShown: false
        })
    }

    render() {
        return (
            <div>
                <div className="card mb-1">
                    <div className="card-header">
                        <h1 className="card-title mb-0">
                            Weekly Goals
                        </h1>
                    </div>
                    <div className="card-body">
                        {
                            !this.state.loading &&
                            <div>
                                {
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
                                    !!this.state.admin &&
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-primary" onClick={() => {
                                            this.setState({
                                                manageGoalsDialogShown: true
                                            })
                                        }}>
                                            <i className="fa fa-pencil"></i>
                                        </button>
                                    </div>
                                }
                            </div>
                        }
                        
                        {
                            this.state.loading &&
                            <div className="text-center">
                                <i className="fa fa-spin fa-spinner"></i>
                            </div>
                        }
                    </div>
                </div>

                <div className={`modal ${this.state.manageGoalsDialogShown ? 'shown' : ''}`} role="dialog" tabIndex="1">
                    <div className="modal-dialog shadow-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="modal-title mb-0">
                                    Manage Goals
                                </h3>
                            </div>
                            <div className="modal-body">
                                {
                                    this.state.muscleGroups.map((group, key) => {
                                        return(
                                            <div className="form-group" key={key}>
                                                <label>{group.title} { group.duration > 0 && `- ${humanizeDuration(group.duration * 60000, {delimiter: ' '})}`}</label>
                                                <input 
                                                    type="range" 
                                                    step="5"
                                                    min="0"
                                                    max="180"
                                                    value={group.duration}
                                                    onChange={(e) => {
                                                        let groups = this.state.muscleGroups.slice()
                                                        groups.forEach(muscleGroup => {
                                                            if(muscleGroup.id === group.id) {
                                                                muscleGroup.duration = e.target.value
                                                            }
                                                        })

                                                        this.setState({
                                                            muscleGroups: groups
                                                        })
                                                    }}
                                                    className="form-control"/>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="modal-footer">
                                <div className="d-flex justify-content-end">
                                    <button 
                                        className="btn btn-primary mr-1" 
                                        disabled={this.state.saving}
                                        onClick={() => this.saveGoals()}>
                                        Save
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => this.closeAndResetForm()}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Goals