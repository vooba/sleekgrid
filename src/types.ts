import type { Event } from "./core/event";
import type { Grid } from "./grid/grid";
import type { Range } from "./core/range";

export interface IPlugin {
    init(grid: Grid): void;
    pluginName?: string;
    destroy?: () => void;
}

export interface Position {
    bottom?: number;
    height?: number;
    left?: number;
    right?: number;
    top?: number;
    visible?: boolean;
    width?: number;
}

export interface RowCell {
    row: number;
    cell: number;
}

export interface SelectionModel extends IPlugin {
    setSelectedRanges(ranges: Range[]): void;
    onSelectedRangesChanged: Event<Range[]>;
    refreshSelections?(): void;
}

export interface ViewRange {
    top?: number;
    bottom?: number;
    leftPx?: number;
    rightPx?: number;
}
