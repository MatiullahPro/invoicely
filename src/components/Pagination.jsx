"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-xl"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                    <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(i + 1)}
                        className={`w-9 h-9 rounded-xl font-bold ${currentPage === i + 1 ? "shadow-lg shadow-primary/20" : ""}`}
                    >
                        {i + 1}
                    </Button>
                ))}
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-xl"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default Pagination;
