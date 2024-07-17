'use client';

import { Input, Card } from "antd";
import debounce from 'lodash.debounce';

import CommonSelect from "@/app/ui/step/commonSelect";
import StepComponent from "@/app/ui/step/stepComponent";
import YAMLEditor from "@/app/ui/plugin/yaml-editor";

import { fetchData, fetchAction } from "@/app/lib/mock-server";

import { StepComponentProps, ActStep } from "@/app/definitions";

interface ActState {
    value: ActStep,
    options: string[],
    data: string[],
    context: string,
    smallYAMLEditor: boolean
}

class ActComponent extends StepComponent {

    state: ActState = {
        value: {
            Desc: '',
            Act: '',
            Args: {}
        },
        options: [],
        data: [],
        context: '',
        smallYAMLEditor: true
    };

    onActFocus = async () => {
        const myPage = this.props.myPage(this.props.id);
        const Acts = await fetchAction(myPage);
        this.setState({
            options: Acts
        })
    }

    onArgsFocus = async () => {
        const myPage = this.props.myPage(this.props.id);
        const data = await fetchData(myPage);
        this.setState({
            data: Object.keys(data)
        })
    }

    onDescChange = debounce((
        (desc: string) => {
            const newValue: ActStep = {
                ...this.state.value,
                Desc: desc
            };
            this.setState({ value: newValue });
        }
    ), 500);

    onActSelect = (option: string) => {
        const newValue: ActStep = {
            ...this.state.value,
            Act: option
        };
        this.setState({ value: newValue });
    }

    setActArgs = (context: string) => {
        try {
            const args = this.yamlParse(context);
            const value: ActStep = {
                Desc: this.state.value.Desc,
                Act: this.state.value.Act,
                Args: args || undefined
            };
            this.setState({ value: value })
        } catch (error) {
        }
    }

    setContext = (context: string) => {
        this.setState({ context: context })
    }

    constructor(props: StepComponentProps) {
        super(props);
        if (this.props.value) {
            const initValue: ActStep = {
                Desc: this.props.value.Desc,
                Act: this.props.value.Act,
                Args: this.props.value.Args
            };
            this.state.value = initValue;
            this.state.context = this.yamlString(this.state.value.Args);
            this.props.updateDesc(this.state.value.Desc);
        }
    }

    componentDidUpdate(prevProps: StepComponentProps, prevState: ActState) {
        if (this.state.context !== prevState.context) {
            this.setActArgs(this.state.context)
        }
        if (this.state.value !== prevState.value) {
            this.props.updateValue(this.state.value);
            this.props.updateDesc(this.state.value.Desc);
        }
    }

    render() {
        return (<>
            <CommonSelect options={this.state.options} onSelect={this.onActSelect} onFocus={this.onActFocus} onSearch={() => { }} defaultValue={this.state.value.Act} />
            <Input style={{ width: 88, marginRight: 2 }} value="Desc" readOnly />
            <Input style={{ width: 410 }} onChange={($event) => { this.onDescChange($event.target.value) }} defaultValue={this.state.value.Desc} />
            <Card style={{ width: 500, height: this.state.smallYAMLEditor ? 80 : 285, marginTop: '2px' }} onDoubleClick={() => { this.setState({ smallYAMLEditor: !this.state.smallYAMLEditor }) }}>
                <YAMLEditor data={this.state.data} context={this.state.context} setContext={this.setContext} onFocus={this.onArgsFocus} smallYAMLEditor={this.state.smallYAMLEditor} />
            </Card>
        </>);
    }

}

export default ActComponent;