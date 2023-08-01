import PropTypes from 'prop-types';

// material-ui imports
import TableCell from '@mui/material/TableCell';
import MuiTableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// local imports
import { border } from './Table';

const TableHead = (props) => {
    const {
        search, onSearchChange, order, orderBy, onRequestSort, columns, isDeleteCol, isEditCol, indexing
    } = props;

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <MuiTableHead>
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
            {search && <TableRow>
                {
                    indexing && (
                        <TableCell
                            sx={{
                                borderRight: border,
                                borderBottom: border,
                                padding: '4px'
                            }}
                        />
                    )
                }
                {columns.map((column, index) => (
                    <TableCell
                        key={column.id}
                        sx={{
                            borderRight: `${((index !== columns.length - 1) || (isDeleteCol || isEditCol)) ? border : 'none'}`,
                            borderBottom: border,
                            padding: '4px'
                        }}
                    >
                        {column.filterField ? (column.filterField === 'text' ? (
                            <TextField
                                size='small'
                                fullWidth
                                placeholder='Search...'
                                // value={search[column.id] ? search[column.id] : ''}
                                onChange={(e) => {
                                    onSearchChange(column.id, e.target.value);
                                }}
                                sx={{
                                    '& .MuiInputBase-input': { padding: '4px 8px' },
                                    // maxWidth: '90px',
                                }}
                            />
                        ) : (
                            <Autocomplete
                                size='small'
                                defaultValue={null}
                                // value={search[column.id] ?? null}
                                options={column.filterField}
                                getOptionLabel={(option) => option.value}
                                onChange={(_event_, newValue) => onSearchChange(column.id, newValue?.key ?? '')}
                                renderInput={(params) =>
                                    <TextField
                                        {...params} variant='outlined' placeholder='Select'
                                    />
                                }
                                renderOption={(props, option) =>
                                    <Typography {...props} sx={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'scroll',
                                        // textOverflow: 'ellipsis',
                                        // width: '100%'
                                    }}>
                                        {option.value}
                                    </Typography>
                                }
                                componentsProps={{
                                    paper: {
                                        minWidth: '450px'
                                    },
                                }}
                                sx={{
                                    '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
                                        padding: '2px 8px',
                                    },
                                }}
                            />
                        )) : ''}
                    </TableCell>
                ))}
                {
                    (isEditCol || isDeleteCol) && (
                        <TableCell
                            sx={{
                                borderRight: 'none',
                                borderBottom: border,
                                padding: '4px'
                            }}
                        />
                    )
                }
            </TableRow>}
        </MuiTableHead>
    );
};

TableHead.propTypes = {
    search: PropTypes.object,
    onSearchChange: PropTypes.func,
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

export default TableHead;
