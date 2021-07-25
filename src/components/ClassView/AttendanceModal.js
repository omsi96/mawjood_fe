import { Box, Button, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import axios from '../../utils/axios'

const AttendanceModal = ({ classId, closeModal }) => {
  const [students, setStudents] = useState([])
  const [session, setSession] = useState({
    classSecret: 0,
    classId: 0,
    sessionId: 0,
  })
  let classSecret, sessionId

  const handleSessionEnd = async (sessionId) => {
    try {
      const endSessionResponse = await axios.post(
        `/attendance/terminatesession/${sessionId}`
      )

      closeModal()
    } catch (error) {
      console.log(
        '🚀 ~ file: AttendanceModal.js ~ line 27 ~ handleSessionEnd ~ error',
        error
      )
    }
  }

  const socket = io('http://localhost:8001', {})

  useEffect(() => {
    socket.on('newStudent', (data) => {
      console.log(
        '🚀 ~ file: AttendanceModal.js ~ line 34 ~ socket.on ~ data',
        data
      )
      setStudents([...students, data.name])
    })
  }, [socket])

  useEffect(() => {
    const handleStartSession = async () => {
      try {
        const createSessionResponse = await axios.post(
          '/attendance/createsession',
          {
            classId,
          }
        )
        console.log(
          '🚀 ~ file: index.js ~ line 294 ~ handleStartSession ~ createSessionResponse',
          createSessionResponse.data
        )
        setSession({
          classSecret: createSessionResponse.data.session.classSecret,
          classId,
          sessionId: createSessionResponse.data.session.id,
        })
        classSecret = createSessionResponse.data.session.classSecret
        sessionId = createSessionResponse.data.session.id
        console.log(classSecret, classId, sessionId)
      } catch (error) {
        console.log(
          '🚀 ~ file: index.js ~ line 302 ~ handleStartSession ~ error',
          error
        )
      }
    }

    handleStartSession()

    return () => {
      handleSessionEnd(sessionId)
    }
  }, [])

  console.log(
    '🚀 ~ file: AttendanceModal.js ~ line 8 ~ AttendanceModal ~ students',
    students
  )

  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      height='520px'>
      <Typography variant='h1'>{session.classSecret}</Typography>
      <Box m={3}>
        <Typography variant='h5'>Type this class session ID</Typography>
      </Box>

      <Typography variant='p'>{students.join(', ')}</Typography>

      <Button
        onClick={() => handleSessionEnd(session.sessionId)}
        style={{ textTransform: 'none' }}
        variant='contained'
        color='secondary'>
        Turn off session
      </Button>
    </Box>
  )
}

export default AttendanceModal
