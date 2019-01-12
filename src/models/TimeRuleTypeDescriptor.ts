export enum TimeRuleValueDescriptor {
  Weekday,
  Each
}

export namespace TimeRuleValueDescriptor {
  export function toJSON(timeRuleType: TimeRuleValueDescriptor): "w" | "e" {
      switch(timeRuleType) {
        case TimeRuleValueDescriptor.Weekday: return "w";
        case TimeRuleValueDescriptor.Each: return "e";
      };
  }

  export function parse(str: string): TimeRuleValueDescriptor {
    switch(str) {
      case "w": return TimeRuleValueDescriptor.Weekday;
      case "e": return TimeRuleValueDescriptor.Each;
      default: throw new Error(`Invalid time rule value descriptor: ${str}`)
    }
  }
}
