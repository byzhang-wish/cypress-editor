'use client';

import { AutoComplete } from "antd";
import debounce from 'lodash.debounce';

import StepComponent from "@/app/ui/step/stepComponent";

import { fetchData } from "@/app/lib/mock-server";

import { StepComponentProps, ClickStep } from "@/app/definitions";

interface ClickState {
    value: ClickStep,
    options: string[]
}

class ClickComponent extends StepComponent {

    state: ClickState = {
        value: {
            Click: ''
        },
        options: []
    };

    setDesc(option: string) {
        this.props.updateDesc(`Click ${option || '?'}`)
    }

    onChange = debounce((text: string) => {
        const newValue: ClickStep = {
            Click: text
        }
        this.setState({ value: newValue })
    }, 500)

    onFocus = async () => {
        const myPage = this.props.myPage(this.props.id);
        this.setState({
            options: Object.keys(await fetchData(myPage)).map(option => `$page.${option}`)
        })
    }

    constructor(props: StepComponentProps) {
        super(props);
        if (this.props.value) {
            const initValue: ClickStep = {
                Click: this.props.value.Click
            }
            this.state.value = initValue;
            this.setDesc(initValue.Click);
        }
    }

    componentDidUpdate(prevProps: StepComponentProps, prevState: ClickState) {
        if (this.state.value !== prevState.value) {
            this.props.updateValue(this.state.value);
            this.setDesc(this.state.value.Click);
        }
    }

    render() {
        return (<AutoComplete
            filterOption={(input: string, option?: { label: string; value: string }) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            style={{ width: 410, marginBottom: '2px' }}
            options={this.state.options.map(option => ({ label: option, value: option }))}
            onFocus={this.onFocus}
            defaultValue={this.state.value.Click}
            onChange={this.onChange} />);
    }

}

export default ClickComponent;