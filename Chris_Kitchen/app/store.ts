import { useEffect, useState } from "react";

export type Preference =
  | "Vegetarian"
  | "High Protein"
  | "No Spice"
  | "Quick Pick"
  | "Seasonal";

export type MealCourse = {
  id: string;
  step: number;
  name: string;
  description: string;
  price: number;
  accent: string;
  tags: Preference[];
  prepMinutes: number;
};

export type ChefOrderStatus = "Awaiting" | "Preparing" | "Ready" | "Served";

export type ChefOrder = {
  id: number;
  customer: string;
  preferences: Preference[];
  items: string[];
  total: number;
  estimateMinutes: number;
  status: ChefOrderStatus;
  createdAt: number;
  deadlineAt: number;
  alert?: string;
};

export type ConfirmationState = {
  orderId: number;
  preferences: Preference[];
  estimateMinutes: number;
  courseCount: number;
  servedAtLabel: string;
};

export const defaultPreferences: Preference[] = ["Seasonal", "High Protein"];

export const mealCourses: MealCourse[] = [
  {
    id: "course-1",
    step: 1,
    name: "Citrus Pearl Amuse",
    description: "A bright start with basil oil, grapefruit, and toasted pistachio dust.",
    price: 266,
    accent: "#E7C67A",
    tags: ["Seasonal", "Vegetarian"],
    prepMinutes: 10,
  },
  {
    id: "course-2",
    step: 2,
    name: "Garden Ember Salad",
    description: "Charred greens, whipped feta, pickled shallot, and herb vinaigrette.",
    price: 361,
    accent: "#C9D9B1",
    tags: ["Vegetarian", "High Protein", "No Spice"],
    prepMinutes: 12,
  },
  {
    id: "course-3",
    step: 3,
    name: "Lemon Herb Filet",
    description: "Oak-fired salmon with saffron rice and blistered spring vegetables.",
    price: 712,
    accent: "#D7B892",
    tags: ["High Protein", "Seasonal"],
    prepMinutes: 18,
  },
  {
    id: "course-4",
    step: 4,
    name: "Dark Cocoa Torte",
    description: "Silken chocolate, orange zest, and a delicate almond crumble.",
    price: 332,
    accent: "#B48F75",
    tags: ["Quick Pick", "Vegetarian"],
    prepMinutes: 8,
  },
];

const listeners = new Set<() => void>();

let selectedPreferences: Preference[] = [...defaultPreferences];
let selectedCourseIds: string[] = [];
let publishedMenu: MealCourse[] = mealCourses.map((course) => ({ ...course }));
let isMenuPublished = true;
let chefOrders: ChefOrder[] = [];
let confirmation: ConfirmationState | null = null;

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const getCustomerPreferences = () => [...selectedPreferences];
export const getSelectedCourseIds = () => [...selectedCourseIds];
export const getPublishedMenu = () => publishedMenu.map((course) => ({ ...course }));
export const getPublishedMenuStatus = () => isMenuPublished;

export const setCustomerPreferences = (nextPreferences: Preference[]) => {
  selectedPreferences = nextPreferences.length ? [...nextPreferences] : [...defaultPreferences];
  notify();
};

export const setSelectedCourseIds = (nextSelection: string[]) => {
  selectedCourseIds = [...nextSelection];
  notify();
};

export const setPublishedMenu = (nextMenu: MealCourse[]) => {
  publishedMenu = nextMenu.map((course) => ({ ...course }));
  isMenuPublished = true;
  notify();
};

export const addMenuItem = (item: MealCourse) => {
  publishedMenu = [...publishedMenu, { ...item }];
  isMenuPublished = true;
  notify();
};

export const updateMenuItem = (itemId: string, updates: Partial<MealCourse>) => {
  publishedMenu = publishedMenu.map((course) =>
    course.id === itemId ? { ...course, ...updates } : course,
  );
  isMenuPublished = true;
  notify();
};

export const removeMenuItem = (itemId: string) => {
  publishedMenu = publishedMenu.filter((course) => course.id !== itemId);
  selectedCourseIds = selectedCourseIds.filter((id) => id !== itemId);
  isMenuPublished = true;
  notify();
};

