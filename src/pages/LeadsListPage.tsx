import { useLeads } from '../features/leads/useLeads.ts'
import { TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Paper, TablePagination, TableFooter, TextField, FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent, TableSortLabel, Button} from '@mui/material'
import { useState, useEffect } from 'react'
import DataState from '../components/DataState.tsx'
import StatusChip from '../components/StatusChip.tsx'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog.tsx'

type Lead = {
    id : string;
    first_name : string;
    last_name : string;
    email : string;
    phone : string;
    status : string;
    owner : string;
    source : string;
    created_on : string;
}

type LeadResponse = {
    data : Lead[];
    first : number;
    items : number;
    last : number;
    next : number | null;
    pages : number;
    prev : number | null;
}

function LeadsListPage() {

    const [page, setPage] = useState(0);
    const [rowPerPage, setRowPerPage] = useState(10);
    const [text, setText] = useState('');
    const [debouncedText, setDebouncedText] = useState(text);
    const [status, setStatus] = useState('');
    const [sortBy, setSortBy] = useState('created_on');
    const [sortDirection, setSortDirection] = useState<'asc'|'desc'>('desc');
    const navigate = useNavigate();
    const emptyMessage = text != "" || status != "" ? 'No leads found matching your search' : 'No leads available';
 
    const handlePageChange = (_ : React.MouseEvent<HTMLButtonElement> | null, newPage : number) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        setRowPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
        setPage(0);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedText(text);
        }, 300);
        return () => {
            clearTimeout(timer);
        }
    }, [text]);

    const handleStatusChange = (e : SelectChangeEvent ) => {
        setStatus(e.target.value);
        setPage(0);
    }

    const handleSort = (field : string) => {
        if (sortBy !== field) {
            setSortBy(field);
            setSortDirection('asc');
        } else {
            if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else {
                setSortBy('');
                setSortDirection('asc');
            }
        }
    }

    const query = useLeads(page + 1, rowPerPage, debouncedText, status, sortBy, sortDirection);

    const response = query.data as LeadResponse | undefined;

    return (
        <>
            <TextField
                label = "Search"
                value = {text}
                onChange = {handleSearchChange}
            />
            <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                    value={status}
                    onChange={handleStatusChange}
                    label="Status"
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="New">New</MenuItem>
                    <MenuItem value="Contacted">Contacted</MenuItem>
                    <MenuItem value="Qualified">Qualified</MenuItem>
                    <MenuItem value="Lost">Lost</MenuItem>
                    <MenuItem value="Won">Won</MenuItem>
                </Select>
            </FormControl>
            <Button onClick={() => navigate('/leads/new')} color='primary'> + Add Lead </Button>
            <DataState
                isLoading={query.isLoading}
                isError={query.isError}
                isEmpty={!query.isLoading &&
                    !query.isError &&
                    response?.data.length === 0}
                refetch = {query.refetch}
                emptyMessage={emptyMessage}
            >
                { response && (
                    <TableContainer component={Paper} >
                        <Table >
                            <TableHead >
                                <TableRow>
                                    <TableCell>Id</TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortBy === 'first_name'}
                                            direction={sortDirection}
                                            onClick={() => handleSort('first_name')}
                                        >
                                            Name
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortBy === 'status'}
                                            direction={sortDirection}
                                            onClick={() => handleSort('status')}
                                        >
                                            Status
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>Owner</TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortBy === 'created_on'}
                                            direction={sortDirection}
                                            onClick={() => handleSort('created_on')}
                                        >
                                            Created On
                                        </TableSortLabel>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {response.data.map((row) => (
                                    <TableRow key={row.id} onClick={() => { navigate(`/leads/${row.id}`);}} hover sx = {{cursor : 'pointer'}}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.first_name} {row.last_name}</TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>{row.phone}</TableCell>
                                        <TableCell><StatusChip status={row.status}/></TableCell>
                                        <TableCell>{row.owner}</TableCell>
                                        <TableCell>{row.created_on}</TableCell>
                                        <TableCell> <ConfirmDialog id={row.id} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 50]}
                                        page={page}
                                        rowsPerPage={rowPerPage}
                                        onPageChange={handlePageChange}
                                        onRowsPerPageChange={handleRowsPerPageChange}
                                        count={response.items}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                )}
            </DataState>
        </>
    )
}

export default LeadsListPage