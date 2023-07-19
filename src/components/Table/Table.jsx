// import React, { useState } from 'react';
// import PropTypes from 'prop-types';

// // material-ui imports
// import Box from '@mui/material/Box';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';
// import TableSortLabel from '@mui/material/TableSortLabel';
// import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
// import { visuallyHidden } from '@mui/utils';



// function descendingComparator(a, b, orderBy) {
//     if (b[orderBy] < a[orderBy]) {
//         return -1;
//     }
//     if (b[orderBy] > a[orderBy]) {
//         return 1;
//     }
//     return 0;
// }

// function getComparator(order, orderBy) {
//     return order === 'desc'
//         ? (a, b) => descendingComparator(a, b, orderBy)
//         : (a, b) => -descendingComparator(a, b, orderBy);
// }


// function stableSort(array, comparator) {
//     const stabilizedThis = array.map((el, index) => [el, index]);
//     stabilizedThis.sort((a, b) => {
//         const order = comparator(a[0], b[0]);
//         if (order !== 0) {
//             return order;
//         }
//         return a[1] - b[1];
//     });
//     return stabilizedThis.map((el) => el[0]);
// }

// // const headCells = [
// //     {
// //         id: 'project',
// //         label: 'Project',
// //     },
// //     {
// //         id: 'customer',
// //         label: 'Customer',
// //     },
// //     {
// //         id: 'amount',
// //         label: 'Amount',
// //     },
// //     {
// //         id: 'date',
// //         label: 'Date',
// //     },
// // ];

// function EnhancedTableHead(props) {
//     const { order, orderBy, onRequestSort,headCells } = props;

//     const createSortHandler = (property) => (event) => {
//         onRequestSort(event, property);
//     };

//     return (
//         <TableHead>
//             <TableRow>
//                 {headCells.map((headCell, index) => (
//                     <TableCell
//                         key={headCell.id}
//                         sortDirection={orderBy === headCell.id ? order : false}
//                         sx={{ borderRight: `${index !== headCells.length - 1 ? '1px solid black' : 'none'}`, borderBottom: '1px solid black' }}
//                     >
//                         <TableSortLabel
//                             active={orderBy === headCell.id}
//                             direction={orderBy === headCell.id ? order : 'asc'}
//                             onClick={createSortHandler(headCell.id)}
//                             sx={{ width: '100%' }}
//                         >
//                             <Typography align='center' sx={{ flexGrow: 1 }}>
//                                 <b>{headCell.label}</b>
//                                 {orderBy === headCell.id ? (
//                                     <Box component="span" sx={visuallyHidden}>
//                                         {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
//                                     </Box>
//                                 ) : null}
//                             </Typography>
//                         </TableSortLabel>
//                     </TableCell>
//                 ))}
//             </TableRow>
//         </TableHead>
//     );
// }

// EnhancedTableHead.propTypes = {
//     onRequestSort: PropTypes.func.isRequired,
//     order: PropTypes.oneOf(['asc', 'desc']).isRequired,
//     orderBy: PropTypes.string.isRequired,
//     headCells:PropTypes.object.isRequired,
// };

// export default function EnhancedTable({ search ,headCells ,rows }) {
//     const [order, setOrder] = useState('asc');
//     const [orderBy, setOrderBy] = useState('name');
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);


//     const handleRequestSort = (_event_, property) => {
//         const isAsc = orderBy === property && order === 'asc';
//         setOrder(isAsc ? 'desc' : 'asc');
//         setOrderBy(property);
//     };

//     const handleChangePage = (_event_, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };


//     return (
//         <Box sx={{ width: '100%' }}>
//             <Paper sx={{ width: '100%', mb: 2, border: '1px solid black' }}>
//                 <TableContainer>
//                     <Table>
//                         <EnhancedTableHead
//                             order={order}
//                             orderBy={orderBy}
//                             onRequestSort={handleRequestSort}
//                             headCells={headCells}
//                         />
//                         <TableBody>
//                             {rows.length > 0
//                                 ?
//                                 stableSort(rows, getComparator(order, orderBy))
//                                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                                     .filter(row =>
//                                         (category === 'Project')
//                                             ? row.project.name.toLowerCase().includes(search.toLowerCase())
//                                             : (category === 'Customer')
//                                                 ? row.project.customer.company.toLowerCase().includes(search.toLowerCase())
//                                                 : (category === 'Date')
//                                                     ? row.date.toString().includes(search.toLowerCase())
//                                                     : true
//                                     )
//                                     .map((row) => {
//                                         return (
//                                             <TableRow
//                                                 hover
//                                                 tabIndex={-1}
//                                                 key={row.paymentId}
//                                             >
//                                                 <TableCell align="center" sx={{ borderRight: '1px solid black' }} size='small'>{row.project.name}</TableCell>
//                                                 <TableCell align="center" sx={{ borderRight: '1px solid black' }} size='small'>{row.project.customer.company}</TableCell>
//                                                 <TableCell align="center" sx={{ borderRight: '1px solid black' }} size='small'>{row.amount}</TableCell>
//                                                 <TableCell align="center" sx={{}} size='small'>{formatDate(row.date)}</TableCell>
//                                             </TableRow>
//                                         );
//                                     })
//                                 :
//                                 <TableRow tabIndex={-1}>
//                                     <TableCell align="center" colSpan={4} sx={{ color: 'gray', fontSize: '18px' }}>Table is empty...!</TableCell>
//                                 </TableRow>
//                             }
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//                 <TablePagination
//                     rowsPerPageOptions={[10, 25, 50]}
//                     component="div"
//                     count={rows.length}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                     sx={{ borderTop: '1px solid black' }}
//                 />
//             </Paper>
//         </Box>
//     );
// }

import React, { useState } from 'react';
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
import { visuallyHidden } from '@mui/utils';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort, columns } = props;

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {columns.map((column, index) => (
                    <TableCell
                        key={column.id}
                        sortDirection={orderBy === column.id ? order : false}
                        sx={{
                            borderRight: `${index !== columns.length - 1 ? '1px solid black' : 'none'}`,
                            borderBottom: '1px solid black'
                        }}
                    >
                        <TableSortLabel
                            active={orderBy === column.id}
                            direction={orderBy === column.id ? order : 'asc'}
                            onClick={createSortHandler(column.id)}
                            sx={{ width: '100%' }}
                        >
                            <Typography align='center' sx={{ flexGrow: 1 }}>
                                <b>{column.label}</b>
                                {orderBy === column.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </Typography>
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        })
    ).isRequired
};

export default function EnhancedTable({ search, columns, rows }) {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(columns[0].id);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('sv-SE');
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2, border: '1px solid black' }}>
                <TableContainer>
                    <Table>
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            columns={columns}
                        />
                        <TableBody>
                            {rows.length > 0 ? (
                                stableSort(rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .filter((row) =>
                                        columns.some((column) => row[column.id].toLowerCase().includes(search.toLowerCase()))
                                    )
                                    .map((row, index) => (
                                        <TableRow hover tabIndex={-1} key={index}>
                                            {columns.map((column, index) => (
                                                <TableCell
                                                    key={index}
                                                    align="center"
                                                    sx={{ borderRight: `${index !== columns.length - 1 ? '1px solid black' : 'none'}` }}
                                                    size='small'
                                                >
                                                    {row[column.id]}
                                                </TableCell>
                                            ))}
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
                    sx={{ borderTop: '1px solid black' }}
                />
            </Paper>
        </Box>
    );
}
