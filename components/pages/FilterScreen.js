import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Collapsible from "react-native-collapsible";
import { X } from "lucide-react-native";

const FilterScreen = () => {
    const [filters, setFilters] = useState([
        {
            id: "1",
            title: "🚀 Rocket",
            options: ["Rocket WOW Only", "Rocket Overseas Only", "Free Delivery"],
            collapsed: false,
        },
        {
            id: "2",
            title: "Sort",
            options: ["Coupang Ranking", "Low Price", "High Price", "Most Recent"],
            collapsed: true,
        },
        {
            id: "3",
            title: "Discount",
            options: ["Discounted Items", "Instant Discount"],
            collapsed: true,
        },
        {
            id: "4",
            title: "Ship From",
            options: ["US", "China", "Japan"],
            collapsed: true,
        },
        {
            id: "5",
            title: "Product Condition",
            options: ["New", "Damaged Box", "Returned"],
            collapsed: true,
        },
    ]);

    const toggleCollapse = (id) => {
        setFilters((prevFilters) =>
            prevFilters.map((filter) =>
                filter.id === id ? { ...filter, collapsed: !filter.collapsed } : filter
            )
        );
    };

    const renderFilterItem = ({ item }) => (
        <View>
            {/* Section Header */}
            <TouchableOpacity
                onPress={() => toggleCollapse(item.id)}
                style={styles.sectionHeader}
            >
                <Text style={styles.sectionHeaderText}>{item.title}</Text>
            </TouchableOpacity>

            {/* Collapsible Section Content */}
            <Collapsible collapsed={item.collapsed}>
                <View style={styles.sectionContent}>
                    {item.options.map((option, index) => (
                        <TouchableOpacity key={index} style={styles.option}>
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Collapsible>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <SafeAreaView style={styles.headerContainer}>
                <Text style={styles.header}>Filters</Text>
                <TouchableOpacity><X color={"#000"} strokeWidth={3}></X></TouchableOpacity>
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
                <TouchableOpacity style={styles.resetButton}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyButton}>
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
        // alignItems: "center",
        paddingStart: 16,
        paddingEnd: 16,
        backgroundColor: "#fff",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
    },
    listContainer: {
        paddingBottom: 100, // To avoid overlapping with buttons
    },
    sectionHeader: {
        padding: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    sectionContent: {
        padding: 16,
        backgroundColor: "#f8f8f8",
    },
    option: {
        paddingVertical: 10,
    },
    optionText: {
        fontSize: 14,
        color: "#333",
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
});

export default FilterScreen;
