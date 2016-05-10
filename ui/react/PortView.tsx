import * as React from 'react';

interface DemoProps {
    name:string;
    age:number;
}

export default class PortView extends React.Component<DemoProps, any> {
    private foo:number;
    constructor(props:DemoProps) {
        super(props);
        this.foo = 42;
    }
    render() {
        return <div>{this.props.name} - {this.props.age}</div>
    }
}