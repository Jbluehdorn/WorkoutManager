import React, {Component} from 'react'
import API from '../../API'
import moment from 'moment'
import humanizeDuration from 'humanize-duration'

const DATE_FORMAT = 'YYYY-MM-DD'

class WorkoutLog extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: props.user,
            allWorkouts: null,
            userWorkouts: [],
            pages: [],
            currentPage: 0,
            perPage: 5,
            formShown: false,
            allMuscleGroups: null,
            saving: false,
            form: {
                duration: 60,
                muscle_group: undefined,
                notes: '',
                date: moment().format(DATE_FORMAT)
            }
        }

        this.handleClose = this.handleClose.bind(this)
        this.handleShowForm = this.handleShowForm.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    async loadWorkouts() {
        try {
            let workouts = await API.get('workouts')

            let userWorkouts = workouts.data.body.filter((workout) => {
                return workout.user_id === this.state.user.id
            })
            
            this.setState({
                allWorkouts: workouts.data.body,
                userWorkouts: userWorkouts
            })
        } catch(err) {
            console.log(err)
        }
    }

    async loadMuscleGroups() {
        try {
            let resp = await API.get('muscleGroups')
            let muscleGroups = resp.data.body

            let form = Object.assign({}, this.state.form)
            form.muscle_group = muscleGroups[0]

            this.setState({
                allMuscleGroups: muscleGroups,
                form: form
            })
        } catch(err) {
            console.log(err)
        }
    }

    async saveWorkout() {
        this.setState({ saving: true })

        try {
            let form = {
                duration: this.state.form.duration,
                user_id: this.state.user._id,
                muscle_group_id: this.state.form.muscle_group.id,
                notes: this.state.form.notes,
                date: this.state.form.date
            }

            let resp = await API.post('workouts', form)
            console.log(resp)

            this.handleClose()

            this.loadWorkouts()
        } catch(err) {
            console.log(err)
        }

        this.setState({ saving: false})
    }

    handleShowForm() {
        this.setState({ formShown: true})
    }

    handleClose() {
        this.setState({ formShown: false})
    }

    handleInputChange(event) {
        let value
        let name = event.target.name

        switch(event.target.type) {
            case 'number':
                value = parseInt(event.target.value)
                break
            case 'date':
                value = moment(event.target.value).format(DATE_FORMAT)
                break
            case 'select-one':
                value = this.state.allMuscleGroups.find((group) => {
                    console.log(group._id, event.target.value)
                    return group._id == event.target.value
                })
                break
            default:
                value = event.target.value
        }

        let form = Object.assign({}, this.state.form)
        form[name] = value

        this.setState({
            form: form
        })
    }

    render() {
        if(!!!this.state.allWorkouts)
            this.loadWorkouts()

        if(!!!this.state.allMuscleGroups)
            this.loadMuscleGroups()

        let workoutItems = this.state.userWorkouts.map((workout) => {
            return ( 
                <li className="list-group-item" key={workout._id}>
                    <span>{humanizeDuration(workout.duration * 60000, {delimiter: ' '})} of </span>
                    <strong>{workout.muscle_group.title}</strong>
                    <span> logged on </span>
                    <strong>{moment.utc(workout.date).format('dddd, MMMM Do')}</strong>

                    <i className="fa fa-trash pull-right mt-1"></i>
                </li> 
            )
        })

        return (
            <div>
                <div className="card">
                    <div className="card-header">
                        <h1 className="card-title m-0 d-inline">
                            Log
                        </h1>

                        <button className="btn btn-primary pull-right mt-2" onClick={this.handleShowForm}>
                            <i className="fa fa-plus"></i>
                        </button>
                    </div>
                    <div className="card-body">
                        <ul className="list-group">
                            {workoutItems}
                        </ul>
                    </div>
                </div>
                
                <div className={`modal ${this.state.formShown ? 'shown' : '' }`} role="dialog" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="modal-title">
                                    Log Workout
                                </div>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="duration">Duration (min)</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        name="duration"
                                        value={this.state.form.duration}
                                        onChange={this.handleInputChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="muscle_group">Muscle Group</label>
                                    <select 
                                        name="muscle_group" 
                                        className="form-control"
                                        onChange={this.handleInputChange}
                                    >
                                        { this.state.allMuscleGroups != null &&
                                            this.state.allMuscleGroups.map((muscle_group) => {
                                                return (
                                                    <option 
                                                        key={muscle_group._id} 
                                                        value={muscle_group._id}
                                                    >
                                                        {muscle_group.title}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="notes">Notes</label>
                                    <textarea 
                                        name="notes" 
                                        cols="30" 
                                        rows="2" 
                                        className="form-control"
                                        value={this.state.form.notes}
                                        onChange={this.handleInputChange}
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="date">Date</label>
                                    <input 
                                        type="date" 
                                        className="form-control"
                                        name="date"
                                        value={this.state.form.date}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" disabled={this.state.saving} onClick={this.handleClose}>Close</button>
                                <button className="btn btn-primary" disabled={this.state.saving} onClick={() => this.saveWorkout()}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default WorkoutLog