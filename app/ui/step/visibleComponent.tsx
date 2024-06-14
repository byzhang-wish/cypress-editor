'use client';

import { AutoComplete } from "antd";
import debounce from "lodash.debounce";

import StepComponent from "@/app/ui/step/stepComponent";

import { fetchData } from "@/app/lib/mock-server";

import { StepComponentProps, VisibleStep } from "@/app/definitions";

interface VisibleState {
    value: VisibleStep,
    options: string[]
}

class VisibleComponent extends StepComponent {

    state: VisibleState = {
        value: {
            Visible: ''
        },
        options: []
    };

    setDesc(option: string) {
        this.props.updateDesc(`Assert that ${option || '?'} is visible`)
    }

    onChange = debounce((text: string) => {
        const newValue: VisibleStep = {
            Visible: text
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
            const initValue: VisibleStep = {
                Visible: this.props.value.Visible
            }
            this.state.value = initValue;
            this.setDesc(initValue.Visible);
        }
    }

    componentDidUpdate(prevProps: StepComponentProps, prevState: VisibleState) {
        if (this.state.value !== prevState.value) {
            this.props.updateValue(this.state.value);
            this.setDesc(this.state.value.Visible);
        }
    }

    render() {
        return (<AutoComplete
            filterOption={(input: string, option?: { label: string; value: string }) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            style={{ width: 410, marginBottom: '2px' }}
            options={this.state.options.map(option => ({ label: option, value: option }))}
            onFocus={this.onFocus}
            defaultValue={this.state.value.Visible}
            onChange={this.onChange} />);
    }

}

export default VisibleComponent;