import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { lighten, makeStyles } from '@material-ui/core/styles'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Button,
  IconButton,
  Tooltip,
  FormControlLabel,
  Checkbox,
  Box,
  Dialog,
  DialogContent,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import FilterListIcon from '@material-ui/icons/FilterList'
import { useHistory, useParams } from 'react-router-dom'
import AttendanceModal from './AttendanceModal'
import axios from '../../utils/axios'

function createData(name, attended) {
  return { name, attended }
}

const rows1 = [createData('Rahaf Alenezi'), createData('Omar Alibrahim')]

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'attended', numeric: true, disablePadding: false, label: 'Attended' },
]

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
}

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}))

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles()
  const { numSelected } = props

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}>
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color='inherit'
          variant='subtitle1'
          component='div'>
          {numSelected} selected
        </Typography>
      ) : (
        <>
          <Typography
            className={classes.title}
            variant='h6'
            id='tableTitle'
            component='div'>
            Class ID or Title
          </Typography>
        </>
      )}

      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton aria-label='delete'>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title='Filter list'>
          <IconButton aria-label='filter list'>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}))

export default function ClassView() {
  const { classId } = useParams()
  console.log('🚀 ~ file: index.js ~ line 217 ~ ClassView ~ id', classId)
  const [students, setStudents] = useState([])
  const history = useHistory()
  const classes = useStyles()
  let initialCheckedValues = {}
  const rows = rows1
  rows.length > 0 && rows.map((row) => (initialCheckedValues[row.id] = false))
  const [checked, setChecked] = React.useState(initialCheckedValues)

  const [open, setOpen] = React.useState(false)
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('calories')
  const [selected, setSelected] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChange = async (event) => {
    console.log(
      '🚀 ~ file: index.js ~ line 241 ~ handleChange ~ event',

      event.target.id
    )

    setChecked({ ...checked, [event.target.id]: event.target.checked })

    try {
      const response = await axios.post('/attendance', {
        studentId: event.target.id,
        classId,
      })
    } catch (error) {
      console.log(
        '🚀 ~ file: index.js ~ line 287 ~ handleChange ~ error',
        error
      )
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  //   post('/createsession')

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
        createSessionResponse
      )
    } catch (error) {
      console.log(
        '🚀 ~ file: index.js ~ line 302 ~ handleStartSession ~ error',
        error
      )
    }

    // handleClickOpen({
    //   classSecret: createSessionResponse.data.session.createSessionResponse,
    //   classId,
    //   sessionId: id.createSessionResponse.data.session,
    // })
  }

  useEffect(() => {
    async function getAPIs() {
      try {
        const studentsResponse = await axios.get('/attendance')
        setStudents(studentsResponse.data)
        console.log(
          '🚀 ~ file: index.js ~ line 34 ~ response',
          studentsResponse.data
        )
      } catch (error) {
        console.log('🚀 ~ file: index.js ~ line 56 ~ error', error)
      }
      //
      try {
        const studentsResponse = await axios.get('/student')
        // const attendance =
        setStudents(studentsResponse.data)
        console.log(
          '🚀 ~ file: index.js ~ line 34 ~ response',
          studentsResponse.data
        )
      } catch (error) {
        console.log('🚀 ~ file: index.js ~ line 309 ~ getAPIs ~ error', error)
        console.log('🚀 ~ file: index.js ~ line 56 ~ error', error)
      }
    }
    getAPIs()
    return () => {
      setStudents([])
    }
  }, [])

  const isSelected = (name) => selected.indexOf(name) !== -1

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)

  return (
    rows1.length > 0 && (
      <div className={classes.root}>
        <Dialog maxWidth='sm' fullWidth open={open} onClose={handleClose}>
          <DialogContent>
            <AttendanceModal classId={classId} closeModal={handleClose} />
          </DialogContent>
        </Dialog>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <Box ml={2}>
            <Button
              onClick={handleClickOpen}
              style={{ textTransform: 'none' }}
              variant='contained'
              color='primary'>
              Open Session
            </Button>
          </Box>
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby='tableTitle'
              size={dense ? 'small' : 'medium'}
              aria-label='enhanced table'>
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                //   onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />

              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name)
                    const labelId = `enhanced-table-checkbox-${index}`

                    return (
                      <TableRow
                        hover
                        //   onClick={(event) => handleClick(event, row.name)}
                        role='checkbox'
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}>
                        <TableCell padding='checkbox'>
                          {/* <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        /> */}
                        </TableCell>
                        <TableCell
                          component='th'
                          id={labelId}
                          scope='row'
                          padding='none'>
                          {row.name}
                        </TableCell>
                        <TableCell align='center'>
                          {' '}
                          <Checkbox
                            id={`${row.id}`}
                            checked={checked[row.id] || false}
                            onChange={handleChange}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    )
  )
}
