import { Box, Button } from '@material-ui/core'
import React from 'react'

const AttendanceModal = () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      minHeight='100vh'>
      <img
        src='https://www.qr-code-generator.com/wp-content/themes/qr/new_structure/markets/core_market_full/generator/dist/generator/assets/images/websiteQRCode_noFrame.png'
        width='50%'
      />
      {/* <Button
        style={{ textTransform: 'none' }}
        variant='contained'
        color='primary'>
        Take Attendance
      </Button> */}
    </Box>
  )
}

export default AttendanceModal
