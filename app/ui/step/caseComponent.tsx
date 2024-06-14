'use client';

import CommonSelect from "@/app/ui/step/commonSelect";
import StepComponent from "@/app/ui/step/stepComponent";

import { fetchCloudCaseList } from "@/app/lib/mock-server";

import { StepComponentProps, CaseStep } from "@/app/definitions";

interface CaseState {
    value: CaseStep,
    options: string[]
}

class CaseComponent extends StepComponent {

    state: CaseState = {
        value: {
            Case: ''
        },
        options: []
    };

    setDesc(option: string) {
        this.props.updateDesc(`Test Case:\t${option || '?'}`)
    }

    onSelect = (option: string) => {
        const newValue: CaseStep = {
            Case: option
        }
        this.setState({ value: newValue })
    }

    onFocus = async () => {
        this.setState({
            options: await fetchCloudCaseList()
        })
    }

    constructor(props: StepComponentProps) {
        super(props);
        if (this.props.value) {
            const initValue: CaseStep = {
                Case: this.props.value.Case
            }
            this.state.value = initValue;
            this.setDesc(initValue.Case);
        }
    }

    componentDidUpdate(prevProps: StepComponentProps, prevState: CaseState) {
        if (this.state.value !== prevState.value) {
            this.props.updateValue(this.state.value);
            this.setDesc(this.state.value.Case);
        }
    }

    render() {
        return (<CommonSelect options={this.state.options} onSelect={this.onSelect} onFocus={this.onFocus} onSearch={() => { }} defaultValue={this.state.value.Case} />);
    }

}

export default CaseComponent;