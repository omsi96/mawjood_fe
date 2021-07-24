import React from 'react'
import { Route, Switch } from 'react-router'

// Components
import Home from '../components/Home'
import ClassView from '../components/ClassView'
import SubjectsGrid from '../components/SubjectsGrid/SubjectsGrid'
const Routes = () => {
  return (
    <Switch>
      <Route exact component={SubjectsGrid} path='/' />
      <Route component={Home} path='/subjects/:subjectsId' />
      <Route component={ClassView} path='/class/:classId' />
    </Switch>
  )
}

export default Routes
