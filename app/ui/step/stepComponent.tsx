'use client';

import { Component } from "react";

import { StepComponentProps } from "@/app/definitions";

import { yamlParse, yamlString } from "@/app/lib/utils";

class StepComponent extends Component<StepComponentProps> {

    state = { value: this.props.value };

    yamlParse = yamlParse;

    yamlString = yamlString;

    getValue = () => this.yamlString([this.state.value])

    constructor(props: StepComponentProps) {
        super(props);
        console.info(`[Render][${Date.now()}] STEP ${this.props.id}`)
    }

}

export default StepComponent;