import LoadingSkeleton from './LoadingSkeleton'
import ErrorPanel from './ErrorPanel'
import EmptyPanel from './EmptyPanel'
import type { ReactNode } from 'react';

type DataStateProps = {
    isLoading: boolean;
    isError: boolean;
    isEmpty: boolean;
    children: ReactNode;
    refetch: () => void;
    emptyMessage : string;
};

function DataState({ isLoading, isError, isEmpty, children, refetch, emptyMessage} : DataStateProps) {
    if (isLoading) {
        return <LoadingSkeleton />
    }
    if (isError) {
        return <ErrorPanel refetch={refetch} />
    }
    if (isEmpty) {
        return <EmptyPanel message={emptyMessage}/>
    }
    return children
}

export default DataState