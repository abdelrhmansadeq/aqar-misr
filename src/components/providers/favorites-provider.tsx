"use client";

import { createContext, useContext, useEffect, useState } from "react";

type FavoritesContextType = {
    favorites: string[];
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
    isMounted: boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const stored = localStorage.getItem("aqar_favorites");
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (e) {
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

    const isFavorite = (id: string) => favorites.includes(id);

    // دايماً بنرجع الـ Provider، الـ isMounted بنستخدمه جوه المكونات
    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, isMounted }}>
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