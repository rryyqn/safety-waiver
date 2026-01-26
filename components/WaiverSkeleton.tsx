import { ChevronDown } from "lucide-react"

const WaiverSkeleton = () => {
  return (
    <div className=''>
        {Array.from({length: 20}, (_, index) => (

      <div key={index} className='border-b border-input'>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 py-3 pr-12 h-11 relative">

        <div className='w-40 h-full bg-accent animate-pulse' />
        <div className='w-40 h-full bg-accent hidden sm:block animate-pulse' />
        <div className='w-40 h-full bg-accent hidden sm:block animate-pulse' />
        <ChevronDown className="size-4 absolute text-muted/50 right-4 top-1/2 -translate-y-1/2 " />
        </div>


        </div>
        ))}
    </div>
  )
}

export default WaiverSkeleton
