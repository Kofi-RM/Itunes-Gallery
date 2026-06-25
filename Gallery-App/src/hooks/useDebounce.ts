import { useEffect, useState } from "react"


export default function useDebounce( input : string) {
    const [debounceValue, setDebounceValue] = useState(input)
    const isLoading = input !== debounceValue;
    const delay = 500;
    useEffect(() => {
       
        const timer = setTimeout(() => {
     
            setDebounceValue(input)
            

        }, delay)

        return () => clearTimeout(timer);
    }
        , [delay, input])
        
    return {debounceValue,
        isLoading
    }
}