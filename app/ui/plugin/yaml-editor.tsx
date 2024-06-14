import { Component, RefObject, createRef } from "react";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-yaml"
import "ace-builds/src-noconflict/worker-yaml"


interface YAMLEditorProps {
    data: string[],
    context: string;
    setContext: (context: string) => void,
    onFocus: () => void
}

export default class YAMLEditor extends Component<YAMLEditorProps> {

    editorRef: RefObject<AceEditor>;

    constructor(props: YAMLEditorProps) {
        super(props);
        this.editorRef = createRef();
    }

    setCompleters(data: string[]) {
        const editor = this.editorRef.current?.editor;
        if (editor) {
            const customCompleters = {
                getCompletions: function (editor: any, session: any, pos: any, prefix: any, callback: any) {
                    switch (prefix) {
                        case '$page':
                            callback(null, data.map(($) => { return { value: `$page.${$}`, meta: 'Consul' } }));
                            break;
                        default:
                            callback(null, []);
                            break;
                    }
                }
            };
            editor.completers = [customCompleters];
        }
    }

    componentDidUpdate(prevProps: YAMLEditorProps) {
        if (this.props.data !== prevProps.data) {
            this.setCompleters(this.props.data);
        }
    }

    onChange = (value: string) => {
        this.props.setContext(value);
    }

    render() {
        return (
            <AceEditor
                ref={this.editorRef}
                mode="yaml"
                theme="github"
                name="yaml-editor"
                placeholder='Arguments'
                width='450px'
                height='50px'
                fontSize='14px'
                showGutter={false}
                highlightActiveLine={false}
                enableLiveAutocompletion={true}
                setOptions={{
                    useWorker: false
                }}
                defaultValue={this.props.context}
                debounceChangePeriod={500}
                onChange={this.onChange}
                onFocus={this.props.onFocus}
            />
        );
    }
}