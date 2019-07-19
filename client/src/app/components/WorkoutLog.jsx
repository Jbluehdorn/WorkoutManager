import React, {Component} from 'react'
import API from '../../API'
import moment from 'moment'
import humanizeDuration from 'humanize-duration'

const DATE_FORMAT = 'YYYY-MM-DD'

class WorkoutLog extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: props.player,
            userWorkouts: props.workouts,
            pages: [],
            page: 0,
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

    componentDidUpdate(prevProps) {
        if(this.props.workouts !== prevProps.workouts) {
            let workouts = this.props.workouts
            let pages = this.paginateWorkouts(workouts)
            this.setState({
                userWorkouts: workouts,
                pages: pages
            })
        }
    }

    componentDidMount() {
        this.loadMuscleGroups()
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

            await API.post('workouts', form)

            this.handleClose()

            this.props.onChange()
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

    incrementPage() {
        if(this.state.page >= 0 && this.state.page < this.state.pages.length - 1) {
            this.setState({
                page: this.state.page + 1
            })
        }
    }

    decrementPage() {
        if(this.state.page < this.state.pages.length && this.state.page > 0) {
            this.setState({
                page: this.state.page - 1
            })
        }
    }

    goToPage(page) {
        this.setState({
            page: page
        })
    }

    paginateWorkouts(workouts) {
        let cursor = 0
        let pages = []
        let perPage = this.state.perPage

        do {
            let start = cursor * perPage
            let end = start + perPage
            let page = workouts.slice(start, end)
            if(page.length > 0)
                pages.push(page)
            cursor++
        } while(cursor < Math.floor(workouts.length / perPage) + 1)

        return pages
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
                    return group._id === event.target.value
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

    async deleteWorkout(workoutID) {
        try {
            await API.delete(`workouts/${workoutID}`)

            this.props.onChange()
        } catch(err) {
            console.log(err)
        }
    }

    render() {
        let page = this.state.pages[this.state.page] 

        let workoutItems = !!page ? page.map((workout) => {
            return ( 
                <li className="list-group-item" key={workout._id}>
                    <span>{humanizeDuration(workout.duration * 60000, {delimiter: ' '})} of </span>
                    <strong>{workout.muscle_group.title}</strong>
                    <span> logged on </span>
                    <strong>{moment.utc(workout.date).format('dddd, MMMM Do')}</strong>

                    <i className="fa fa-trash pull-right mt-1 clickable" onClick={() => this.deleteWorkout(workout._id)}></i>
                </li> 
            )
        }) : [<li className="list-group-item" key={-1}>There's nothing here</li>];

        return (
            <div>
                <div className="card">
                    <div className="card-header">
                        <div className="d-flex justify-content-between">
                            <h1 className="card-title m-0 d-inline-block">
                                Log
                            </h1>

                            <button className="btn btn-primary text-right d-inline align-text-bottom" onClick={this.handleShowForm}>
                                <i className="fa fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        <ul className="list-group">
                            {workoutItems}
                        </ul>
                        
                        <ul className="pagination justify-content-center mt-1">
                            <li className={`page-item ${this.state.page === 0 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => this.decrementPage()}>
                                    {'<<'}
                                </button>
                            </li>
                            {
                                this.state.pages.map((page, key) => {
                                    return(
                                        <li className={`page-item ${this.state.page === key ? 'disabled' : ''}`} key={key}>
                                            <button className="page-link" onClick={() => this.goToPage(key)}>
                                                {key + 1}
                                            </button>
                                        </li>
                                    )
                                })
                            }
                            <li className={`page-item ${this.state.page === this.state.pages.length - 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => this.incrementPage()}>
                                    {'>>'}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                
                {/* FORM MODAL */}
                <div className={`modal ${this.state.formShown ? 'shown' : '' }`} role="dialog" tabIndex="-1">
                    <div className="modal-dialog shadow-lg">
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