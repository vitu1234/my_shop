import React from 'react';

export const CartContext = React.createContext();
export const AppContext= React.createContext(false);
export const ProductFilterModalContext= React.createContext();
export const SearchInputTextContext = React.createContext({
    searchText: '',
    setSearchText: () => {},
    searchSuggestionType: '',
    setSearchSuggestionType: () => {},
    searchSuggestionItemId: '',
    setSearchSuggestionItemId: () => {},
    searchSuggestionItemName: '',
    setSearchSuggestionItemName: () => {},
});


