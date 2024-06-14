'use client';

import { Card } from 'antd';

import StepComponent from "@/app/ui/step/stepComponent";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-yaml"
import "ace-builds/src-noconflict/worker-yaml"

import { StepComponentProps, MockStep } from "@/app/definitions";

interface MockState {
    value: MockStep,
    context: string
}

class MockComponent extends StepComponent {

    state: MockState = {
        value: {
            Mock: {}
        },
        context: ''
    };

    setMock = (context: string) => {
        try {
            const value: MockStep = {
                Mock: this.yamlParse(context)
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
            const initValue: MockStep = {
                Mock: this.props.value.Mock
            };
            this.state.value = initValue;
            this.state.context = this.yamlString(this.state.value.Mock);
        }
        this.props.updateDesc('Mock env vars');
    }

    componentDidUpdate(prevProps: StepComponentProps, prevState: MockState) {
        if (this.state.context !== prevState.context) {
            this.setMock(this.state.context)
        }
        if (this.state.value !== prevState.value) {
            this.props.updateValue(this.state.value);
        }
    }

    render() {
        return (
            <Card style={{ width: 500, height: 110, marginTop: '2px' }}>
                <AceEditor
                    mode="yaml"
                    theme="github"
                    name="yaml-editor"
                    placeholder='Environment Variables'
                    width='450px'
                    height='67px'
                    fontSize='14px'
                    showGutter={false}
                    enableLiveAutocompletion={true}
                    setOptions={{
                        useWorker: false
                    }}
                    defaultValue={this.state.context}
                    debounceChangePeriod={500}
                    onChange={this.setContext}
                />
            </Card>
        );
    }

}

export default MockComponent;