import { useState } from 'react';

// material-ui imports
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';

// local imports
import TableHeader from './Header';
import TableBody from './Body';

export const border = '1px solid #A9A9A9';

const EnhancedTable = (props) => {
    const {
        search, columns, rows, onDelete, onEdit, indexing
    } = props;

    const isDeleteCol = onDelete ? true : false;
    const isEditCol = onEdit ? true : false;

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(indexing ? '#' : columns[0].id);
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

    return (
        <Box>
            <Paper sx={{
                border: border,
                boxShadow: 'none',
            }}>
                <TableContainer>
                    <Table>
                        <TableHeader
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            columns={columns}
                            isDeleteCol={isDeleteCol}
                            isEditCol={isEditCol}
                            indexing={indexing}
                        />
                        
                        <TableBody
                            search={search}
                            columns={columns}
                            rows={rows}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            indexing={indexing}
                            order={order}
                            orderBy={orderBy}
                            page={page}
                            rowsPerPage={rowsPerPage}
                        />
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
        </Box>
    );
};

export default EnhancedTable;
