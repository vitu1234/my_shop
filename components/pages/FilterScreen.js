import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { useRoute } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';

const FilterScreen = (props) => {

    const route = useRoute();
    const db = useSQLiteContext();

    const categoryId = route.params?.category_id ?? -1;
    const subCategoryId = route.params?.sub_category_id ?? -1;
    const screenName = route.params?.screenName
    const [filters, setFilters] = useState([]);


    // console.log("Received category_id in Filter screen:", categoryId);
    // console.log("Received screen name go back to:", screenName);

    console.log("Category ID in FilterScreen:", categoryId);
    console.log("Sub Category ID in FilterScreen:", subCategoryId);

    const fetchFilters = async (categoryId) => {
        try {
            let rows
            if (categoryId !== -1) {
                rows = await db.getAllAsync(
                    "SELECT filter_id, filter_name, filter_option_id, option_label FROM filters WHERE category_id = ? GROUP BY filter_option_id",
                    [categoryId]
                );
            } else {

                rows = await db.getAllAsync(
                    "SELECT * FROM filters WHERE is_default = 1 GROUP BY filter_option_id",
                );
            }

            // Group filters by filter_id
            const filterMap = new Map();

            for (const row of rows) {
                if (!filterMap.has(row.filter_id)) {
                    filterMap.set(row.filter_id, {
                        filter_id: String(row.filter_id),
                        filter_name: row.filter_name,
                        filter_options: []
                    });
                }

                filterMap.get(row.filter_id).filter_options.push({
                    filter_option_id: row.filter_option_id,
                    option_label: row.option_label,
                    selected: false
                });
            }

            const structuredFilters = Array.from(filterMap.values());

            setFilters(structuredFilters);
        } catch (error) {
            console.error("Error fetching filters:", error.message);
        }
    };

    useEffect(() => {
        fetchFilters(categoryId)

    }, [categoryId]);



    const toggleOption = (filterId, optionIndex) => {
        setFilters((prevFilters) =>
            prevFilters.map((filter) =>
                filter.filter_id === filterId
                    ? {
                        ...filter,
                        filter_options: filter.filter_options.map((option, index) => ({
                            ...option,
                            selected:
                                filterId === "3" || filterId === 4// For "Discount" section
                                    ? index === optionIndex
                                        ? !option.selected // Toggle selection
                                        : option.selected
                                    : filterId === "2" // For "Sort" section
                                        ? index === optionIndex // Only allow one option to be selected
                                        : index === optionIndex
                                            ? !option.selected
                                            : option.selected,
                        })),
                    }
                    : filter
            )
        );
    };

    const renderFilterItem = ({ item }) => (
        <View>
            {/* Section Header */}
            <Text style={styles.sectionHeaderText}>{item.filter_name}</Text>

            {/* Section Content */}
            <View style={styles.sectionContent}>
                <View style={styles.horizontalWrap}>
                    {item.filter_options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.option,
                                option.selected && styles.optionSelected,
                            ]}
                            onPress={() => toggleOption(item.filter_id, index)}
                        >
                            <View style={styles.optionRow}>
                                <Text
                                    style={[
                                        styles.optionText,
                                        option.selected && styles.optionTextSelected,
                                    ]}
                                >
                                    {option.option_label}
                                </Text>
                                {/* Add "X" for deselecting if the option is selected and it's in the "Discount" section */}
                                {item.filter_id !== "2" && option.selected && (
                                    <TouchableOpacity
                                        onPress={() => toggleOption(item.filter_id, index)}
                                    >
                                        <Text style={styles.deselectText}> X</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <SafeAreaView style={styles.headerContainer}>
                <Text style={styles.header}>Filters</Text>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <X color={"#000"} strokeWidth={3} />
                </TouchableOpacity>
            </SafeAreaView>

            {/* FlatList for Filters */}
            <FlatList
                data={filters}
                keyExtractor={(item) => item.filter_id}
                renderItem={renderFilterItem}
                contentContainerStyle={styles.listContainer}
            />

            {/* Reset and Apply Buttons */}
            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() =>
                        setFilters((prevFilters) =>
                            prevFilters.map((filter) => ({
                                ...filter,
                                filter_options: filter.filter_options.map((option) => ({
                                    ...option,
                                    selected: false,
                                })),
                            }))
                        )
                    }
                >
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        const selectedFilters = filters
                            .map(f => ({
                                filter_id: f.filter_id,
                                filter_name: f.filter_name,
                                filter_options: f.filter_options.filter(o => o.selected).map(o => ({
                                    filter_option_id: o.filter_option_id,
                                    option_label: o.option_label,
                                })),
                            }))
                            .filter(f => f.filter_options.length > 0);

                        props.navigation.navigate({
                            name: screenName,
                            params: { selectedFilters, sub_category_id: subCategoryId },
                            merge: true,
                        });

                        // props.navigation.goBack();
                    }}
                    style={styles.applyButton}
                >
                    <Text style={styles.buttonText}>Apply</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
    },
    listContainer: {
        paddingBottom: 100, // To avoid overlapping with buttons
    },
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: "bold",
        padding: 16,
        backgroundColor: "#f0f0f0",
    },
    sectionContent: {
        padding: 16,
        backgroundColor: "#f8f8f8",
    },
    horizontalWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    option: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
        borderRadius: 5,
        marginBottom: 8,
        marginRight: 8, // Add spacing between items
    },
    optionSelected: {
        backgroundColor: "#FF5722",
    },
    optionText: {
        fontSize: 14,
        color: "#333",
    },
    optionTextSelected: {
        color: "#fff",
    },
    actionButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: "#fff",
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
    resetButton: {
        flex: 1,
        backgroundColor: "#e0e0e0",
        padding: 16,
        borderRadius: 5,
        marginRight: 8,
        alignItems: "center",
    },
    applyButton: {
        flex: 1,
        backgroundColor: "#FF5722",
        padding: 16,
        borderRadius: 5,
        marginLeft: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    deselectButton: {
        marginLeft: 8,
        backgroundColor: "#FF5722",
        borderRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    deselectText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
    },
});

export default FilterScreen;
