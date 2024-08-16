import {registerSheet, SheetDefinition} from 'react-native-actions-sheet';
import SortActionSheet from '../search/SortActionSheet';

registerSheet('sort-action-sheet', SortActionSheet);

// We extend some of the types here to give us great intellisense
// across the app for all registered sheets.
declare module 'react-native-actions-sheet' {
    export interface Sheets {
        'sort-action-sheet': SheetDefinition;
    }
}

export {};
