'use client';

import { Component } from 'react';
import { Select, AutoComplete, Button, Space } from "antd";
import { ReloadOutlined } from '@ant-design/icons';

import { fetchLocalCaseList, fetchCloudCaseList, fetchCase } from "@/app/lib/mock-server";

interface CaseSourceProps {
    setCase: (name: string, value: string) => void
}

interface CaseSourceState {
    source: string,
    name: string | null,
    nameStatus: undefined | 'warning' | 'error'
    options: string[]
}

class CaseSource extends Component<CaseSourceProps> {

    state: CaseSourceState = {
        source: 'Local',
        name: null,
        nameStatus: undefined,
        options: []
    };

    constructor(props: CaseSourceProps) {
        super(props);
    }

    async componentDidMount() {
        await this.onSourceChange(this.state.source);
    }

    onSourceChange = async (option: string) => {
        let state: CaseSourceState = {
            source: option,
            name: null,
            nameStatus: undefined,
            options: []
        }
        switch (option) {
            case 'Local':
                state.options = await fetchLocalCaseList();
                break;
            case 'Cloud':
                state.options = await fetchCloudCaseList();
                break;
            default:
                break;
        }
        this.setState(state)
    }

    onNameChange = (text: string) => {
        this.setState({ name: text })
    }

    onSubmit = async () => {
        if (this.state.name && this.state.name.trim()) {
            this.props.setCase(this.state.name, await fetchCase(this.state.name.trim()) || '')
        } else {
            this.setState({ nameStatus: 'error' })
            setTimeout(() => {
                this.setState({ nameStatus: undefined })
            }, 3000);
        }
    }

    render() {
        return (
            <Space>
                <Select
                    style={{ width: 90, marginTop: 25, marginBottom: 15 }}
                    options={['Local', 'Cloud'].map((option: string) => { return { label: option, value: option } })}
                    onChange={this.onSourceChange}
                    defaultValue={this.state.source}
                />
                <AutoComplete
                    filterOption={(input: string, option?: { label: string; value: string }) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    style={{ width: 440, marginTop: 25, marginBottom: 15 }}
                    options={this.state.options.map(option => ({ label: option, value: option }))}
                    onChange={this.onNameChange}
                    value={this.state.name}
                    status={this.state.nameStatus}
                />
                <Button style={{ marginTop: 25, marginBottom: 15 }} icon={<ReloadOutlined />} onClick={this.onSubmit} />
            </Space>
        );
    }

}

export default CaseSource;