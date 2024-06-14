export interface CaseProps {
    id: string,
    uploadName: (id: string, name: string) => void
}

export interface StepProps {
    ref: any,
    id: string,
    value: any,
    onAdd: (id: string) => void,
    onDelete: (id: string) => void,
    onUpdate: (id: string, value: any) => void,
    myPage: (id: string) => string
}

export interface StepComponentProps extends StepProps {
    updateDesc: (desc: string) => void,
    updateValue: (value: any) => void
}

export interface CaseStep {
    Case: string
}

export interface PageStep {
    Page: string
}

export interface ActStep {
    Desc: string,
    Act: string,
    Args: any
}

export interface WaitStep {
    Wait: number
}

export interface ClickStep {
    Click: string
}

export interface TypeStep {
    Type: string,
    Into: string
}

export interface VisibleStep {
    Visible: string
}

export interface MockStep {
    Mock: any
}