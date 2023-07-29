import { useState, useEffect } from 'react';

// material-ui imports
import MuiTableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// local imports
import { border } from './Table';
import Confirm from '../Confirm/Confirm';

const TableBody = (props) => {
    const {
        search, columns, rows, onDelete, onEdit, indexing, order, orderBy, page, rowsPerPage
    } = props;

    const isDeleteCol = onDelete ? true : false;
    const isEditCol = onEdit ? true : false;

    const [isConfirmOpened, setIsConfirmOpened] = useState(false);
    const [rowIdToDelete, setRowIdToDelete] = useState(null);
    const [showEmptyMessage, setShowEmptyMessage] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowEmptyMessage(true);
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

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

    const handleDelete = () => {
        onDelete(rowIdToDelete);

        const index = rows.findIndex(record => record.id === rowIdToDelete);
        if (index >= 0) rows.splice(index, 1);

        setIsConfirmOpened(false);
    };

        const getFilteredList = () => {
            let list = stableSort(rows, getComparator(order, orderBy));

            for (let searchField in search) {
                list = list.filter((row) =>
                    columns.some((column) =>
                        (column.id === searchField)
                            ? column.id?.toLowerCase().includes(search[searchField]?.toLowerCase())
                            : false
                    )
                );
            }

            return list;
        };

    return (
        <>
            <MuiTableBody sx={{
                '& .MuiTableCell-root': {
                    borderBottom: border,
                },
            }}>
                {rows.length > 0 ? (
                    getFilteredList().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                            borderRight: `${((index !== columns.length - 1) || (isDeleteCol || isEditCol)) ? border : 'none'}`,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                        size='small'
                                    >
                                        {(column.id.toLowerCase().includes('link')) ? (
                                            <a href={row[column.id]} target="_blank" rel="noreferrer">{row[column.id]}</a>
                                        ) : row[column.id]}
                                    </TableCell>
                                ))}
                                {
                                    (isDeleteCol || isEditCol) && (
                                        <TableCell
                                            align="center"
                                            sx={{
                                                // borderRight: border,
                                            }}
                                            size='small'
                                        >
                                            <Stack direction='row' alignItems='center' justifyContent='center' columnGap={1}>
                                                {isEditCol && <IconButton
                                                    onClick={() => {
                                                        onEdit(row);
                                                    }}
                                                    size='small'
                                                    sx={{
                                                        '&:hover': {
                                                            color: '#fff',
                                                            backgroundColor: 'rgba(0, 0, 0, 0.54)',
                                                        },
                                                    }}
                                                >
                                                    <EditIcon fontSize='1rem' />
                                                </IconButton>}

                                                {isDeleteCol && <IconButton
                                                    onClick={() => {
                                                        setIsConfirmOpened(true);
                                                        setRowIdToDelete(row.id);
                                                    }}
                                                    size='small'
                                                    sx={{
                                                        '&:hover': {
                                                            color: '#fff',
                                                            backgroundColor: 'rgba(0, 0, 0, 0.54)',
                                                        },
                                                    }}
                                                >
                                                    <DeleteIcon fontSize='1rem' />
                                                </IconButton>}
                                            </Stack>
                                        </TableCell>
                                    )
                                }
                            </TableRow>
                        ))
                ) : (
                    <TableRow tabIndex={-1}>
                        <TableCell align="center" colSpan={columns.length + (indexing ? 1 : 0) + ((isDeleteCol || isEditCol) ? 1 : 0)} sx={{ color: 'gray', fontSize: '18px' }}>
                            {showEmptyMessage ? 'Table is empty or something went wrong...!' : 'Loading...!'}
                        </TableCell>
                    </TableRow>
                )}
            </MuiTableBody>

            <Confirm
                state={{ isConfirmOpened, setIsConfirmOpened }}
                onYesClick={handleDelete}
            />
        </>
    )
};

export default TableBody;
