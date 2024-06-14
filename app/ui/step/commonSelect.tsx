'use client';

import { Component } from "react";
import { Select } from "antd";

interface commonSelectProps {
    options: string[]
    onSelect: (option: string) => void
    onFocus: () => void
    onSearch: ($:any) => void
    defaultValue: string
}

class CommonSelect extends Component<commonSelectProps> {

    render() {
        return (
            <Select
                style={{ width: 410, marginBottom: '2px' }}
                showSearch
                filterOption={(input: string, option?: { label: string; value: string }) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                options={this.props.options.map((option: string) => { return { label: option, value: option } })}
                onSelect={this.props.onSelect}
                onFocus={this.props.onFocus}
                onSearch={this.props.onSearch}
                defaultValue={this.props.defaultValue}
            />
        );
    }

}

export default CommonSelect;