export function groupBy<T, U>(keyExtractor: (object: T) => U, objects: T[]): Map<U, T[]> {
  return objects.reduce((rv: Map<U, T[]>, object: T) => {
    var values: T[] | undefined = rv.get(keyExtractor(object))
    if (values === undefined) {
      values = []
    }
    values.push(object)
    rv.set(keyExtractor(object), values)
    return rv
  }, new Map())
}

export function associateBy<T, U>(keyExtractor: (object: T) => U, objects: T[]): Map<U, T> {
  return objects.reduce((rv: Map<U, T>, object: T) => {
    rv.set(keyExtractor(object), object)
    return rv
  }, new Map())
}
