import React, { useEffect, useState } from 'react'
import axios from '../utils/axios'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import StudentList from './StudentList'
import ClassesList from './ClassesList'

const AntTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: '#1890ff',
  },
})(Tabs)

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$selected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />)

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: '#635ee7',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />)

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#fff',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />)

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  padding: {
    padding: theme.spacing(3),
  },
  demo1: {
    backgroundColor: theme.palette.background.paper,
  },
  demo2: {
    backgroundColor: '#2e1534',
  },
}))

export default function CustomizedTabs() {
  const classes = useStyles()
  const [subjectClasses, setSubjectClasses] = useState([])
  const [students, setStudents] = useState([])
  const [tabIndex, setTabIndex] = useState(0)
  const tabsViews = [
    <StudentList students={students} />,
    <ClassesList subjectClasses={subjectClasses} />,
  ]

  const handleChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  useEffect(() => {
    async function getAPIs() {
      try {
        const studentsResponse = await axios.get('/student')
        setStudents(studentsResponse.data)
        const classesResponse = await axios.get('/class')
        setSubjectClasses(classesResponse.data)
      } catch (error) {
        console.log('🚀 ~ file: index.js ~ line 56 ~ error', error)
      }
    }
    getAPIs()
    console.log('🚀 ~ file: index.js ~ line 34 ~ response', students)
    console.log('🚀 ~ file: index.js ~ line 34 ~ response', subjectClasses)
    return () => {
      setStudents([])
      setSubjectClasses([])
    }
  }, [])

  return (
    <div className={classes.root}>
      <div className={classes.demo1}>
        <AntTabs
          value={tabIndex}
          onChange={handleChange}
          aria-label='ant example'>
          <AntTab label='Students' />
          <AntTab label='Classes' />
        </AntTabs>
        <Typography className={classes.padding} />
      </div>
      {tabsViews[tabIndex]}
    </div>
  )
}
