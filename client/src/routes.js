// Player imports
import Goals from './app/components/player/Goals'

// Coach imports
import Reports from './app/components/coach/Reports'

const PlayerRoutes = [
    {
        path: '/goals',
        component: Goals
    },
    {
        path: '/',
        redirect: '/goals',
        exact: true,
        hideMenuItem: true
    }
]

const CoachRoutes = [
    {
        path: '/reports',
        component: Reports
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