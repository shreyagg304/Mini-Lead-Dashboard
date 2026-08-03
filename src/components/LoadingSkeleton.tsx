import { CircularProgress } from "@mui/material"

function LoadingSkeleton() {
    return (
        <>
            <h3>Loading...</h3>
            <CircularProgress aria-label="Loading…" />
        </>
    )
}

export default LoadingSkeleton