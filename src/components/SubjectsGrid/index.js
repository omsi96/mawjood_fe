import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Card } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    borderRadius: 23,
  },
})

const SubjectCard = ({ title, subtitle, color, numberOfStudents = 0 }) => {
  const classes = useStyles()

  return (
    <Box m={2}>
      <Card className={classes.root}>
        {/* <CardActionArea> */}
        {/* <CardContent> */}
        <Box
          bgcolor={color}
          height={110}
          px={5}
          py={2}
          width={450}
          color='white'>
          <Typography gutterBottom variant='h4' component='h2'>
            {title}
          </Typography>
          <Box my={-2}>
            <Typography variant='h6' component='p'>
              {subtitle}
            </Typography>
          </Box>
        </Box>

        <Box bgcolor='white' height={120} m={-5} width={450} color='white' />
        <Box px={5} mt={-12} pb={4}>
          <Typography variant='body4' color='secondary' component='p'>
            {numberOfStudents} students
          </Typography>
        </Box>
      </Card>
    </Box>
  )
}

export default SubjectCard
