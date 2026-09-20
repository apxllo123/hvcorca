import { px } from "utils/udim2";

/** Number of tabs in the navbar. Must match the entry count of `PAGE_TO_INDEX`. */
export const TAB_COUNT = 5;

/** Width of a single navbar tab, in pixels. */
export const TAB_WIDTH = 100;

export const TAB_SIZE = px(TAB_WIDTH, 56);

export const NAVBAR_SIZE = px(TAB_COUNT * TAB_WIDTH, 56);