export const getFilteredCourses = () => {
  const currentMenu = publishedMenu.length ? publishedMenu : mealCourses;

  if (!selectedPreferences.length) return currentMenu.map((course) => ({ ...course }));

  const selectedSet = new Set(selectedPreferences);

  return currentMenu.filter((course) =>
    course.tags.some((tag) => selectedSet.has(tag)),
  );
};

export const submitCustomerMealOrder = (
  chosenCourseIds: string[] = [],
) => {
  const chosenCourses = publishedMenu.filter((course) => chosenCourseIds.includes(course.id));

  if (!chosenCourses.length) {
    return null;
  }

  const preferences = selectedPreferences.length ? selectedPreferences : [...defaultPreferences];
  const total = chosenCourses.reduce((sum, course) => sum + course.price, 0);
  const estimateMinutes = Math.max(
    18,
    chosenCourses.reduce((sum, course) => sum + course.prepMinutes, 0) / 2 + preferences.length * 4,
  );
  const createdAt = Date.now();
  const order: ChefOrder = {
    id: createdAt,
    customer: "Nia",
    preferences,
    items: chosenCourses.map((course) => course.name),
    total,
    estimateMinutes: Math.round(estimateMinutes),
    status: "Awaiting",
    createdAt,
    deadlineAt: createdAt + Math.round(estimateMinutes) * 60 * 1000,
    alert: `New order • preferences: ${preferences.join(", ")}`,
  };

  chefOrders = [order, ...chefOrders];
  confirmation = {
    orderId: order.id,
    preferences,
    estimateMinutes: order.estimateMinutes,
    courseCount: chosenCourses.length,
    servedAtLabel: `Estimated serving in ${order.estimateMinutes} minutes`,
  };
  selectedCourseIds = [];
  notify();
  return order;
};

export const getChefOrders = () => chefOrders.map((order) => ({ ...order }));
export const getConfirmation = () => (confirmation ? { ...confirmation } : null);

export const clearConfirmation = () => {
  confirmation = null;
  notify();
};

export const cycleChefOrderStatus = (orderId: number) => {
  chefOrders = chefOrders.map((order) => {
    if (order.id !== orderId) return order;

    if (order.status === "Awaiting") {
      return { ...order, status: "Preparing", alert: `Preparing • ${order.preferences.join(", ")}` };
    }

    if (order.status === "Preparing") {
      return { ...order, status: "Ready", alert: `Ready to serve • ${order.preferences.join(", ")}` };
    }

    if (order.status === "Ready") {
      return { ...order, status: "Served", alert: `Served • ${order.preferences.join(", ")}` };
    }

    return order;
  });
  notify();
};

export const serveChefOrder = (orderId: number) => {
  chefOrders = chefOrders.filter((order) => order.id !== orderId);
  notify();
};

export const getChefAlerts = () => {
  const now = Date.now();
  return chefOrders.map((order) => {
    const overdue = now > order.deadlineAt;
    return {
      id: order.id,
      text: overdue
        ? `Timeout alert • ${order.preferences.join(", ")} • ${order.items.join(" / ")}`
        : order.alert ?? `New order • ${order.preferences.join(", ")}`,
      overdue,
    };
  });
};

export function useAppStore() {
  const [state, setState] = useState(() => ({
    preferences: getCustomerPreferences(),
    courses: getFilteredCourses(),
    publishedMenu: getPublishedMenu(),
    isMenuPublished: getPublishedMenuStatus(),
    selectedCourseIds: getSelectedCourseIds(),
    chefOrders: getChefOrders(),
    confirmation: getConfirmation(),
    alerts: getChefAlerts(),
  }));

  useEffect(() => {
    const listener = () => {
      setState({
        preferences: getCustomerPreferences(),
        courses: getFilteredCourses(),
        publishedMenu: getPublishedMenu(),
        isMenuPublished: getPublishedMenuStatus(),
        selectedCourseIds: getSelectedCourseIds(),
        chefOrders: getChefOrders(),
        confirmation: getConfirmation(),
        alerts: getChefAlerts(),
      });
    };

    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return state;
}
