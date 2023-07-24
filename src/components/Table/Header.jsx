import PropTypes from 'prop-types';

// material-ui imports
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// local imports
import { border } from './Table';

const TableHeader = (props) => {
    const { order, orderBy, onRequestSort, columns, isDeleteCol, isEditCol, indexing } = props;

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
                            borderRight: `${((index !== columns.length - 1) || (isDeleteCol || isEditCol)) ? border : 'none'}`,
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
                    (isEditCol || isDeleteCol) && (
                        <TableCell
                            sx={{
                                borderRight: 'none',
                                borderBottom: border,
                                padding: '8px'
                            }}
                        >
                            <Typography align='center' sx={{ flexGrow: 1 }}>
                                <b>Actions</b>
                            </Typography>
                        </TableCell>
                    )
                }
            </TableRow>
        </TableHead>
    );
};

TableHeader.propTypes = {
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
    isEditCol: PropTypes.bool,
    indexing: PropTypes.bool,
};

export default TableHeader;
