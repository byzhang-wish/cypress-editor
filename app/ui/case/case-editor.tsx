'use client';

import { Component, RefObject } from 'react';
import { Drawer } from "antd";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-yaml"
import "ace-builds/src-noconflict/worker-yaml"

export interface CaseEditorProps {
    ref: RefObject<CaseEditor>,
    updateValue: (value: string) => void
    defaultValue: string
}

interface CaseEditorState {
    value: string,
    open: boolean
}

export default class CaseEditor extends Component<CaseEditorProps> {

    state: CaseEditorState = {
        value: this.props.defaultValue,
        open: false
    };

    setValue = (value: string, callback: undefined | (() => void) = undefined) => {
        this.setState({ value: value }, callback)
    }

    setOpen = () => {
        this.setState({ open: !this.state.open })
    }

    onChange = (value: string) => {
        this.setValue(value)
    }

    customCompleters = {
        getCompletions: function (editor: any, session: any, pos: any, prefix: any, callback: any) {
            switch (prefix) {
                case '-':
                    callback(null, ['Case', 'Page', 'Act', 'Click', 'Type', 'Wait', 'Visible', 'Mock'].map(($) => { return { value: `- ${$}: `, meta: 'Step' } }));
                    break;
                default:
                    callback(null, []);
                    break;
            }
        }
    };

    componentDidUpdate(prevProps: any, prevState: any) {
        if (this.state.value !== prevState.value) {
            this.props.updateValue(this.state.value)
        }
    }

    render() {
        return (
            <Drawer title="" width='550px' open={this.state.open} onClose={() => { this.setOpen() }} closeIcon={null} placement='right'>
                <AceEditor
                    mode="yaml"
                    theme="github"
                    name="yaml-editor"
                    width='620px'
                    height='1000px'
                    fontSize='14px'
                    showGutter={false}
                    enableLiveAutocompletion={true}
                    setOptions={{
                        useWorker: false
                    }}
                    editorProps={{
                        completers: [this.customCompleters]
                    }}
                    defaultValue={this.props.defaultValue}
                    debounceChangePeriod={500}
                    value={this.state.value}
                    onChange={this.onChange}
                />
            </Drawer>
        );
    }
}