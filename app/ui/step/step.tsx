'use client';

import { Component, createRef } from "react";
import { Select, Collapse, Space } from "antd";
import { CaretRightOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';

import { noto } from '@/app/ui/fonts';

import CaseComponent from "@/app/ui/step/caseComponent";
import PageComponent from "@/app/ui/step/pageComponent";
import ActComponent from "@/app/ui/step/actComponent";
import ClickComponent from "@/app/ui/step/clickComponent";
import TypeComponent from "@/app/ui/step/TypeComponent";
import WaitComponent from "@/app/ui/step/waitComponent";
import VisibleComponent from "@/app/ui/step/visibleComponent";
import MockComponent from "@/app/ui/step/mockComponent";
import UnknownComponent from "@/app/ui/step/unknownComponent";

import { StepProps } from "@/app/definitions";

interface StepState {
    collapse: boolean
    value: any
    type: string
    desc: string
}

const stepComponents = new Map([
    ['Case', CaseComponent],
    ['Page', PageComponent],
    ['Act', ActComponent],
    ['Click', ClickComponent],
    ['Type', TypeComponent],
    ['Wait', WaitComponent],
    ['Visible', VisibleComponent],
    ['Mock', MockComponent],
    ['?', UnknownComponent]
]);

const steps = Array.from(stepComponents.keys());

class Step extends Component<StepProps> {

    stepRef: any = createRef();

    getValue = () => this.stepRef.current.getValue();

    collapse = async (status: boolean) => {
        if (status !== this.state.collapse) {
            this.setState({ collapse: status })
        }
    }

    updateDesc = (desc: string) => {
        this.setState({ desc: desc })
    }

    updateValue = (newValue: any) => {
        this.setState({ value: newValue })
    }

    getStepComponent = (type: string) => {
        const StepComponent = stepComponents.get(type)
        return StepComponent ? <StepComponent {...this.props} ref={this.stepRef} value={this.state.value} updateDesc={this.updateDesc} updateValue={this.updateValue} /> : <></>;
    }

    state: StepState = {
        collapse: false,
        value: {},
        type: 'Act',
        desc: ''
    };

    getType(value: any) {
        if (value === null) return 'Act'
        for (let step of steps) {
            if (value[step] !== undefined) {
                return step
            }
        }
        return '?'
    }

    constructor(props: StepProps) {
        super(props);
        this.state.value = this.props.value;
        this.state.type = this.getType(this.state.value)
        if (this.state.value?.Desc) this.state.desc = this.state.value.Desc
    }

    componentDidUpdate(prevProps: StepProps, prevState: StepState) {
        if (this.state.value !== prevState.value) {
            this.handleUpdate(this.state.value)
        }
    }

    handleAdd = () => this.props.onAdd(this.props.id)

    handleDelete = () => this.props.onDelete(this.props.id)

    handleUpdate = (newValue: any) => this.props.onUpdate(this.props.id, newValue)

    onStepSelect = (option: string) => {
        this.setState({
            type: option
        })
    }

    render() {
        return (
            <Collapse style={{ width: 550 }}
                bordered={false}
                activeKey={this.state.collapse ? [] : [1]}
                expandIcon={({ isActive }) => <CaretRightOutlined onClick={() => { this.collapse(!this.state.collapse) }} rotate={isActive ? 90 : 0} />}
                expandIconPosition="end"
                collapsible="icon"
                size="middle"
                ghost={true}
                items={[
                    {
                        key: 1,
                        label: <div className={`${noto.className}`} style={{ fontSize: 14 }}>{this.state.desc}</div>,
                        children:
                            <div style={{ width: 500 }}>
                                <Select style={{ width: 88, marginRight: 2 }}
                                    defaultValue={this.state.type}
                                    options={steps.map((option: string) => { return { label: option, value: option } })}
                                    onSelect={this.onStepSelect}
                                />
                                {this.getStepComponent(this.state.type)}
                            </div>,
                        extra: <Space><MinusOutlined onClick={this.handleDelete} /><PlusOutlined onClick={this.handleAdd} /></Space>
                    }
                ]}
            />
        );
    }

}

export default Step;