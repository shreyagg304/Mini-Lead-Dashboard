import { Chip } from '@mui/material'

type StatusChipProps = {
    status: string;
}

function StatusChip({status} : StatusChipProps ) {
    switch(status) {
        case "New" :
            return <Chip label="New" color="primary" />
        case "Contacted" :
            return <Chip label="Contacted" color="warning" />
        case "Qualified" :
            return <Chip label="Qualified" color="success" />
        case "Lost" :
            return <Chip label="Lost" color="error" />
        case "Won" :
            return <Chip label="Won" color="default" />
        default :
            <Chip label={status}/>
    }
}

export default StatusChip