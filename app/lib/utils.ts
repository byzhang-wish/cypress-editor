import yaml from 'yaml';

export function yamlParse(text: string): any {
    try {
        return yaml.parse(text)
    } catch (error) {
        throw `Failed to parse: ${text}`
    }
}

export function yamlString(value: any): string {
    try {
        return yaml.stringify(value)
    } catch (error) {
        throw `Failed to stringify: ${JSON.stringify(value)}`
    }
}