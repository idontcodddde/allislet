export type MacroActionType = "click" | "input" | "scroll";

export interface MacroAction {
  type: MacroActionType;
  selector: string;
  value?: string;
  scrollX?: number;
  scrollY?: number;
  timestamp: number;
  delay: number;
}