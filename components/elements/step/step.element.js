const StepElement = (props) => {
    const className = `step ${props.type} grow-${props.grow}`
    return (
        <div className={className}><span>{props.label}</span></div>
    )
}
export default StepElement;