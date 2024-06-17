'use client';

import CommonSelect from "@/app/ui/step/commonSelect";
import StepComponent from "@/app/ui/step/stepComponent";

import { fetchPage } from "@/app/lib/mock-server";

import { StepComponentProps, PageStep } from "@/app/definitions";

interface PageState {
    value: PageStep,
    options: string[]
}

class PageComponent extends StepComponent {

    state: PageState = {
        value: {
            Page: ''
        },
        options: []
    };

    setDesc(option: string) {
        this.props.updateDesc(`Set $page as ${option || '?'}`)
    }

    onSelect = (option: string) => {
        const newValue: PageStep = {
            Page: option
        }
        this.setState({ value: newValue })
    }

    onFocus = async () => {
        this.setState({
            options: await fetchPage()
        })
    }

    constructor(props: StepComponentProps) {
        super(props);
        if (this.props.value) {
            const initValue: PageStep = {
                Page: this.props.value.Page
            }
            this.state.value = initValue;
            this.setDesc(initValue.Page);
        }
    }

    componentDidUpdate(prevProps: StepComponentProps, prevState: PageState) {
        if (this.state.value !== prevState.value) {
            this.props.updateValue(this.state.value);
            this.setDesc(this.state.value.Page);
        }
    }

    render() {
        return (<CommonSelect options={this.state.options} onSelect={this.onSelect} onFocus={this.onFocus} onSearch={() => { }} defaultValue={this.state.value.Page} />);
    }

}

export default PageComponent;