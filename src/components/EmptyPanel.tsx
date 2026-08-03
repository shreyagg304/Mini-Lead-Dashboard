type EmptyPanelProp = {
    message : string;
}

function EmptyPanel({message} : EmptyPanelProp) {
    return (
        <>
            <h3>{message}</h3>
        </>
    )
}

export default EmptyPanel