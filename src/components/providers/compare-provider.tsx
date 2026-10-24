"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type CompareItem = { id: string; purpose: string };

type CompareContextType = {
    compareList: CompareItem[];
    toggleCompare: (id: string, purpose: string) => void;
    isInCompare: (id: string) => boolean;
    clearCompare: () => void;
    isMounted: boolean;
};

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE = 3;

export function CompareProvider({ children }: { children: React.ReactNode }) {
    const [compareList, setCompareList] = useState<CompareItem[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
        const stored = localStorage.getItem("aqar_compare");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // لو البيانات القديمة كانت عبارة عن مصفوفة IDs، بنفضيها عشان نبدأ بالشكل الجديد
                if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
                    setCompareList([]);
                } else {
                    setCompareList(parsed);
                }
            } catch {
                console.error("Failed to parse compare list");
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("aqar_compare", JSON.stringify(compareList));
        }
    }, [compareList, isMounted]);

    const toggleCompare = (id: string, purpose: string) => {
        setCompareList((prev) => {
            const exists = prev.find((item) => item.id === id);

            if (exists) {
                return prev.filter((item) => item.id !== id);
            }

            if (prev.length >= MAX_COMPARE) {
                toast.error(`يمكنك مقارنة ${MAX_COMPARE} عقارات كحد أقصى.`);
                return prev;
            }

            if (prev.length > 0 && prev[0].purpose !== purpose) {
                toast.error("لا يمكن مقارنة عقارات للبيع مع عقارات للإيجار.");
                return prev;
            }

            return [...prev, { id, purpose }];
        });
    };

    const clearCompare = () => setCompareList([]);
    const isInCompare = (id: string) => compareList.some((item) => item.id === id);

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