import { MouseEventHandler } from 'react'
import { IoMdAdd } from 'react-icons/io'

interface Props {
  handleClick: MouseEventHandler<HTMLButtonElement>;
}

const AddContactButton = ({ handleClick }: Props) => {
  return (
    <button className='text-2xl border border-pink-900 bg-pink-950 text-white rounded-lg p-2 h-14 w-14 flex items-center justify-center' onClick={handleClick}><IoMdAdd /></button>
  )
}

export default AddContactButton
