import React from 'react';

export const CartContext = React.createContext();
export const AppContext= React.createContext(false);
export const ProductFilterModalContext= React.createContext(false);
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

export const sortFilterContext = React.createContext({
    parentScreenName: '', //track which screen to go back to [either on products or categories screen]
    setParentScreenName: () => {},
    searchSuggestionType: '',
    setSearchSuggestionType: () => {},
    searchSuggestionItemId: '',
    setSearchSuggestionItemId: () => {},
    searchSuggestionItemName: '',
    setSearchSuggestionItemName: () => {},
});



