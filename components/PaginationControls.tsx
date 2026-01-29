"use client"
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

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
      {currentPage > 1 ? <Button onClick={prevPage} variant="ghost" className="text-muted cursor-pointer h-7 w-7 hover:bg-accent hover:text-muted-foreground focus-visible:ring-muted/30 focus-visible:ring-3" aria-label='Previous Page'><ChevronLeft className='size-6' strokeWidth={1} /></Button> : <div className='w-7 h-7' />}
      <div className='text-muted mx-1 text-sm -mt-[1.6px]'>{Math.max(1, currentPage)} / {totalPages}</div>
      {currentPage < totalPages ? <Button onClick={nextPage} variant="ghost" className="text-muted cursor-pointer h-7 w-7 hover:bg-accent hover:text-muted-foreground focus-visible:ring-muted/30 focus-visible:ring-3" aria-label='Next Page'><ChevronRight className='size-6' strokeWidth={1} /></Button> : <div className='w-7 h-7' />}
    </div>
  )
}

export default PaginationControls