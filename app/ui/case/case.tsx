'use client';

import { Component, RefObject, createRef } from 'react';
import { List, FloatButton, notification } from 'antd';
import { FileSyncOutlined, EditOutlined, SaveOutlined, MinusSquareOutlined, PlusSquareOutlined, SyncOutlined } from '@ant-design/icons';

import { v4 } from 'uuid';

import CaseSource from '@/app/ui/case/case-source';
import CaseEditor from '@/app/ui/case/case-editor';
import Step from '@/app/ui/step/step';
import { build, sync, save } from '@/app/lib/mock-server';

import { CaseProps, StepProps } from '@/app/definitions';

import { yamlParse } from '@/app/lib/utils';

interface CaseState {
    collapse: boolean
    name: string | null
    value: string
    steps: StepProps[]
}

const openNotification = (message: string, description: string) => {
    notification.open({
        message: message,
        description: description,
        onClick: () => { }
    });
};

class Case extends Component<CaseProps> {

    caseSourceRef: RefObject<CaseSource> = createRef();

    caseEditorRef: RefObject<CaseEditor> = createRef();

    newStep = (value: any): StepProps => ({
        ref: createRef(),
        id: v4(),
        value: value,
        onAdd: this.addStep,
        onDelete: this.delStep,
        onUpdate: this.updateStep,
        myPage: this.getPage
    });

    getPage = (id: string) => {
        const thisIndex = this.state.steps.findIndex(step => step.id === id)
        for (let i = thisIndex; i >= 0; i--) {
            let step = this.state.steps[i]
            if (step.value?.Page !== undefined) {
                return step.value?.Page
            }
        }
        return 'basePage'
    }

    addStep = (id: string) => {
        const thisBelow = this.state.steps.findIndex(step => step.id === id) + 1
        this.setState({
            steps: this.state.steps.slice(0, thisBelow).concat(this.newStep(null)).concat(this.state.steps.slice(thisBelow))
        });
    }

    delStep = (id: string) => {
        if (this.state.steps.length > 1) this.setState({ steps: this.state.steps.filter(step => step.id != id) })
    }

    updateStep = (id: string, newValue: any) => {
        this.setState({
            steps: this.state.steps.map(
                step => {
                    if (step.id === id) {
                        return {
                            ...step,
                            value: newValue
                        };
                    }
                    return step
                }
            )
        });
    }

    state: CaseState;

    constructor(props: CaseProps) {
        super(props);
        this.state = {
            collapse: false,
            name: null,
            value: '',
            steps: [this.newStep(null)]
        };
    }

    async componentDidUpdate(prevProps: any, prevState: CaseState) {
        if (this.state.value !== prevState.value) {
            if (this.state.value === this.getValue()) return
            let newValue: any = null;
            try {
                newValue = this.state.value.trim() === '' ? [] : yamlParse(this.state.value).map(this.newStep)
            } catch (error) {
            }
            if (newValue) {
                console.info(`[Render][${Date.now()}] CASE`)
                this.setState({ steps: newValue })
            }
        }
        if (this.state.collapse !== prevState.collapse) {
            await Promise.all(this.state.steps.map(step => step.ref.current.collapse(this.state.collapse)))
        }
        if (this.state.name && this.state.name !== prevState.name) {
            this.props.uploadName(this.props.id, this.state.name);
        }
    }

    updateValue = (value: string) => {
        this.setState({ value: value })
    }

    getValue = () => this.state.steps.map(step => step.ref.current.getValue()).join('\n')

    setCase = (name: string, value: string) => {
        this.setState({
            name: name,
            value: value
        })
    }

    onClickEditor = () => {
        this.caseEditorRef.current?.setValue(this.getValue());
        this.caseEditorRef.current?.setOpen()
    }

    onClickSave = async () => {
        this.caseEditorRef.current?.setValue(this.getValue(), async () => {
            if (!(this.caseSourceRef.current && this.caseEditorRef.current)) return
            let report: string;
            if (this.caseSourceRef.current.state.name) {
                const res = await save(this.caseSourceRef.current.state.source, this.caseSourceRef.current.state.name, this.caseEditorRef.current.state.value);
                report = res.ok ? 'Success' : res.error;
            } else {
                report = 'Error: Test case name required';
            }
            openNotification('Save', report)
        });
    }

    onClickBuild = async () => {
        let report: string;
        if (this.caseSourceRef.current?.state.name) {
            const res = await build(this.caseSourceRef.current.state.name);
            report = res.ok ? 'Success' : res.error;
        } else {
            report = 'Error: Test case name required';
        }
        openNotification('Build', report)
    }

    onClickSync = async () => { openNotification('Sync with Cypress', await sync() ? 'Success' : 'Failure') }

    onClickCollapse = () => this.setState({ collapse: !this.state.collapse })

    render() {
        return (
            <>
                <FloatButton.Group shape='circle' style={{ right: 94 }}>
                    <FloatButton tooltip={<div>YAML Editor</div>} icon={<EditOutlined />} onClick={this.onClickEditor} />
                    <FloatButton tooltip={<div>Save</div>} icon={<SaveOutlined />} onClick={this.onClickSave} />
                    <FloatButton tooltip={<div>Build</div>} icon={<FileSyncOutlined />} onClick={this.onClickBuild} />
                    <FloatButton tooltip={<div>Sync with Cypress</div>} icon={<SyncOutlined />} onClick={this.onClickSync} />
                    <FloatButton tooltip={this.state.collapse ? <div>Expand</div> : <div>Collapse</div>} icon={this.state.collapse ? <PlusSquareOutlined /> : <MinusSquareOutlined />} onClick={this.onClickCollapse} />
                    <FloatButton.BackTop tooltip={<div>BackTop</div>} visibilityHeight={0} />
                </FloatButton.Group>
                <List
                    style={{
                        width: 625
                    }}
                    header={<CaseSource ref={this.caseSourceRef} setCase={this.setCase} />}
                    itemLayout={'vertical'}
                    bordered
                >
                    {this.state.steps.map(step => <List.Item key={step.id}><Step {...step} /></List.Item>)}
                </List>
                <CaseEditor ref={this.caseEditorRef} updateValue={this.updateValue} defaultValue={this.state.value} />
            </>
        )
    }

}

export default Case;