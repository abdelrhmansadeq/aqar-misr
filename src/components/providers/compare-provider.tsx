"use client";

import { createContext, useContext, useEffect, useState } from "react";

type CompareContextType = {
    compareList: string[];
    toggleCompare: (id: string) => void;
    isInCompare: (id: string) => boolean;
    clearCompare: () => void;
    isMounted: boolean;
};

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE = 3;

export function CompareProvider({ children }: { children: React.ReactNode }) {
    const [compareList, setCompareList] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const stored = localStorage.getItem("aqar_compare");
        if (stored) {
            try {
                setCompareList(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse compare list");
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("aqar_compare", JSON.stringify(compareList));
        }
    }, [compareList, isMounted]);

    const toggleCompare = (id: string) => {
        setCompareList((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            }
            if (prev.length >= MAX_COMPARE) {
                alert(`يمكنك مقارنة ${MAX_COMPARE} عقارات كحد أقصى.`);
                return prev;
            }
            return [...prev, id];
        });
    };

    const clearCompare = () => setCompareList([]);
    const isInCompare = (id: string) => compareList.includes(id);

    // if (!isMounted) return <>{children}</>;

    return (
        <CompareContext.Provider value={{ compareList, toggleCompare, isInCompare, clearCompare, isMounted }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (context === undefined) {
        throw new Error("useCompare must be used within a CompareProvider");
    }
    return context;
}