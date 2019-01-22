import * as TaskHelpers from "../../models/helpers/Task"

describe("Task", () => {
  it("Converts done status to boolean", () => {
    expect(TaskHelpers.toBoolean(TaskHelpers.TaskDoneStatus.DONE)).toEqual(true)
    expect(TaskHelpers.toBoolean(TaskHelpers.TaskDoneStatus.MISSED)).toEqual(false)
  })

  it("Converts done boolean to status", () => {
    expect(TaskHelpers.toDoneStatus(true)).toEqual(TaskHelpers.TaskDoneStatus.DONE)
    expect(TaskHelpers.toDoneStatus(false)).toEqual(TaskHelpers.TaskDoneStatus.MISSED)
  }) 
})