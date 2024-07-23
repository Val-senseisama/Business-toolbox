import React from "react";
import uuid from "../Helpers/UUID";
import { readBase64, resizeImage } from "../Helpers/FileHandling";



export const BUTTON = (props: any) => {
    return (
        <button
            type={props.type || "button"}
            className={`btn btn-primary ${props.className || ""}`}
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
            className={`btn btn-primary w-100 ${props.className || ""}`}
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

export const FILE = (props: any) => {
    const [text, setText] = React.useState('');
    const id = props.id || uuid();

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const text: string = await readBase64(event.target.files[0]);

            props.onChange(text);
            const formatter = Intl.NumberFormat('en', { notation: 'compact' });
            let n = formatter.format(text.length);
            setText(n);
        }
    };



    return (
        <div>
            <input
                type="file"
                id={id}
                onChange={handleChange}
                accept="image/*,application/pdf,video/*,audio/*"
                style={{ display: 'none' }}
            />
            {
                text &&
                <div className='d-flex justify-content-between align-content-center  w3-animate-zoom'>

                    <div>{text}b File</div>
                    <BUTTON className="transparent" onClick={() => {
                        setText('');
                        const element = document.getElementById(id) as HTMLInputElement;
                        if (element) {
                            element.value = '';
                        }
                        props.onChange('');
                    }}>
                        &times;
                    </BUTTON>
                </div>
            }
            <BUTTON onClick={() => {
                const element = document.getElementById(id) as HTMLInputElement;
                element.click()
            }} type='button' className={props.className || ''}>{props.children}</BUTTON>
        </div>
    );
};

export const IMAGE = (props: any) => {
    const [image, setImage] = React.useState(props.value);
    const id = props.id || uuid();
    // Call a function (passed as a prop from the parent component)
    // to handle the user-selected file 
    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const b64 = await resizeImage(event.target.files[0]);
            props.onChange(b64);
            setImage(b64);
        }
    };


    return (
        <div>
            <div className={image && 'd-none'}>
                <BUTTON onClick={() => {
                    const element = document.getElementById(id) as HTMLInputElement;
                    if (element) {
                        element.click()
                    }
                }} className={props.className}>{props.children}</BUTTON>
            </div>
            <input
                type="file"
                id={id}
                onChange={handleChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
            {
                image &&
                <div className='mt-3 w3-display-container  w3-animate-zoom'>
                    <div className='w3-center text-center'><img src={image} className="w-100" style={{ maxWidth: '250px' }} /></div>
                    <BUTTON onClick={() => {
                        setImage('');
                        const element = document.getElementById(id) as HTMLInputElement;
                        if (element) {
                            element.value = '';
                        }
                        props.onChange('');
                    }} className="btn-danger">
                        &times;
                    </BUTTON>
                </div>
            }
        </div>
    );
};



export const CHECKBOX = (props: {
    value?: boolean;
    name?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    children: React.ReactNode;
}) => {
    return (
        <label className="w-100" >
            <div className="p-2">
                <input className="w3-check" type="checkbox" checked={props.value || false} name={props.name || ''} onChange={props.onChange} />
                &nbsp;{props.children}
            </div>
        </label>
    );
};

export const TEXTAREA = (props: {
    value?: string;
    name?: string;
    className?: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
}) => {
    return (
        <textarea value={props.value || ''} name={props.name || uuid()} className={'form-control ' + props.className} onChange={props.onChange} placeholder={props.placeholder || ''} />
    );
};

export const SELECT = (props: {
    name?: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <select name={props.name || uuid()} onChange={props.onChange} className={'form-control ' + props.className}>
            {props.children}
        </select>
    );
};
