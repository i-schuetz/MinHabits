enum TimeRuleType {
  Weekday,
  TimesIn,
  Each,
  Date
}

namespace TimeRuleType {
  export function toString(timeRuleType: TimeRuleType): string {
      switch(timeRuleType) {
        case TimeRuleType.Weekday: return "w";
        case TimeRuleType.TimesIn: return "t";
        case TimeRuleType.Each: return "e";
        case TimeRuleType.Date: return "d";
      };
  }

  export function parse(str: string): TimeRuleType {
    switch(str) {
      case "w": return TimeRuleType.Weekday;
      case "t": return TimeRuleType.TimesIn;
      case "e": return TimeRuleType.Each;
      case "d": return TimeRuleType.Date;
      default: throw new Error(`Invalid time rule type: ${str}`)
    }
  }
}
