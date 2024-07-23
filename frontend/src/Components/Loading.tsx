import { useState } from "react";

export const Loading = ({ fullPage = true, message = "L.O.A.D.I.N.G", timing = false }) => {
    const [timer, setTimer] = useState(0);
    setTimeout(() => { setTimer(timer + 1); }, 1200);
    const myClass = fullPage ? 'loading' : '';
    return (
        <div className={myClass + ' d-flex flex-wrap align-content-center justify-content-center'}>
            <div className='text-center'>
                <div className="spinner-border text-dark  ms-2 me-2"></div>
                <div className='text-center mt-4 w3-wide'>{message}</div>
                {timing && <div className='text-center w3-small my-2'>{Math.floor(timer / 60) + '  mins '} {(timer % 60) + ' secs'} </div>}
            </div>
        </div>
    );
};