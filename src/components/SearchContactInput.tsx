import { IoSearch } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

interface Props {
  type?: string;
  ref?: React.RefObject<HTMLInputElement | null>
}

const SearchContactInput = ({ type, ref }: Props) => {
  const navigate = useNavigate();

  const handleNavigate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    navigate('/')
  }

  return (
    <Link to={'/search'} className="relative flex items-center">
        <input 
          ref={ref}
          type="text"
          className="bg-neutral-800 rounded-full w-full h-11 cursor-pointer focus:outline-none ps-12"
          readOnly={type === "home"}
          onClick={() => console.log("hello")}
          placeholder="Search contacts"
        />
        {type == "home" ?
          <span className="absolute text-2xl left-4"><IoSearch /></span>
          :
          <button className="absolute text-2xl left-4 cursor-pointer" onClick={handleNavigate}><IoMdArrowBack /></button>
        }
    </Link>
  )
}

export default SearchContactInput
