


export const BUTTON = (props: any) => {
    return (
        <button
            type={props.type || "button"}
            className={`button ${props.className || ""}`}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}
export const BLOCKBUTTON = (props: any) => {
    return (
        <button
            type={props.type || "button"}
            className={`button w-100 ${props.className || ""}`}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}

export const INPUT = (props: any) => {
    return (
        <input
            type={props.type || "text"}
            className={`form-control ${props.className || ""}`}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
        />
    );
}