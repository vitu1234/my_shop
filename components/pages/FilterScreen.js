import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X } from "lucide-react-native";

const FilterScreen = (props) => {

    const fetchFilters = async (categoryId) => {
        try {
            const rows = await db.getAllAsync(
                "SELECT filter_id, filter_name, filter_option_id, option_label FROM filters WHERE category_id = ?",
                [categoryId]
            );
    
            // Group filters by filter_id
            const filterMap = new Map();
    
            for (const row of rows) {
                if (!filterMap.has(row.filter_id)) {
                    filterMap.set(row.filter_id, {
                        id: String(row.filter_id),
                        title: row.filter_name,
                        options: []
                    });
                }
    
                filterMap.get(row.filter_id).options.push({
                    label: row.option_label,
                    selected: false
                });
            }
    
            const structuredFilters = Array.from(filterMap.values());
    
            setFilters(structuredFilters);
        } catch (error) {
            console.error("Error fetching filters:", error.message);
        }
    };
    


    const [filters, setFilters] = useState([
        {
            id: "1",
            title: "🚀 Rocket",
            options: [
                { label: "Rocket WOW Only", selected: false },
                { label: "Rocket Overseas Only", selected: false },
                { label: "Free Delivery", selected: false },
            ],
        },
        {
            id: "2",
            title: "Sort",
            options: [
                { label: "Our Ranking", selected: false },
                { label: "Low Price", selected: false },
                { label: "High Price", selected: false },
                { label: "Most Recent", selected: false },
            ],
        },
        {
            id: "3",
            title: "Discount",
            options: [
                { label: "Discounted Items", selected: false },
                { label: "Instant Discount", selected: false },
            ],
        },
        {
            id: "4",
            title: "Ship From",
            options: [
                { label: "US", selected: false },
                { label: "China", selected: false },
                { label: "Japan", selected: false },
            ],
        },
        {
            id: "5",
            title: "Product Condition",
            options: [
                { label: "New", selected: false },
                { label: "Used", selected: false },
                { label: "Damaged Box", selected: false },
                { label: "Returned", selected: false },
            ],
        },
    ]); 

    const toggleOption = (filterId, optionIndex) => {
        setFilters((prevFilters) =>
            prevFilters.map((filter) =>
                filter.id === filterId
                    ? {
                          ...filter,
                          options: filter.options.map((option, index) => ({
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
            <Text style={styles.sectionHeaderText}>{item.title}</Text>

            {/* Section Content */}
            <View style={styles.sectionContent}>
                <View style={styles.horizontalWrap}>
                    {item.options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.option,
                                option.selected && styles.optionSelected,
                            ]}
                            onPress={() => toggleOption(item.id, index)}
                        >
                            <View style={styles.optionRow}>
                                <Text
                                    style={[
                                        styles.optionText,
                                        option.selected && styles.optionTextSelected,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                                {/* Add "X" for deselecting if the option is selected and it's in the "Discount" section */}
                                {item.id !== "2" && option.selected && (
                                    <TouchableOpacity
                                        onPress={() => toggleOption(item.id, index)}
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
                keyExtractor={(item) => item.id}
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
                                options: filter.options.map((option) => ({
                                    ...option,
                                    selected: false,
                                })),
                            }))
                        )
                    }
                >
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>props.navigation.goBack()} style={styles.applyButton}>
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
