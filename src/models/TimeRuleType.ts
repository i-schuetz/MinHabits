export enum TimeRuleType {
  Weekday,
  TimesIn,
  Each
}

export namespace TimeRuleType {
  export function toJSON(timeRuleType: TimeRuleType): string {
      switch(timeRuleType) {
        case TimeRuleType.Weekday: return "w";
        case TimeRuleType.TimesIn: return "t";
        case TimeRuleType.Each: return "e";
      };
  }

  export function parse(str: string): TimeRuleType {
    switch(str) {
      case "w": return TimeRuleType.Weekday;
      case "t": return TimeRuleType.TimesIn;
      case "e": return TimeRuleType.Each;
      default: throw new Error(`Invalid time rule type: ${str}`)
    }
  }
}
