"use client"

import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex justify-center mt-8">
      <nav>
        <ul className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <li key={number}>
              <Button
                variant={currentPage === number ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(number)}
              >
                {number}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
