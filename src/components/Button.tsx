

type buttontypes ={
    text : string,
    onClick : ()=> void,
    className ?: string,
    type ?: "button" | "submit" | "reset",
    disabled ?: boolean
}

export const Button = ({text, onClick, className, type, disabled}:buttontypes)=> {
    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`dark:bg-ink-soft hover-scale-[1.01]
             border-gold-500 dark:hover:bg-ink-line border-[0.5px] bg-paper
              hover:bg-gold-100 hover:bg-opacity-100
                w-full flex justify-center items-center
         text-white font-bold py-2  px-4 ${className}`} >
           <p className="text-center text-base text-black  leading-[30px]
            font-semibold dark:text-paper">
            {text}
           </p>
        </button>
    )
}