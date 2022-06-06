import StepElement from '@/components/elements/step/step.element'
const ProcessBarWidget = (props) => {
    let steps = []
    for (let i = 0; i < props.processBarItems.length; i++) {
        steps.push(<StepElement key={i.toString()} label={props.processBarItems[i].label} grow={props.processBarItems[i].grow || 1} type={props.processBarItems[i].type} />)
    }
    steps = steps.reverse();
    return (
        <div class="step-container">{steps}</div>
    )
}
export default ProcessBarWidget;