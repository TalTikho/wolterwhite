import React, { createContext, useContext, useState } from 'react';

const RestaurantFilterContext = createContext();

export const useRestaurantFilter = () => useContext(RestaurantFilterContext);

export const RestaurantFilterProvider = ({ children }) => {
    const [search, setSearch] = useState('');

    // Structured filters (beyond the name search above):
    // - address: substring match on the restaurant's address
    // - searchScope: restricts what the main search box matches against —
    //   'both' (default), 'restaurant', or 'product'
    // Kept as one object so x/y coordinates can be dropped in later too
    // (e.g. lat/lng/radius) without changing how any of this is consumed.
    const [filters, setFilters] = useState({ address: '', searchScope: 'both' });

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ address: '', searchScope: 'both' });
    };

    // Whether the restaurant grid is shown at all — the "Clear view" toggle.
    const [cardsVisible, setCardsVisible] = useState(true);
    const toggleCardsVisible = () => setCardsVisible((prev) => !prev);

    // "Near me" radius filter — on by default (the Wolt-style behavior of
    // showing what's close by as soon as you log in). Users can switch it
    // off to see every restaurant regardless of distance, then back on.
    const NEAR_ME_RADIUS_KM = 1;
    const [nearMeOnly, setNearMeOnly] = useState(true);
    const toggleNearMeOnly = () => setNearMeOnly((prev) => !prev);

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
                nearMeOnly,
                toggleNearMeOnly,
                nearMeRadiusKm: NEAR_ME_RADIUS_KM,
            }}
        >
            {children}
        </RestaurantFilterContext.Provider>
    );
};