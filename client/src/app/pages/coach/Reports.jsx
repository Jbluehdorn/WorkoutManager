import React, { Component } from 'react'
import API from '../../../API'
import {Bar} from 'react-chartjs-2'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)

const GRANULARITIES = [
    {
        title: 'This Week',
        range: moment().range(moment().startOf('week').add(1, 'day'), moment().endOf('week').add(1, 'day'))
    },
    {
        title: 'This Month',
        range: moment().range(moment().startOf('month'), moment().endOf('month'))
    },
    {
        title: 'All Time',
        range: moment().range()
    }
]

// Total, Average, 
const AVAILABLE_METHODS = [
     {
        title: 'Total',
        calculate: arr => {
            let total = 0

            arr.forEach(el => {
                total += el
            })

            return total
        }
    },
    {
        title: 'Average',
        calculate: (arr, n) => {
            let total = 0

            arr.forEach(el => {
                total += el
            })

            return total !== 0 ? Math.round((total / n) * 100) / 100 : 0
        }
    }
]

class Reports extends Component {
    constructor(props) {
        super(props)

        this.state = {
            granularity: GRANULARITIES[0],
            muscleGroups: [],
            allWorkouts: [],
            filteredWorkouts: [],
            methodPredicate: AVAILABLE_METHODS[0],
            players: [],
            positionGroups: [],
            positionGroupPredicate: undefined
        }
    }
    
    componentDidMount() {
        this.loadMuscleGroups()
        this.loadWorkouts()
        this.loadPlayers()
        this.loadPositionGroups()
    }

    componentDidUpdate(prevProps, prevState) {
        let state = this.state

        if(prevState.allWorkouts !== state.allWorkouts ||
            prevState.granularity !== state.granularity ||
            prevState.positionGroupPredicate !== state.positionGroupPredicate) {
            this.filter()
        }
    }

    async loadPositionGroups() {
        try {
            let resp = await API.get(`positionGroups`)
            let groups = resp.data.body

            this.setState({
                positionGroups: groups
            })
        } catch(err) {
            console.log(err)
        }
    }

    async loadPlayers() {
        try {
            let resp = await API.get(`users?type=players`)
            let players = resp.data.body
            
            this.setState({
                players: players
            })
        } catch(err) {
            console.log(err)
        }
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

    async loadWorkouts() {
        try {
            let resp = await API.get(`workouts`)
            let workouts = resp.data.body

            this.setState({
                allWorkouts: workouts
            })
        } catch(err) {
            console.log(err)
        }
    }

    filter() {
        let workouts = this.state.allWorkouts.slice()
        workouts = this.filterByGranularity(workouts)
        workouts = this.filterByPositionGroup(workouts)

        this.setState({
            filteredWorkouts: workouts
        })
    }

    filterByGranularity(workouts) {
        let workoutsClone = workouts.slice()
        return workoutsClone.filter(workout => {
            let temp = new Date(workout.date)
            let tempDate = moment([temp.getUTCFullYear(), temp.getUTCMonth(), temp.getUTCDate()])
            return this.state.granularity.range.contains(tempDate, {exclusive: false})
        })
    }

    filterByPositionGroup(workouts) {
        let workoutsClone = workouts.slice()
        return !!this.state.positionGroupPredicate ? workoutsClone.filter(workout => {
            return workout.user.group_id === this.state.positionGroupPredicate.id
        }) : workoutsClone
    }

    getFilteredPlayerCount() {
        let workouts = this.state.filteredWorkouts.slice()
        let players = this.state.players.slice()

        return (players.reduce((total, player) => {
            return !!workouts.find(workout => {
                return player._id === workout.user_id
            }) ? total + 1 : total
        }, 0))
    }

    render() {
        let muscleGroups = this.state.muscleGroups.slice()
        let workouts = this.state.filteredWorkouts.slice()

        let workoutsByGroup = muscleGroups.map(group => {
            return workouts.filter(workout => {
                return workout.muscle_group_id === group.id
            }).map(group => {
                return Math.floor((group.duration / 60) * 100) / 100
            })
        })

        let dataItems = workoutsByGroup.map(group => {
            return this.state.methodPredicate.calculate(group, this.getFilteredPlayerCount())
        })

        let data = {
            labels: muscleGroups.map(group => {
                return group.title
            }),
            datasets: [
                {
                    label: 'Hours',
                    backgroundColor: 'rgba(51, 0, 111,0.6)',
                    borderColor: 'rgba(51, 0, 111, 1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(51, 0, 111,0.8)',
                    hoverBorderColor: 'rgba(51, 0, 111,1)',
                    data: dataItems
                }
            ]
        }

        return (
            <div className="card">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <h1 className="card-title mb-0">Reports</h1>
                        <div className="form-group m-0">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <label className="input-group-text">
                                        <i className="fa fa-calendar"></i>
                                    </label>
                                </div>
                                <select className="custom-select" onChange={(e) => {
                                    let granularity = GRANULARITIES.find(gran => gran.title === e.target.value)

                                    this.setState({
                                        granularity: granularity
                                    })
                                }}>
                                    {
                                        GRANULARITIES.map((granularity, key) => {
                                            return (
                                                <option value={granularity.title} key={key}>
                                                    {granularity.title}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <div>
                        { dataItems.length > 0 &&
                            <Bar
                                data={data}
                                width={100}
                                height={200}
                                options={{
                                    maintainAspectRatio: false,
                                    scales: {
                                        yAxes: [{
                                            ticks: {
                                                beginAtZero: true
                                            }
                                        }]
                                    }
                                }}
                            />
                        }
                    </div>

                    <div className="d-flex">
                        <div className="form-group mr-1 mb-0">
                            <select 
                                className="form-control"
                                value={this.state.positionGroupPredicate ? this.state.positionGroupPredicate.id : undefined}
                                onChange={(e) => {
                                    let group = this.state.positionGroups.find(group => group.id === parseInt(e.target.value))

                                    this.setState({
                                        positionGroupPredicate: !!group ? group : undefined
                                    })
                                }}>
                                <option value={-1}>All Positions</option>
                                {
                                    this.state.positionGroups.map((group, key) => {
                                        return(
                                            <option value={group.id} key={key}>
                                                {group.title}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="form-group mb-0">
                            <select 
                                className="form-control" 
                                value={this.state.methodPredicate.title} 
                                onChange={e => {
                                    let method = AVAILABLE_METHODS.find(available => available.title === e.target.value)

                                    this.setState({
                                        methodPredicate: method
                                    })
                                }}>
                                {
                                    AVAILABLE_METHODS.map((method, key) => {
                                        return (
                                            <option value={method.title} key={key}>
                                                {method.title}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Reports