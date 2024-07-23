

export const PAGETITLE = (props: any) => {
    return (
        <h3 {...props} >
            {props.children}
        </h3>
    );
}