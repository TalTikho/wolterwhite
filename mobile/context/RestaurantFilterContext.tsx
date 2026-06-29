import React, { createContext, useContext, useState } from 'react';

type FilterState = {
  address: string;
  searchScope: 'both' | 'restaurant' | 'product';
};

type RestaurantFilterContextType = {
  search: string;
  setSearch: (val: string) => void;
  filters: FilterState;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  clearFilters: () => void;
  cardsVisible: boolean;
  toggleCardsVisible: () => void;
  nearMeOnly: boolean;
  toggleNearMeOnly: () => void;
  nearMeRadiusKm: number;
};

const RestaurantFilterContext = createContext<RestaurantFilterContextType>({
  search: '',
  setSearch: () => {},
  filters: { address: '', searchScope: 'both' },
  updateFilter: () => {},
  clearFilters: () => {},
  cardsVisible: true,
  toggleCardsVisible: () => {},
  nearMeOnly: true,
  toggleNearMeOnly: () => {},
  nearMeRadiusKm: 1,
});

export const useRestaurantFilter = () => useContext(RestaurantFilterContext);

export const RestaurantFilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<FilterState>({ address: '', searchScope: 'both' });

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters({ address: '', searchScope: 'both' });

  const [cardsVisible, setCardsVisible] = useState(true);
  const toggleCardsVisible = () => setCardsVisible((prev) => !prev);

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