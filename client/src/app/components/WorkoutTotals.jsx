import React, {Component} from 'react'
import API from '../../API'
import {Bar} from 'react-chartjs-2'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)

const GRANULARITIES = [
    {
        title: 'This Week',
        range: moment().range(moment().utc().startOf('week').add(1, 'day'), moment().utc().endOf('week').add(1, 'day'))
    },
    {
        title: 'This Month',
        range: moment().range(moment().utc().startOf('month'), moment().utc().endOf('month'))
    },
    {
        title: 'All Time',
        range: moment().range()
    }
]

class Totals extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: props.user,
            userWorkouts: props.workouts,
            muscleGroups: [],
            granularity: GRANULARITIES[0]
        }

        this.handleSelectChange = this.handleSelectChange.bind(this)
    }

    componentDidMount() {
        this.loadMuscleGroups()
    }

    componentDidUpdate(prevProps) {
        if(prevProps !== this.props) {
            this.setState({
                userWorkouts: this.props.workouts
            })
        }
    }

    async loadMuscleGroups() {
        try {
           let resp = await API.get('muscleGroups') 
           let muscleGroups = resp.data.body.map(group => {
               return Object.assign({duration: 0}, group)
           })

           this.setState({
               muscleGroups: muscleGroups
           })
        } catch(err) {
            console.log(err)
        }
    }

    handleSelectChange(e) {
        let granularity = GRANULARITIES.find(gran => gran.title === e.target.value)

        this.setState({
            granularity: granularity
        })
    }

    render() {
        let muscleGroups = this.state.muscleGroups.map(group => {
            let groupClone = Object.assign({}, group)

            this.state.userWorkouts.forEach(workout => {
                if(this.state.granularity.range.contains(moment(workout.date), {exclusive: false}) && group.id === workout.muscle_group_id) {
                    groupClone.duration += workout.duration
                }
            })

            return groupClone
        })

        let dataItems = muscleGroups.map(group => {
            return Math.round((group.duration / 60) * 100) / 100
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
            <div className="card mb-1">
                <div className="card-header">
                    <div className="d-flex justify-content-between">
                        <h1 className="card-title m-0 d-inline-block">
                            Total
                        </h1>

                        <div className="d-inline-block">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <label className="input-group-text">
                                        <i className="fa fa-calendar"></i>
                                    </label>
                                </div>
                                <select className="custom-select" onChange={this.handleSelectChange}>
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
            </div>
        )
    }
}

export default Totals