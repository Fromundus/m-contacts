import { MouseEventHandler, ReactNode } from 'react';
import { IoClose } from 'react-icons/io5'

interface Props {
  title: string;
  onClose: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

function Modal({title, onClose, children }: Props) {
    return (
        <div
            className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex justify-center items-start overflow-y-auto not-printable-components"
            style={{ zIndex: 1000 }}
            onClick={(e) => e.stopPropagation()}
        >
            <div
                className="w-full h-auto relative"
                onClick={(e) => e.stopPropagation()}
            >   
                <div className='flex items-center justify-center w-full relative p-4 border-b border-neutral-800'>
                    <span className='font-semibold text-lg'>{title}</span>
                    <button
                        className="absolute left-4 p-2"
                        onClick={onClose}
                    >
                        <IoClose className="text-3xl" />
                    </button>
                </div>
                <div className='p-4'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal