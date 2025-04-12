import { ReactNode } from "react"

interface Props {
  children: ReactNode;
}

const Page = ({children}: Props) => {
  return (
    <div className='pt-4'>
      {children}
    </div>
  )
}

export default Page
