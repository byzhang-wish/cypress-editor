'use client';

import { InputNumber } from "antd";
import debounce from "lodash.debounce";

import StepComponent from "@/app/ui/step/stepComponent";

import { StepComponentProps, WaitStep } from "@/app/definitions";

interface WaitState {
    value: WaitStep
}

class WaitComponent extends StepComponent {

    state: WaitState = {
        value: {
            Wait: 3
        }
    };

    setDesc(value: number) {
        this.props.updateDesc(`Wait ${value} ${value && value > 1 ? 'seconds' : 'second'}`);
    }

    onChange = debounce((value: number | null) => {
        if (!value) return
        const newValue: WaitStep = {
            ...this.state.value,
            Wait: value
        };
        this.setState({ value: newValue });
    }, 500)

    constructor(props: StepComponentProps) {
        super(props);
        if (this.props.value) {
            const newValue: WaitStep = {
                Wait: this.props.value.Wait || this.state.value.Wait
            };
            this.state.value = newValue;
            this.setDesc(this.state.value.Wait);
        }
    }

    componentDidUpdate(prevProps: StepComponentProps, prevState: WaitState) {
        if (this.state.value !== prevState.value) {
            this.props.updateValue(this.state.value);
            this.setDesc(this.state.value.Wait);
        }
    }

    render() {
        return (<>
            <InputNumber controls={false} min={1} style={{ width: 410 }} defaultValue={this.state.value.Wait} onChange={this.onChange} addonAfter={this.state.value.Wait > 1 ? 'seconds' : 'second'} />
        </>);
    }

}

export default WaitComponent;