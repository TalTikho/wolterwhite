import React, { createContext, useContext, useState } from 'react';

const RestaurantFilterContext = createContext();

export const useRestaurantFilter = () => useContext(RestaurantFilterContext);

export const RestaurantFilterProvider = ({ children }) => {
    const [search, setSearch] = useState('');

    // Structured filters (beyond the name search above). Address is the only
    // field today, but this is kept as an object so x/y coordinates can be
    // dropped in later (e.g. { address: '', lat: null, lng: null, radius: null })
    // without changing how any of this is consumed.
    const [filters, setFilters] = useState({ address: '' });

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ address: '' });
    };

    // Whether the restaurant grid is shown at all — the "Clear view" toggle.
    const [cardsVisible, setCardsVisible] = useState(true);
    const toggleCardsVisible = () => setCardsVisible((prev) => !prev);

    return (
        <RestaurantFilterContext.Provider
            value={{
                search,
                setSearch,
                filters,
                updateFilter,
                clearFilters,
                cardsVisible,
                toggleCardsVisible,
            }}
        >
            {children}
        </RestaurantFilterContext.Provider>
    );
};