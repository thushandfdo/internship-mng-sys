import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui imports
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

// local imports
import Confirm from '../Confirm/Confirm';

const border = '1px solid #A9A9A9';

const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
};

const getComparator = (order, orderBy) => {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
};

const EnhancedTableHead = (props) => {
    const { order, orderBy, onRequestSort, columns, isDeleteCol, indexing } = props;

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {
                    indexing && (
                        <TableCell
                            sortDirection={orderBy === '#' ? order : false}
                            sx={{
                                borderRight: border,
                                borderBottom: border,
                                padding: '8px'
                            }}
                        >
                            <Stack
                                direction='row'
                                alignItems='center'
                                justifyContent='center'
                                onClick={createSortHandler('#')}
                                sx={{ cursor: 'pointer' }}
                            >
                                {orderBy === '#' && <TableSortLabel
                                    active={orderBy === '#'}
                                    direction={orderBy === '#' ? order : 'asc'}
                                />}
                                <Typography align='center' sx={{ flexGrow: 1, padding: `0 ${orderBy === '#' ? '0' : '10px'}` }}>
                                    <b>#</b>
                                </Typography>
                            </Stack>
                        </TableCell>
                    )
                }
                {columns.map((column, index) => (
                    <TableCell
                        key={column.id}
                        sortDirection={orderBy === column.id ? order : false}
                        sx={{
                            borderRight: `${((index !== columns.length - 1) && !isDeleteCol) ? border : 'none'}`,
                            borderBottom: border,
                            padding: '8px'
                        }}
                    >
                        <Stack
                            direction='row'
                            alignItems='center'
                            justifyContent='center'
                            onClick={createSortHandler(column.id)}
                            sx={{ cursor: 'pointer' }}
                        >
                            {orderBy === column.id && <TableSortLabel
                                active={orderBy === column.id}
                                direction={orderBy === column.id ? order : 'asc'}
                            />}
                            <Typography align='center' sx={{ flexGrow: 1, padding: `0 ${orderBy === column.id ? '0' : '10px'}` }}>
                                <b>{column.label}</b>
                            </Typography>
                        </Stack>
                    </TableCell>
                ))}
                {
                    isDeleteCol && (
                        <TableCell
                            sx={{
                                borderRight: 'none',
                                borderBottom: border
                            }}
                        >
                            <Typography align='center' sx={{ flexGrow: 1 }}>
                                <b>Delete</b>
                            </Typography>
                        </TableCell>
                    )
                }
            </TableRow>
        </TableHead>
    );
};

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        })
    ).isRequired,
    isDeleteCol: PropTypes.bool,
    indexing: PropTypes.bool,
};

const EnhancedTable = ({ search, columns, rows, isDeleteCol, onDelete, indexing }) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(indexing ? '#' : columns[0].id);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [isConfirmOpened, setIsConfirmOpened] = useState(false);
    const [rowIdToDelete, setRowIdToDelete] = useState(null);

    const handleRequestSort = (_event_, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (_event_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDelete = () => {
        onDelete(rowIdToDelete);

        const index = rows.findIndex(record => record.id === rowIdToDelete);
        if (index >= 0) rows.splice(index, 1);

        setIsConfirmOpened(false);
    };

    return (
        <Box>
            <Paper sx={{
                border: border,
                boxShadow: 'none',
            }}>
                <TableContainer>
                    <Table>
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            columns={columns}
                            isDeleteCol={isDeleteCol}
                            indexing={indexing}
                        />
                        <TableBody sx={{
                            '& .MuiTableCell-root': {
                                borderBottom: border,
                            },
                        }}>
                            {rows.length > 0 ? (
                                stableSort(rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .filter((row) =>
                                        columns.some((column) => row[column.id]?.toLowerCase().includes(search.toLowerCase()))
                                    )
                                    .map((row, index) => (
                                        <TableRow tabIndex={-1} key={index}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: '#f0f0f0',
                                                },
                                                backgroundColor: `${(index % 2 === 0) ? '#f5f5f5' : 'white'}`,
                                            }}
                                        >
                                            {
                                                indexing && (
                                                    <TableCell
                                                        align="center"
                                                        sx={{
                                                            borderRight: border,
                                                        }}
                                                        size='small'
                                                    >
                                                        {index + 1}
                                                    </TableCell>
                                                )
                                            }
                                            {columns.map((column, index) => (
                                                <TableCell
                                                    key={index}
                                                    align="center"
                                                    sx={{
                                                        borderRight: `${((index !== columns.length - 1) && !isDeleteCol) ? border : 'none'}`,
                                                    }}
                                                    size='small'
                                                >
                                                    {(column.id.toLowerCase().includes('link')) ? (
                                                        <a href={row[column.id]} target="_blank" rel="noreferrer">{row[column.id]}</a>
                                                    ) : row[column.id]}
                                                </TableCell>
                                            ))}
                                            {
                                                isDeleteCol && (
                                                    <TableCell
                                                        align="center"
                                                        sx={{
                                                            borderRight: border,
                                                        }}
                                                        size='small'
                                                    >
                                                        <IconButton
                                                            onClick={() => {
                                                                setIsConfirmOpened(true);
                                                                setRowIdToDelete(row.id);
                                                            }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                )
                                            }
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow tabIndex={-1}>
                                    <TableCell align="center" colSpan={columns.length} sx={{ color: 'gray', fontSize: '18px' }}>
                                        Table is empty...!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        '& .MuiToolbar-root': {
                            padding: '0',
                            margin: '0',
                            minHeight: '0',
                        },
                    }}
                />
            </Paper>

            <Confirm
                state={{ isConfirmOpened, setIsConfirmOpened }}
                onYesClick={handleDelete}
            />
        </Box>
    );
};

export default EnhancedTable;
