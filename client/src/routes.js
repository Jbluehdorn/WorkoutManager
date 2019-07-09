// Player imports
import PlayerGoals from './app/pages/player/Goals'
import Workouts from './app/pages/player/Workouts'

// Coach imports
import Reports from './app/pages/coach/Reports'
import Players from './app/pages/coach/Players'
import CoachGoals from './app/pages/coach/Goals'

const PlayerRoutes = [
    {
        name: 'Home',
        path: '/home',
        icon: 'home',
        component: PlayerGoals
    },
    {
        name: 'Workouts',
        path: '/workouts',
        icon: 'heartbeat',
        component: Workouts
    },
    {
        path: '/',
        redirect: '/home',
        exact: true,
        hideMenuItem: true
    }
]

const CoachRoutes = [
    {
        name: 'Reports',
        icon: 'bar-chart',
        path: '/reports',
        component: Reports
    },
    {
        name: 'Players',
        icon: 'users',
        path: '/players',
        component: Players
    },
    {
        name: 'Goals',
        icon: 'crosshairs',
        path: '/goals',
        component: CoachGoals
    },
    {
        path: '/',
        redirect: '/reports',
        exact: true,
        hideMenuItem: true
    }
]

export {
    PlayerRoutes,
    CoachRoutes
}