"use client"
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const PaginationControls = ({currentPage, totalPages}: {currentPage: number, totalPages: number}) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const nextPage = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (currentPage === totalPages) return
        params.set("page", (currentPage + 1).toString());
        router.push(`${pathname}?${params.toString()}`);
      };
    const prevPage = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (currentPage === 1) return
        if (currentPage === 2) {
            params.delete("page")
        }
        else {
            params.set("page", (currentPage - 1).toString());
        }
        router.push(`${pathname}?${params.toString()}`);
      };
    
  return (
    <div className='flex items-center'>
      {currentPage > 1 ? <button onClick={prevPage} className="cursor-pointer p-2" aria-label='Previous Page'><ChevronLeft className='text-muted size-6' strokeWidth={1} /></button> : <div className='w-10 h-10' />}
      <div className='text-muted text-sm -mx-2 -mt-[1.6px]'>{Math.max(1, currentPage)} / {totalPages}</div>
      {currentPage < totalPages ? <button onClick={nextPage} className="cursor-pointer p-2" aria-label='Next Page'><ChevronRight className='text-muted size-6' strokeWidth={1} /></button> : <div className='w-10 h-10' />}
    </div>
  )
}

export default PaginationControls