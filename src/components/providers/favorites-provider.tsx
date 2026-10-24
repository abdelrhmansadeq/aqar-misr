"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type FavoritesContextType = {
    favorites: string[];
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
    clearFavorites: () => void;
    isMounted: boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // بنكتم التحذير ده عشان إحنا مضطرين نقرأ من الـ localStorage أول ما الصفحة تفتح
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);

        const stored = localStorage.getItem("aqar_favorites");
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch {
                console.error("Failed to parse favorites");
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("aqar_favorites", JSON.stringify(favorites));
        }
    }, [favorites, isMounted]);

    const toggleFavorite = (id: string) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
        );
    };

    const clearFavorites = () => {
        setFavorites([]);
    };

    const isFavorite = (id: string) => favorites.includes(id);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, clearFavorites, isMounted }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error("useFavorites must be used within a FavoritesProvider");
    }
    return context;
}