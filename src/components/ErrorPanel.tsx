import { Button } from '@mui/material'

type RefetchProps = {
    refetch: () => void;
}

function ErrorPanel( {refetch} : RefetchProps) {
    return (
        <>
            <h3>Something went wrong</h3>
            <Button onClick={refetch}>Try Again</Button>
        </>
    )
}

export default ErrorPanel