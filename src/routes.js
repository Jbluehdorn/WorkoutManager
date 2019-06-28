import App from './App'
import Home from './components/Home'
import Todos from './components/Todos'

const Routes = [
    {
        path: '/',
        exact: true,
        component: Home
    },
    {
        path: '/todos',
        component: Todos
    }
]

export default Routes