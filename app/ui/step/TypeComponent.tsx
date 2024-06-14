'use client';

import { Input, AutoComplete } from "antd";
import debounce from "lodash.debounce";

import StepComponent from "@/app/ui/step/stepComponent";

import { fetchData } from "@/app/lib/mock-server";

import { StepComponentProps, TypeStep } from "@/app/definitions";

interface TypeState {
    value: TypeStep,
    options: string[]
}

class TypeComponent extends StepComponent {

    state: TypeState = {
        value: {
            Type: '',
            Into: ''
        },
        options: []
    };

    setDesc(type: string, into: string) {
        this.props.updateDesc(`Type ${type || '?'} into ${into || '?'}`)
    }

    onIntoChange = debounce((text: string) => {
        const newValue: TypeStep = {
            Type: this.state.value.Type,
            Into: text,
        }
        this.setState({ value: newValue })
    }, 500)

    onFocus = async () => {
        const myPage = this.props.myPage(this.props.id);
        this.setState({
            options: Object.keys(await fetchData(myPage)).map(option => `$page.${option}`)
        })
    }

    onTypeChange = debounce((text: string) => {
        const newValue: TypeStep = {
            Type: text,
            Into: this.state.value.Into,
        }
        this.setState({ value: newValue })
    }, 500)

    constructor(props: StepComponentProps) {
        super(props);
        if (this.props.value) {
            const initValue: TypeStep = {
                Type: this.props.value.Type,
                Into: this.props.value.Into
            }
            this.state.value = initValue;
            this.setDesc(initValue.Type, initValue.Into);
        }
    }

    componentDidUpdate(prevProps: StepComponentProps, prevState: TypeState) {
        if (this.state.value !== prevState.value) {
            this.props.updateValue(this.state.value);
            this.setDesc(this.state.value.Type, this.state.value.Into);
        }
    }

    render() {
        return (<>
            <Input style={{ width: 410, marginBottom: '2px' }} defaultValue={this.state.value.Type} onChange={($) => this.onTypeChange($.target.value)} />
            <Input style={{ width: 88, marginRight: 2, marginBottom: '2px' }} value="Into" readOnly />
            <AutoComplete
                filterOption={(input: string, option?: { label: string; value: string }) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                style={{ width: 410, marginBottom: '2px' }}
                options={this.state.options.map(option => ({ label: option, value: option }))}
                onFocus={this.onFocus}
                defaultValue={this.state.value.Into}
                onChange={this.onIntoChange} />
        </>);
    }

}

export default TypeComponent;