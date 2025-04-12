import { useEffect, useRef } from "react"
import SearchContactInput from "../components/SearchContactInput"

const Search = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(inputRef.current){
      inputRef.current.focus();
    }
  }, []);
  
  return (
    <div className="bg-neutral-900 w-full text-neutral-100">
      <header>
        <SearchContactInput ref={inputRef} />
      </header>
      <main>

      </main>
    </div>
  )
}

export default Search
