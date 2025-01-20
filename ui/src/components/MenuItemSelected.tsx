import React, {createContext, useContext, useState, useMemo} from 'react';

/** Type definitions for the SelectedMenuItem context. */
type SelectedMenuItemContextType = {
    /** The currently selected menu option. */
    selectedOption: string;
    /** Function to update the selected menu option. */
    setSelectedOption: (option: string) => void;
};

/** Create the menu item context */
const SelectedMenuItemContext = createContext<SelectedMenuItemContextType | undefined>(undefined);

/** Assign a display name for better React DevTools identification */
SelectedMenuItemContext.displayName = 'SelectedMenuItemContext';

/**
 * Provides the SelectedMenuItem context to its children.
 *
 * The default selected menu item is `'Summary'`. Any component that needs to access
 * or update the selected menu item must be wrapped in this provider.
 *
 * @param children - The child components that will consume this context.
 *
 * @example
 * ```tsx
 * <SelectedMenuItemProvider>
 *   <YourComponent />
 * </SelectedMenuItemProvider>
 * ```
 */
export const SelectedMenuItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedOption, setSelectedOption] = useState('Summary');

    const selectedMenuItemValue = useMemo(() => ({ selectedOption, setSelectedOption }), [selectedOption]);

    return (
        <SelectedMenuItemContext.Provider value={selectedMenuItemValue}>
            {children}
        </SelectedMenuItemContext.Provider>
    );
};

/**
 * Custom hook to consume the SelectedMenuItem context.
 *
 * This hook provides access to the `selectedOption` and `setSelectedOption` function.
 *
 * @returns - The context value containing `selectedOption` and `setSelectedOption`.
 *
 * @throws - throws an error if used outside a `SelectedMenuItemProvider`.
 *
 * @example
 * ```tsx
 * const { selectedOption, setSelectedOption } = useSelectedMenuItem();
 * ```
 */
export const useSelectedMenuItem = () => {
    const context = useContext(SelectedMenuItemContext);
    if (!context) {
        throw new Error('useSelectedMenuItem must be used within a SelectedMenuItemProvider');
    }
    return context;
};