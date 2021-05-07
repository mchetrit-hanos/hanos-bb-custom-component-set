(() => ({
    name: 'HelloWorld',
    type: 'BODY_COMPONENT',
    allowedTypes: [],
    orientation: 'HORIZONTAL',
    jsx: (() => {
        const { content } = options
        return <div className={classes.root}>{content}</div>;
    })(),
    styles: B => theme => {
        const style = new B.Styling(theme);
        return {
            root: {
                color: "purple",
            },
        };
    },
}))();