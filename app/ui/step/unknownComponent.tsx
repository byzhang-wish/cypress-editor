'use client';

import { Card } from 'antd';
import StepComponent from "@/app/ui/step/stepComponent";

import { StepComponentProps } from '@/app/definitions';

class UnknownComponent extends StepComponent {

    constructor(props: StepComponentProps) {
        super(props);
        this.props.updateDesc('Unknown Command')
    }

    render() {
        return (
            <Card style={{ width: 500, marginTop: '2px' }}>
                <pre>{this.getValue()}</pre>
            </Card>);
    }

}

export default UnknownComponent;