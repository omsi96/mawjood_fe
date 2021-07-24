import React, { useEffect, useState } from 'react'
import axios from '../../utils/axios'
import SubjectCard from '.'
import { Link as RouterLink } from 'react-router-dom'
import {
  Grid,
  Card,
  CardMedia,
  Link,
  Typography,
  colors,
  makeStyles,
} from '@material-ui/core'

const SubjectsGrid = () => {
  const [spacing, setSpacing] = React.useState(2)
  const classes = useStyles()

  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    async function getSubjects() {
      try {
        const response = await axios.get('/subject')
        setSubjects(response.data)
      } catch (error) {
        console.log('🚀 ~ file: index.js ~ line 56 ~ error', error)
      }
    }
    getSubjects()
    return () => {
      setSubjects([])
    }
  }, [])

  const handleChange = (event) => {
    setSpacing(Number(event.target.value))
  }

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justifyContent='center' spacing={spacing}>
          {subjects.map((value) => (
            <Link
              key={value.id}
              style={{ textDecoration: 'none' }}
              color='textPrimary'
              component={RouterLink}
              to={`/subjects/${value.id}`}
              variant='h5'>
              <Grid key={value.id} item>
                <SubjectCard
                  key={value.id}
                  title={value.title}
                  subtitle={value.subtitle}
                  color='#8F4CB8'
                />
              </Grid>
            </Link>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default SubjectsGrid

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}))
